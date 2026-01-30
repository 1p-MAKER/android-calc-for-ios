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
            // お掃除
            AdManager.hideBanner().catch(() => { });
        };
    }, [isAdFree]);

    return null; // ネイティブ広告なのでDOMは描画しない
};
