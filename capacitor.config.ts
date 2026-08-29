import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecomastery.app',
  appName: 'EcoMastery',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
