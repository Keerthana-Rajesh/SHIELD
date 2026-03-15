import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

export interface Activity {
    id: string;
    type: 'AI_RISK' | 'KEYWORD' | 'SOS';
    level: 'LOW' | 'HIGH' | 'INFO';
    title: string;
    details: string;
    timestamp: number;
}

const STORAGE_KEY = "SHIELD_ACTIVITIES";

export const ActivityService = {
    async logActivity(activity: Omit<Activity, 'id' | 'timestamp'>) {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            let activities: Activity[] = raw ? JSON.parse(raw) : [];
            
            const newActivity: Activity = {
                ...activity,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now()
            };
            
            activities = [newActivity, ...activities].slice(0, 50); // Keep last 50
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
            DeviceEventEmitter.emit("ACTIVITY_UPDATED");
            return newActivity;
        } catch (e) {
            console.error("Error logging activity:", e);
        }
    },

    async getActivities(): Promise<Activity[]> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    async clearActivities() {
        await AsyncStorage.removeItem(STORAGE_KEY);
    }
};
