/**
 * AdManager.ts - AdMob操作の抽象化レイヤー
 * Factory Protocol: Manager/Config Pattern
 */

import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions, RewardAdOptions, AdLoadInfo, AdMobRewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AD_CONFIG, BANNER_HEIGHT } from './AdConfig';

// Platform detection
const isIOS = Capacitor.getPlatform() === 'ios';
const isAndroid = Capacitor.getPlatform() === 'android';
const isNative = isIOS || isAndroid;

/**
 * AdMob初期化
 */
export async function initializeAdMob(): Promise<void> {
    if (!isNative) {
        console.log('[AdManager] Web環境のため初期化スキップ');
        return;
    }

    try {
        await AdMob.initialize({
            initializeForTesting: AD_CONFIG.IS_TEST_MODE,
        });
        console.log('[AdManager] AdMob初期化完了');
    } catch (error) {
        console.error('[AdManager] AdMob初期化エラー:', error);
    }
}

/**
 * バナー広告を表示
 */
export async function showBanner(): Promise<void> {
    if (!isNative) {
        console.log('[AdManager] Web環境のためバナースキップ');
        // Web環境でもCSS変数を設定（開発時確認用）
        updateBannerHeightCSS(BANNER_HEIGHT);
        return;
    }

    const options: BannerAdOptions = {
        adId: isIOS ? AD_CONFIG.BANNER_ID_IOS : AD_CONFIG.BANNER_ID_ANDROID,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: AD_CONFIG.IS_TEST_MODE,
    };

    try {
        // 楽観的にスペースを確保してから表示
        updateBannerHeightCSS(BANNER_HEIGHT);
        await AdMob.showBanner(options);
        console.log('[AdManager] バナー表示成功');
    } catch (error) {
        console.error('[AdManager] バナー表示エラー:', error);
        // 失敗したら元に戻す
        updateBannerHeightCSS(0);
    }
}

/**
 * バナー広告を非表示
 */
export async function hideBanner(): Promise<void> {
    if (!isNative) {
        updateBannerHeightCSS(0);
        return;
    }

    try {
        await AdMob.hideBanner();
        updateBannerHeightCSS(0);
        console.log('[AdManager] バナー非表示成功');
    } catch (error) {
        console.error('[AdManager] バナー非表示エラー:', error);
    }
}

/**
 * バナー広告を削除
 */
export async function removeBanner(): Promise<void> {
    if (!isNative) {
        updateBannerHeightCSS(0);
        return;
    }

    try {
        await AdMob.removeBanner();
        updateBannerHeightCSS(0);
        console.log('[AdManager] バナー削除成功');
    } catch (error) {
        console.error('[AdManager] バナー削除エラー:', error);
    }
}

/**
 * インタースティシャル広告をプリロード
 */
export async function prepareInterstitial(): Promise<void> {
    if (!isNative) return;

    const options: AdOptions = {
        adId: isIOS ? AD_CONFIG.INTERSTITIAL_ID_IOS : AD_CONFIG.INTERSTITIAL_ID_ANDROID,
        isTesting: AD_CONFIG.IS_TEST_MODE,
    };

    try {
        await AdMob.prepareInterstitial(options);
        console.log('[AdManager] インタースティシャルプリロード完了');
    } catch (error) {
        console.error('[AdManager] インタースティシャルプリロードエラー:', error);
    }
}

/**
 * インタースティシャル広告を表示
 */
export async function showInterstitial(): Promise<void> {
    if (!isNative) {
        console.log('[AdManager] Web環境のためインタースティシャルスキップ');
        return;
    }

    try {
        await AdMob.showInterstitial();
        console.log('[AdManager] インタースティシャル表示成功');
        // 次回のためにプリロード
        await prepareInterstitial();
    } catch (error) {
        console.error('[AdManager] インタースティシャル表示エラー:', error);
        // 失敗時も再プリロード試行
        await prepareInterstitial();
    }
}

/**
 * リワード動画広告をプリロード
 */
export async function prepareRewardVideo(): Promise<void> {
    if (!isNative) return;

    const options: RewardAdOptions = {
        adId: isIOS ? AD_CONFIG.REWARD_ID_IOS : AD_CONFIG.REWARD_ID_ANDROID,
        isTesting: AD_CONFIG.IS_TEST_MODE,
    };

    try {
        await AdMob.prepareRewardVideoAd(options);
        console.log('[AdManager] リワード動画プリロード完了');
    } catch (error) {
        console.error('[AdManager] リワード動画プリロードエラー:', error);
    }
}

/**
 * リワード動画広告を表示
 * @param onReward 報酬付与時のコールバック
 */
export async function showRewardVideo(onReward: (reward: AdMobRewardItem) => void): Promise<void> {
    if (!isNative) {
        console.log('[AdManager] Web環境のためリワード動画スキップ (デバッグ報酬付与)');
        // Web環境でもデバッグ用に報酬付与
        onReward({ type: 'debug', amount: 1 });
        return;
    }

    // リスナー登録 (非同期のためawait)
    const rewardListener = await AdMob.addListener(
        'onRewardedVideoAdReward' as never,
        (reward: AdMobRewardItem) => {
            console.log('[AdManager] リワード獲得:', reward);
            onReward(reward);
        }
    );

    try {
        await AdMob.showRewardVideoAd();
        console.log('[AdManager] リワード動画表示成功');
        // リスナー解除
        rewardListener.remove();
        // 次回のためにプリロード
        await prepareRewardVideo();
    } catch (error) {
        console.error('[AdManager] リワード動画表示エラー:', error);
        rewardListener.remove();
        // 失敗時も再プリロード試行
        await prepareRewardVideo();
    }
}


/**
 * CSS変数 --banner-height を更新
 */
function updateBannerHeightCSS(height: number): void {
    document.documentElement.style.setProperty('--banner-height', `${height}px`);
}

/**
 * 広告のプリロードを一括実行
 */
export async function preloadAds(): Promise<void> {
    await Promise.all([
        prepareInterstitial(),
        prepareRewardVideo(),
    ]);
}
