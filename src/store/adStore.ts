/**
 * adStore.ts - 広告状態管理 (Zustand)
 * Factory Protocol: 既存calculatorStoreとは分離し、Add方式で実装
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AD_CONFIG, STORAGE_KEYS } from '@/lib/AdConfig';

interface AdState {
    // State
    isPremium: boolean;         // 課金済みフラグ
    adFreeUntil: number;        // リワード報酬期限 (timestamp)
    calcCount: number;          // 計算回数カウンター

    // Computed
    shouldShowAds: () => boolean;
    shouldShowInterstitial: () => boolean;

    // Actions
    incrementCalcCount: () => void;
    resetCalcCount: () => void;
    setAdFreeUntil: (until: number) => void;
    grantRewardAdFree: () => void;  // リワード視聴完了時
    setPremium: (value: boolean) => void;
    togglePremiumDebug: () => void; // デバッグ用
}

export const useAdStore = create<AdState>()(
    persist(
        (set, get) => ({
            // Initial State
            isPremium: false,
            adFreeUntil: 0,
            calcCount: 0,

            // Computed: 広告を表示すべきか判定
            shouldShowAds: () => {
                const { isPremium, adFreeUntil } = get();
                // 課金済み、またはリワード報酬期間内なら広告を出さない
                if (isPremium || Date.now() < adFreeUntil) {
                    return false;
                }
                return true;
            },

            // Computed: インタースティシャルを表示すべきか判定
            shouldShowInterstitial: () => {
                const { calcCount, shouldShowAds } = get();
                if (!shouldShowAds()) return false;
                // 10回に1回
                return calcCount > 0 && calcCount % AD_CONFIG.INTERSTITIAL_FREQUENCY === 0;
            },

            // Actions
            incrementCalcCount: () => {
                set((state) => ({ calcCount: state.calcCount + 1 }));
            },

            resetCalcCount: () => {
                set({ calcCount: 0 });
            },

            setAdFreeUntil: (until: number) => {
                set({ adFreeUntil: until });
            },

            grantRewardAdFree: () => {
                // デバッグモードの場合は短い期間を使用
                const duration = AD_CONFIG.IS_TEST_MODE
                    ? AD_CONFIG.DEBUG_REWARD_DURATION_MS
                    : AD_CONFIG.REWARD_DURATION_MS;
                const until = Date.now() + duration;
                set({ adFreeUntil: until });
                console.log('[AdStore] リワード報酬付与:', new Date(until).toLocaleString());
            },

            setPremium: (value: boolean) => {
                set({ isPremium: value });
            },

            togglePremiumDebug: () => {
                set((state) => {
                    const newValue = !state.isPremium;
                    console.log('[AdStore] Premium toggled (debug):', newValue);
                    return { isPremium: newValue };
                });
            },
        }),
        {
            name: 'ad-storage', // localStorage key
            partialize: (state) => ({
                isPremium: state.isPremium,
                adFreeUntil: state.adFreeUntil,
                // calcCountはセッション毎にリセットするため永続化しない
            }),
        }
    )
);
