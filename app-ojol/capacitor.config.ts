import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'app-ojol',
  webDir: 'www',
  plugins: {
    Geolocation: {
      enableHighAccuracy: true
    }
  },
  android: {
    allowMixedContent: true // jika kamu fetch API dari http bukan https
  }
};

export default config;
