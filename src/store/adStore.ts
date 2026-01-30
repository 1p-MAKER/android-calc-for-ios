/**
 * adStore.ts - 広告状態管理 (Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AD_CONFIG, STORAGE_KEYS } from '@/lib/AdConfig';

interface AdState {
    // State
    isPremium: boolean;         // 課金判定用
    adFreeUntil: number;        // リワード報酬期限
    calcCount: number;

    // Computed property replacement (Zustand doesn't have computed natively like Vue, but we can expose a getter or just a state)
    isAdFree: boolean;

    // Actions
    incrementCalcCount: () => void;
    resetCalcCount: () => void;
    setAdFreeUntil: (timestamp: number) => void;
    grantRewardAdFree: () => void;
    setPremium: (active: boolean) => void;
    checkAdStatus: () => void; // Call this often
}

export const useAdStore = create<AdState>()(
    persist(
        (set, get) => ({
            isPremium: false,
            adFreeUntil: 0,
            calcCount: 0,
            isAdFree: false,

            incrementCalcCount: () => {
                set((state) => ({ calcCount: state.calcCount + 1 }));
            },

            resetCalcCount: () => {
                set({ calcCount: 0 });
            },

            setAdFreeUntil: (until: number) => {
                const isFree = Date.now() < until;
                set({ adFreeUntil: until, isAdFree: isFree || get().isPremium });
            },

            grantRewardAdFree: () => {
                const duration = AD_CONFIG.IS_TEST_MODE
                    ? AD_CONFIG.DEBUG_REWARD_DURATION_MS
                    : AD_CONFIG.REWARD_DURATION_MS;
                const until = Date.now() + duration;
                set({ adFreeUntil: until, isAdFree: true });
            },

            setPremium: (active: boolean) => {
                set({ isPremium: active, isAdFree: active || Date.now() < get().adFreeUntil });
            },

            checkAdStatus: () => {
                const { isPremium, adFreeUntil } = get();
                const now = Date.now();
                const isFree = isPremium || now < adFreeUntil;
                set({ isAdFree: isFree });
            }
        }),
        {
            name: STORAGE_KEYS.AD_PREFS,
        }
    )
);
