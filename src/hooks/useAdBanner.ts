import { useEffect } from 'react';
import { AdManager } from '@/lib/AdManager';
import { useAdStore } from '@/store/adStore';

export const useAdBanner = () => {
    const { isAdFree } = useAdStore();

    useEffect(() => {
        const initAds = async () => {
            if (isAdFree) {
                await AdManager.hideBanner();
                return;
            }

            try {
                await AdManager.initialize();
                await AdManager.showBanner();
            } catch (error) {
                console.error('Ad initialization failed:', error);
            }
        };

        initAds();

        return () => {
            AdManager.hideBanner().catch(() => { });
        };
    }, [isAdFree]);
};
