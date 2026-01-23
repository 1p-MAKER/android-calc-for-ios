import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nagi.formula-calc',
  appName: '電卓',
  webDir: 'out',
  plugins: {
    AdMob: {
      // Google AdMob Test IDs -> Production ID (iOS)
      appIdIos: 'ca-app-pub-7451636850767521~9704584608',
      appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
    }
  }
};

export default config;
