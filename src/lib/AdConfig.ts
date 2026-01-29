/**
 * AdConfig.ts - 広告設定の集約
 * Factory Protocol: ハードコーディング禁止、設定と機能の分離
 */

// Google AdMob Unit IDs
// App ID: ca-app-pub-7451636850767521~9704584608

// IAP Product IDs (要App Store Connect登録)
export const IAP_PRODUCT_ID = 'com.nagi.formula-calc.premium';
export const AD_CONFIG = {
    // Banner Ads
    BANNER_ID_IOS: 'ca-app-pub-7451636850767521/5274385009',
    BANNER_ID_ANDROID: 'ca-app-pub-3940256099942544/6300978111', // Test ID

    // Interstitial Ads
    INTERSTITIAL_ID_IOS: 'ca-app-pub-7451636850767521/7466585454',
    INTERSTITIAL_ID_ANDROID: 'ca-app-pub-3940256099942544/1033173712', // Test ID

    // Rewarded Video Ads
    REWARD_ID_IOS: 'ca-app-pub-7451636850767521/2837075303',
    REWARD_ID_ANDROID: 'ca-app-pub-3940256099942544/5224354917', // Test ID

    // Behavior Settings
    INTERSTITIAL_FREQUENCY: 10,  // 10回に1回インタースティシャルを表示
    REWARD_DURATION_MS: 24 * 60 * 60 * 1000, // 24時間 (ミリ秒)

    // Debug Settings
    DEBUG_REWARD_DURATION_MS: 60 * 1000, // デバッグ用: 1分間
    IS_TEST_MODE: false, // 本番モード（実機で本番広告を表示）
} as const;

// Storage Keys for persistence
export const STORAGE_KEYS = {
    IS_PREMIUM: 'ad_is_premium',
    AD_FREE_UNTIL: 'ad_free_until',
    CALC_COUNT: 'ad_calc_count',
} as const;

// Banner Height (pixels) - 標準的なAdMobバナーサイズ
// Banner Height (pixels) - 標準的なAdMobバナーサイズ + マージン
export const BANNER_HEIGHT = 75;
