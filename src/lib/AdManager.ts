/**
 * AdManager.ts - AdMob操作の抽象化レイヤー
 * Factory Protocol: Manager/Config Pattern
 * Export Pattern: Named Export of "AdManager" object
 */

import { AdMob, BannerAdSize, BannerAdPosition, AdOptions, RewardAdOptions, AdLoadInfo, AdMobRewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AD_CONFIG, BANNER_HEIGHT } from './AdConfig';
import { AppTrackingTransparency } from 'capacitor-plugin-app-tracking-transparency';

const isIOS = Capacitor.getPlatform() === 'ios';
const isNative = Capacitor.isNativePlatform();

async function initialize(): Promise<void> {
    if (!isNative) return;

    if (isIOS) {
        try {
            await AppTrackingTransparency.requestPermission();
        } catch (e) {
            console.warn('[AdManager] ATT Request Failed', e);
        }
    }

    try {
        await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: AD_CONFIG.IS_TEST_MODE ? ['2077ef9a63d2b398840261c8221a0c9b'] : undefined,
            initializeForTesting: AD_CONFIG.IS_TEST_MODE,
        });
        console.log('[AdManager] Initialized');
    } catch (e) {
        console.error('[AdManager] Init failed', e);
    }
}

async function showBanner(): Promise<void> {
    if (!isNative) return;
    try {
        const options: AdOptions = {
            adId: isIOS ? AD_CONFIG.BANNER_ID_IOS : AD_CONFIG.BANNER_ID_ANDROID,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: AD_CONFIG.IS_TEST_MODE,
        };
        await AdMob.showBanner(options);

        // CSS変数セット
        document.documentElement.style.setProperty('--banner-height', BANNER_HEIGHT);
    } catch (e) {
        console.error('[AdManager] Show Banner failed', e);
    }
}

async function hideBanner(): Promise<void> {
    if (!isNative) return;
    try {
        await AdMob.hideBanner();
        await AdMob.removeBanner();
        document.documentElement.style.setProperty('--banner-height', '0px');
    } catch (e) {
        console.warn('[AdManager] Hide error', e);
    }
}

async function showRewardVideo(onReward: (reward: AdMobRewardItem) => void): Promise<void> {
    if (!isNative) {
        onReward({ type: 'debug', amount: 1 });
        return;
    }

    try {
        const options: RewardAdOptions = {
            adId: isIOS ? AD_CONFIG.REWARD_ID_IOS : AD_CONFIG.REWARD_ID_ANDROID,
            isTesting: AD_CONFIG.IS_TEST_MODE,
        };

        await AdMob.prepareRewardVideoAd(options);

        const rewardListener = AdMob.addListener('onRewardVideoRewardReceived', (reward: AdMobRewardItem) => {
            onReward(reward);
            rewardListener.remove();
        });

        await AdMob.showRewardVideoAd();
    } catch (e) {
        console.error('[AdManager] Reward Video failed', e);
        // Fallback for user experience in case of ad failure
        // onReward({ type: 'fallback', amount: 1 }); 
    }
}

export const AdManager = {
    initialize,
    showBanner,
    hideBanner,
    showRewardVideo
};
