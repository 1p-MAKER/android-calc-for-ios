'use client';

/**
 * AdBanner.tsx - バナー広告コンポーネント
 * 画面最下部に固定表示、shouldShowAds()に基づく制御
 */

import { useEffect } from 'react';
import { useAdStore } from '@/store/adStore';
import { showBanner, hideBanner, removeBanner, initializeAdMob, preloadAds } from '@/lib/AdManager';

export const AdBanner = () => {
    const shouldShowAds = useAdStore((state) => state.shouldShowAds);

    useEffect(() => {
        // AdMob初期化
        const init = async () => {
            await initializeAdMob();
            await preloadAds();

            // 広告表示判定
            if (shouldShowAds()) {
                await showBanner();
            }
        };

        init();

        // クリーンアップ
        return () => {
            removeBanner();
        };
    }, []);

    // shouldShowAds の変化を監視してバナー表示/非表示を制御
    useEffect(() => {
        if (shouldShowAds()) {
            showBanner();
        } else {
            hideBanner();
        }
    }, [shouldShowAds]);

    // このコンポーネント自体は何もレンダリングしない
    // バナーはネイティブレイヤーで表示される
    // CSS変数 --banner-height はAdManager内で制御
    return null;
};
