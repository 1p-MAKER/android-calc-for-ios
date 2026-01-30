'use client';

/**
 * AdBanner.tsx - バナー広告コンポーネント
 * 画面最下部に固定表示、shouldShowAds()に基づく制御
 */

import { useEffect } from 'react';
import { useAdStore } from '@/store/adStore';
import { AdManager } from '@/lib/AdManager';

export const AdBanner = () => {
    const { isAdFree } = useAdStore();

    useEffect(() => {
        // 初期化と表示
        const init = async () => {
            if (!isAdFree) {
                await AdManager.initialize();
                await AdManager.showBanner();
            } else {
                await AdManager.hideBanner();
            }
        };
        init();

        return () => {
        }, [shouldShowAds]);

    // このコンポーネント自体は何もレンダリングしない
    // バナーはネイティブレイヤーで表示される
    // CSS変数 --banner-height はAdManager内で制御
    return null;
};
