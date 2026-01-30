/**
 * IAPManager.ts - In-App Purchase管理 (RevenueCat)
 * Factory Protocol: 設定不足でもクラッシュさせない Safety Fallback 実装
 * Export Pattern: Named Export of "IAPManager" object for consistency
 */

import { Purchases, LOG_LEVEL, PurchasesStoreProduct } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { IAP_PRODUCT_ID } from './AdConfig';

const isNative = Capacitor.getPlatform() !== 'web';

// Internal implementation functions
async function initializeRevenueCat(): Promise<boolean> {
    if (!isNative) {
        console.log('[IAPManager] Web環境のため初期化スキップ');
        return false;
    }

    try {
        const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY || '';
        if (!apiKey) {
            console.warn('[IAPManager] RevenueCat APIキー未設定。IAP機能は準備中です。');
            return false;
        }

        await Purchases.configure({ apiKey });
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

        console.log('[IAPManager] RevenueCat初期化完了');
        return true;
    } catch (error) {
        console.warn('[IAPManager] IAP Setup Pending', error);
        return false;
    }
}

async function getProductPrice(): Promise<string> {
    if (!isNative) return '¥100';
    try {
        const products = await Purchases.getProducts({ productIdentifiers: [IAP_PRODUCT_ID] });
        return products.products?.[0]?.priceString || '¥100';
    } catch (error) {
        return '¥100';
    }
}

async function purchasePremium(): Promise<{ success: boolean; message: string }> {
    if (!isNative) return { success: false, message: 'Web環境では利用できません。' };

    try {
        const purchaseResult = await Purchases.purchaseStoreProduct({
            product: { identifier: IAP_PRODUCT_ID } as PurchasesStoreProduct,
        });

        if (purchaseResult.customerInfo.entitlements.active['premium']) {
            return { success: true, message: '購入が完了しました。' };
        }
        return { success: false, message: '購入処理中にエラーが発生しました。' };
    } catch (error: any) {
        console.error('[IAPManager] Purchase Error', error);
        if (error?.userCancelled) return { success: false, message: '' };
        return { success: false, message: '購入がキャンセルまたは失敗しました。' };
    }
}

async function restorePurchases(): Promise<{ success: boolean; message: string }> {
    if (!isNative) return { success: false, message: 'Web環境です。' };

    try {
        const customerInfo = await Purchases.restorePurchases();
        if (customerInfo.customerInfo.entitlements.active['premium']) {
            return { success: true, message: '購入履歴を復元しました。' };
        }
        return { success: false, message: '復元可能な購入履歴が見つかりませんでした。' };
    } catch (error) {
        return { success: false, message: '復元に失敗しました。' };
    }
}

async function checkSubscriptionStatus(): Promise<boolean> {
    if (!isNative) return false;
    try {
        const customerInfo = await Purchases.getCustomerInfo();
        return !!customerInfo.customerInfo.entitlements.active['premium'];
    } catch (error) {
        return false;
    }
}

// Ensure "IAPManager" object is exported to match import { IAPManager } from ...
export const IAPManager = {
    initializeRevenueCat,
    getProductPrice,
    purchasePremium,
    restorePurchases,
    checkSubscriptionStatus
};
