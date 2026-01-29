/**
 * IAPManager.ts - In-App Purchase管理 (RevenueCat)
 * Factory Protocol: 設定不足でもクラッシュさせない Safety Fallback 実装
 */

import { Purchases, LOG_LEVEL, PurchasesStoreProduct } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { IAP_PRODUCT_ID } from './AdConfig';

const isNative = Capacitor.getPlatform() !== 'web';

/**
 * RevenueCat初期化
 * Safety Protocol: APIキー未設定でもクラッシュしない
 */
export async function initializeRevenueCat(): Promise<boolean> {
    if (!isNative) {
        console.log('[IAPManager] Web環境のため初期化スキップ');
        return false;
    }

    try {
        // RevenueCat API Keyは環境変数や別管理を想定
        // 未設定の場合も優雅にfallback
        const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY || '';

        if (!apiKey) {
            console.warn('[IAPManager] RevenueCat APIキー未設定。IAP機能は準備中です。');
            return false;
        }

        await Purchases.configure({
            apiKey: apiKey,
            appUserID: undefined, // 匿名ユーザーとして初期化
        });

        // デバッグログレベル設定
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

        console.log('[IAPManager] RevenueCat初期化完了');
        return true;
    } catch (error) {
        console.error('[IAPManager] RevenueCat初期化エラー:', error);
        console.warn('[IAPManager] IAP Setup Pending - アプリは継続動作します');
        return false;
    }
}

/**
 * 課金アイテムの価格を取得
 * Safety Protocol: 取得失敗時はプレースホルダー価格を返す
 */
export async function getProductPrice(): Promise<string> {
    if (!isNative) {
        return '¥---'; // Web環境
    }

    try {
        const products = await Purchases.getProducts({
            productIdentifiers: [IAP_PRODUCT_ID],
        });

        if (products.products && products.products.length > 0) {
            const product = products.products[0];
            return product.priceString || '¥---';
        }

        console.warn('[IAPManager] 商品情報が取得できませんでした');
        return '¥---';
    } catch (error) {
        console.error('[IAPManager] 商品情報取得エラー:', error);
        return '¥---';
    }
}

/**
 * プレミアムプラン購入処理
 * Safety Protocol: エラー時はユーザーに通知し、クラッシュさせない
 */
export async function purchasePremium(): Promise<{ success: boolean; message: string }> {
    if (!isNative) {
        console.log('[IAPManager] Web環境のため購入スキップ');
        return {
            success: false,
            message: 'Web環境では課金機能を利用できません。iOSアプリをご利用ください。',
        };
    }

    try {
        const purchaseResult = await Purchases.purchaseStoreProduct({
            product: { identifier: IAP_PRODUCT_ID } as PurchasesStoreProduct,
        });

        // 購入成功の確認
        if (purchaseResult.customerInfo.entitlements.active['premium']) {
            console.log('[IAPManager] 購入成功');
            return {
                success: true,
                message: '購入が完了しました。広告が削除されます。',
            };
        }

        console.warn('[IAPManager] 購入完了したがエンタイトルメントが有効化されていません');
        return {
            success: false,
            message: '購入処理中にエラーが発生しました。',
        };
    } catch (error: any) {
        console.error('[IAPManager] 購入エラー:', error);

        // ユーザーキャンセルの場合
        if (error?.code === 1 || error?.message?.includes('cancel')) {
            return {
                success: false,
                message: '', // キャンセル時はメッセージなし
            };
        }

        // 設定不足エラー
        if (error?.message?.includes('API key') || error?.message?.includes('configure')) {
            return {
                success: false,
                message: '課金機能の準備中です。しばらくお待ちください。',
            };
        }

        // その他のエラー
        return {
            success: false,
            message: '購入処理中にエラーが発生しました。時間をおいて再度お試しください。',
        };
    }
}

/**
 * 購入履歴のリストア（復元）
 * Safety Protocol: エラー時も優雅に処理
 */
export async function restorePurchases(): Promise<{ success: boolean; message: string }> {
    if (!isNative) {
        return {
            success: false,
            message: 'Web環境では復元機能を利用できません。',
        };
    }

    try {
        const customerInfo = await Purchases.restorePurchases();

        // プレミアムエンタイトルメントが有効か確認
        if (customerInfo.customerInfo.entitlements.active['premium']) {
            console.log('[IAPManager] 購入履歴を復元しました');
            return {
                success: true,
                message: '購入履歴を復元しました。',
            };
        }

        console.log('[IAPManager] 復元可能な購入履歴はありません');
        return {
            success: false,
            message: '復元可能な購入履歴が見つかりませんでした。',
        };
    } catch (error) {
        console.error('[IAPManager] リストアエラー:', error);
        return {
            success: false,
            message: '復元処理中にエラーが発生しました。',
        };
    }
}

/**
 * プレミアムステータスを確認
 * Safety Protocol: エラー時は false を返す
 */
export async function checkPremiumStatus(): Promise<boolean> {
    if (!isNative) {
        return false;
    }

    try {
        const customerInfo = await Purchases.getCustomerInfo();
        return !!customerInfo.customerInfo.entitlements.active['premium'];
    } catch (error) {
        console.error('[IAPManager] ステータス確認エラー:', error);
        return false;
    }
}
