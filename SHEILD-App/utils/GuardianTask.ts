import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { aiRiskEngine } from './AiRiskEngine';
import { DeviceEventEmitter } from 'react-native';
import { ActivityService } from '../services/ActivityService';
import { EmergencyService } from '../services/EmergencyService';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The core logic for the AI Guardian background task.
 * This runs inside the Android Foreground Service.
 */
export const registerGuardianTask = () => {
    ReactNativeForegroundService.add_task(async () => {
        try {
            // 1. Perform AI Risk Analysis
            const analysis = aiRiskEngine.performRiskAnalysis();

            // 2. Broadcast internal events for UI updates
            DeviceEventEmitter.emit('AI_RISK_DETECTED', analysis);

            // 3. Handle HIGH Risk (Auto Trigger SOS)
            if (analysis.riskLevel === 'HIGH' && analysis.confidence > 0.7) {
                console.log('🚨 GUARDIAN TASK: High risk confirmed! Triggering SOS workflow...');
                
                // Avoid duplicate triggers
                const lastTrigger = await AsyncStorage.getItem('LAST_AUTO_TRIGGER');
                const now = Date.now();
                if (lastTrigger && now - parseInt(lastTrigger) < 60000) {
                    return; // Don't trigger more than once a minute
                }
                await AsyncStorage.setItem('LAST_AUTO_TRIGGER', now.toString());

                // Start Emergency Workflow
                DeviceEventEmitter.emit('AUTO_EMERGENCY_TRIGGER', analysis);
                
                await ActivityService.logActivity(
                    `AUTO_SOS_TRIGGERED: ${analysis.triggers.join(', ')}`
                );
            }
            
            // 4. Log Passive updates occasionally (to keep database sync if desired)
            // (Skipped for battery optimization unless mode changes)

        } catch (error) {
            console.error('Error in Guardian Task:', error);
        }
    }, {
        delay: 3000, // Check every 3 seconds
        onLoop: true,
        taskId: 'guardian_main_task',
        onError: (e) => console.log('Guardian Task Error:', e),
    });
};
