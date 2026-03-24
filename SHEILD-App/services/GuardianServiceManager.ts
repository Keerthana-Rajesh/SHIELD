import { NativeModules, Platform } from 'react-native';

const { GuardianModule } = NativeModules;

/**
 * Manages the native Android Foreground Service for the AI Guardian.
 */
export const GuardianServiceManager = {
  /**
   * Starts the persistent foreground service.
   * On Android, this triggers the Notification and sticky service behavior.
   */
  async start() {
    if (Platform.OS !== 'android') return;
    try {
      if (GuardianModule) {
        await GuardianModule.start();
        console.log('✅ Native Guardian Service Started');
      } else {
        console.warn('❌ GuardianModule not found in native modules');
      }
    } catch (error) {
      console.error('Failed to start Guardian Service:', error);
    }
  },

  /**
   * Stops the persistent foreground service.
   */
  async stop() {
    if (Platform.OS !== 'android') return;
    try {
      if (GuardianModule) {
        await GuardianModule.stop();
        console.log('🛑 Native Guardian Service Stopped');
      }
    } catch (error) {
      console.error('Failed to stop Guardian Service:', error);
    }
  }
};
