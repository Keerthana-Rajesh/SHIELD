import BASE_URL from "../config/api";

export const EmergencyService = {
    // 3. Emergency Incident Creation
    async startEmergency(userId: string, keyword: string | null = null, locationUrl: string) {
        try {
            const res = await fetch(`${BASE_URL}/emergency/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_id: userId, 
                    detected_keyword: keyword, 
                    location_url: locationUrl,
                    status: 'ACTIVE'
                }),
            });
            return await res.json(); // should return { success: true, emergency_id: ... }
        } catch (e) {
            console.error("Error starting emergency:", e);
            return { success: false };
        }
    },

    // 14. Update Status (Safe)
    async endEmergency(emergencyId: number) {
        try {
            const res = await fetch(`${BASE_URL}/emergency/end`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emergency_id: emergencyId }),
            });
            return await res.json();
        } catch (e) {
            console.error("Error ending emergency:", e);
        }
    },

    // 4. Audio Record
    async logAudio(emergencyId: number, filePath: string) {
        try {
            await fetch(`${BASE_URL}/emergency/audio`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emergency_id: emergencyId, audio_file_path: filePath }),
            });
        } catch (e) {
            console.error("Error logging audio:", e);
        }
    },

    // 5. Video Record
    async logVideo(emergencyId: number, cameraType: 'front' | 'rear', filePath: string) {
        try {
            await fetch(`${BASE_URL}/emergency/video`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emergency_id: emergencyId, camera_type: cameraType, video_file_path: filePath }),
            });
        } catch (e) {
            console.error("Error logging video:", e);
        }
    },

    // 7. Alert Logging (SMS/Email)
    async logAlert(emergencyId: number, alertType: 'email' | 'sms') {
        try {
            await fetch(`${BASE_URL}/emergency/alert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emergency_id: emergencyId, alert_type: alertType }),
            });
        } catch (e) {
            console.error("Error logging alert:", e);
        }
    },

    // 8. Call Logging
    async logCall(emergencyId: number, status: 'DIALLED' | 'ANSWERED' | 'FAILED') {
        try {
            await fetch(`${BASE_URL}/emergency/call`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emergency_id: emergencyId, call_status: status }),
            });
        } catch (e) {
            console.error("Error logging call:", e);
        }
    },

    // 13. QR Trigger
    async triggerQR(token: string, userId: string, lat: number, lon: number) {
        try {
            const res = await fetch(`${BASE_URL}/qr/trigger`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, user_id: userId, latitude: lat, longitude: lon }),
            });
            return await res.json();
        } catch (e) {
            console.error("Error triggering QR emergency:", e);
        }
    },

    // 12. Access Link
    async createAccessLink(evidenceId: number, level: 'view' | 'download', expiry: string) {
        try {
            const res = await fetch(`${BASE_URL}/access-link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ evidence_id: evidenceId, access_level: level, expiry_time: expiry }),
            });
            return await res.json();
        } catch (e) {
            console.error("Error creating access link:", e);
        }
    }
};

export const ProfileService = {
    // 1. User Profile Storage
    async saveProfile(userId: string, info: string) {
        try {
            await fetch(`${BASE_URL}/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, emergency_info: info }),
            });
        } catch (e) {
            console.error("Error saving profile:", e);
        }
    },

    // 2. Hardware Trigger
    async saveHardwareTrigger(userId: string, status: boolean, pattern: string = 'triple_press') {
        try {
            await fetch(`${BASE_URL}/hardware-trigger`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, trigger_status: status, button_pattern: pattern }),
            });
        } catch (e) {
            console.error("Error saving hardware trigger status:", e);
        }
    }
};

export const FakeCallService = {
    // 11. Fake Call
    async triggerFakeCall(userId: string, name: string) {
        try {
            await fetch(`${BASE_URL}/fake-call`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, caller_name: name, trigger_method: 'manual_button' }),
            });
        } catch (e) {
            console.error("Error triggering fake call:", e);
        }
    }
};
