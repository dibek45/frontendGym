import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dibek.app',
  appName: 'DibekSolutionsApp',
  webDir: 'dist/frontend',
  server: {
    // Si quieres servir la app en HTTP localmente (evitando Mixed Content con http://192.168...),
    // pero a la vez hacer requests a HTTPS en producción:
    androidScheme: 'https',
    iosScheme: 'https',

    // Lista de dominios/IPs permitidos:
    allowNavigation: [
      'https://api.dibeksolutions.com',
  // dominio de tu API en producción
    ],
  },
};
export default config;
