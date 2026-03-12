import React, { useEffect, useState, useRef } from 'react';
import {
    View, Alert, DeviceEventEmitter, Platform, PermissionsAndroid,
    Modal, Text, TouchableOpacity, StyleSheet, AppState, AppStateStatus
} from 'react-native';
import { VolumeManager } from 'react-native-volume-manager';
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
// Firebase Storage removed — using Cloudinary via backend /upload-recording
import haversine from 'haversine';
import BASE_URL from '../config/api';
import * as IntentLauncher from 'expo-intent-launcher';
import { MaterialIcons } from '@expo/vector-icons';

export default function EmergencyMonitor() {
    const [isListening, setIsListening] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [lowRiskKeywords, setLowRiskKeywords] = useState<string[]>([]);
    const [highRiskKeywords, setHighRiskKeywords] = useState<string[]>([]);

    // Refs to avoid dependency loops
    const keywordsRef = useRef<{ low: string[], high: string[] }>({ low: [], high: [] });
    const listeningRef = useRef(false);
    const volumeHistory = useRef<number[]>([]);
    const listeningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastShakeTime = useRef<number>(0);

    // LOW RISK modal state
    const [showLowWarning, setShowLowWarning] = useState(false);
    const [lowCountdown, setLowCountdown] = useState(5);

    // HIGH RISK modal + recording state
    const [showHighWarning, setShowHighWarning] = useState(false);
    const [highCountdown, setHighCountdown] = useState(8);
    const highCancelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const highTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Camera recording
    const [showCamera, setShowCamera] = useState(false);
    const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
    const [isRecording, setIsRecording] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const cameraRef = useRef<CameraView | null>(null);
    const videoRecordingRef = useRef<boolean>(false);
    const audioRecordingRef = useRef<Audio.Recording | null>(null);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    useEffect(() => {
        setup();
        const cancelSub = DeviceEventEmitter.addListener("EMERGENCY_LISTENING_CANCEL", () => stopListening());

        return () => {
            cancelSub.remove();
            Voice.destroy()
                .then(() => {
                    try { Voice.removeAllListeners(); } catch (e) { }
                })
                .catch(() => { });
        };
    }, []);

    const setup = async () => {
        const id = await AsyncStorage.getItem("userId");
        setUserId(id);
        if (id) await fetchKeywords(id);

        // Voice listeners
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechResults;
        Voice.onSpeechError = (e) => {
            console.log('Speech Error:', e);
            DeviceEventEmitter.emit("EMERGENCY_LISTENING_CANCEL");
            Voice.destroy().then(() => {
                listeningRef.current = false;
                setIsListening(false);
            });
        };
        Voice.onSpeechEnd = () => {
            DeviceEventEmitter.emit("EMERGENCY_LISTENING_CANCEL");
            Voice.destroy().then(() => {
                listeningRef.current = false;
                setIsListening(false);
            });
        };

        // Volume button trigger
        const volumeListener = VolumeManager.addVolumeListener(() => {
            const now = Date.now();
            volumeHistory.current.push(now);
            volumeHistory.current = volumeHistory.current.filter(t => now - t < 3000);
            if (volumeHistory.current.length >= 3 && !listeningRef.current) {
                volumeHistory.current = [];
                activateEmergencyListening();
            }
        });

        // Shake detection (safe — fails silently in Expo Go)
        let shakeListener: { remove: () => void } | null = null;
        try {
            const { Accelerometer } = require('expo-sensors');
            Accelerometer.setUpdateInterval(400);
            shakeListener = Accelerometer.addListener(({ x, y, z }: { x: number; y: number; z: number }) => {
                const force = Math.sqrt(x * x + y * y + z * z);
                if (force > 2.5 && !listeningRef.current) {
                    const now = Date.now();
                    if (now - lastShakeTime.current > 5000) {
                        lastShakeTime.current = now;
                        console.log('SHAKE DETECTED! Force:', force);
                        activateEmergencyListening();
                    }
                }
            });
        } catch (e) {
            console.log('Shake detection unavailable:', e);
        }

        return () => {
            volumeListener.remove();
            if (shakeListener) shakeListener.remove();
        };
    };

    const fetchKeywords = async (id: string) => {
        try {
            const [resLow, resHigh] = await Promise.all([
                fetch(`${BASE_URL}/get-keywords/${id}/LOW`),
                fetch(`${BASE_URL}/get-keywords/${id}/HIGH`)
            ]);
            const dataLow = await resLow.json();
            const dataHigh = await resHigh.json();

            const lowList = Array.isArray(dataLow)
                ? dataLow.map((k: any) => k.keyword_text.toLowerCase()).filter((k: string) => k.trim().length > 0)
                : [];
            const highList = Array.isArray(dataHigh)
                ? dataHigh.map((k: any) => k.keyword_text.toLowerCase()).filter((k: string) => k.trim().length > 0)
                : [];

            setLowRiskKeywords(lowList);
            setHighRiskKeywords(highList);
            keywordsRef.current = { low: lowList, high: highList };
            console.log('Keywords loaded:', keywordsRef.current);
        } catch (error) {
            console.log('Error fetching keywords:', error);
        }
    };

    const activateEmergencyListening = async () => {
        console.log("🔥 EMERGENCY LISTENING ACTIVATED");
        try {
            if (!userId) {
                const id = await AsyncStorage.getItem("userId");
                if (id) {
                    setUserId(id);
                    await fetchKeywords(id);
                }
            }

            listeningRef.current = true;
            setIsListening(true);
            DeviceEventEmitter.emit("EMERGENCY_LISTENING_START");
            await Voice.start('en-US');

            if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
            listeningTimeoutRef.current = setTimeout(() => {
                if (listeningRef.current) stopListening();
            }, 10000);

        } catch (e: any) {
            console.error("Voice Error: ", e);
            listeningRef.current = false;
            setIsListening(false);
            DeviceEventEmitter.emit("EMERGENCY_LISTENING_STOP");
        }
    };

    const onSpeechResults = (e: any) => {
        const results = e.value as string[];
        if (!results || results.length === 0) return;
        console.log("Detecting speech:", results);

        const isHighRisk = results.some(res =>
            keywordsRef.current.high.some(kw => res.toLowerCase().includes(kw))
        );

        if (isHighRisk) {
            handleHighRisk();
            stopListening();
            return;
        }

        const isLowRisk = results.some(res =>
            keywordsRef.current.low.some(kw => res.toLowerCase().includes(kw))
        );

        if (isLowRisk) {
            handleLowRisk();
            stopListening();
            return;
        }
    };

    const stopListening = async () => {
        if (!listeningRef.current) return;
        try {
            if (listeningTimeoutRef.current) {
                clearTimeout(listeningTimeoutRef.current);
                listeningTimeoutRef.current = null;
            }
            listeningRef.current = false;
            setIsListening(false);
            DeviceEventEmitter.emit("EMERGENCY_LISTENING_STOP");
            await Voice.cancel();
            await Voice.destroy();
        } catch (e) {
            console.log("Stop Listening Error:", e);
        }
    };

    // ─────────────────────────── LOW RISK ───────────────────────────

    const handleLowRisk = () => {
        setShowLowWarning(true);
        setLowCountdown(5);

        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (cancelTimeoutRef.current) clearTimeout(cancelTimeoutRef.current);

        timerIntervalRef.current = setInterval(() => {
            setLowCountdown(prev => {
                if (prev <= 1) { clearInterval(timerIntervalRef.current!); return 0; }
                return prev - 1;
            });
        }, 1000);

        cancelTimeoutRef.current = setTimeout(() => {
            clearInterval(timerIntervalRef.current!);
            setShowLowWarning(false);
            executeLowRiskAction();
        }, 5000);
    };

    const cancelLowRiskAlert = () => {
        if (cancelTimeoutRef.current) clearTimeout(cancelTimeoutRef.current);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setShowLowWarning(false);
    };

    const executeLowRiskAction = async () => {
        console.log("Executing LOW RISK action...");
        try {
            const email = await AsyncStorage.getItem("userEmail");

            // Location — never abort if it fails
            let lat: number | null = null;
            let lon: number | null = null;
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                    lat = loc.coords.latitude;
                    lon = loc.coords.longitude;
                }
            } catch (err) {
                console.log("Location fetch failed:", err);
            }

            if (email) {
                const contactResponse = await fetch(`${BASE_URL}/contacts/${email}`);
                if (contactResponse.ok) {
                    const data = await contactResponse.json();
                    const contacts = Array.isArray(data) ? data : (Array.isArray(data.contacts) ? data.contacts : []);

                    if (contacts.length > 0) {
                        let closestContact = contacts[0];
                        let minDistance = Infinity;
                        contacts.forEach((c: any) => {
                            if (lat !== null && lon !== null && c.latitude && c.longitude) {
                                const d = haversine(
                                    { latitude: lat, longitude: lon },
                                    { latitude: parseFloat(c.latitude), longitude: parseFloat(c.longitude) }
                                );
                                if (d < minDistance) { minDistance = d; closestContact = c; }
                            }
                        });

                        if (closestContact?.phone && Platform.OS === 'android') {
                            try {
                                const granted = await PermissionsAndroid.request(
                                    PermissionsAndroid.PERMISSIONS.CALL_PHONE
                                );
                                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                    IntentLauncher.startActivityAsync('android.intent.action.CALL', {
                                        data: `tel:${closestContact.phone}`
                                    }).catch(e => console.log("Call failed", e));
                                }
                            } catch (err) { console.warn(err); }
                        }
                    }

                    const sosRes = await fetch(`${BASE_URL}/send-sos`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, latitude: lat, longitude: lon }),
                    });
                    const sosData = await sosRes.json();
                    console.log(sosRes.ok ? "✅ LOW RISK emails sent:" : "❌ LOW RISK SOS failed:", sosData.message);
                }
            }
        } catch (error) {
            console.error("Error in LOW RISK sequence:", error);
        }
    };

    // ─────────────────────────── HIGH RISK ───────────────────────────

    const handleHighRisk = () => {
        console.log("🔴 HIGH RISK KEYWORD DETECTED");
        setShowHighWarning(true);
        setHighCountdown(8);

        if (highTimerIntervalRef.current) clearInterval(highTimerIntervalRef.current);
        if (highCancelTimeoutRef.current) clearTimeout(highCancelTimeoutRef.current);

        highTimerIntervalRef.current = setInterval(() => {
            setHighCountdown(prev => {
                if (prev <= 1) { clearInterval(highTimerIntervalRef.current!); return 0; }
                return prev - 1;
            });
        }, 1000);

        // After 8 seconds, if not cancelled → start recording
        highCancelTimeoutRef.current = setTimeout(() => {
            clearInterval(highTimerIntervalRef.current!);
            setShowHighWarning(false);
            startHighRiskRecording();
        }, 8000);
    };

    const cancelHighRiskAlert = () => {
        if (highCancelTimeoutRef.current) clearTimeout(highCancelTimeoutRef.current);
        if (highTimerIntervalRef.current) clearInterval(highTimerIntervalRef.current);
        setShowHighWarning(false);
        console.log("⛔ High risk recording cancelled by user.");
    };

    const startHighRiskRecording = async () => {
        console.log("📹 Starting high risk video + audio recording...");

        // Request all permissions
        if (!cameraPermission?.granted) {
            const result = await requestCameraPermission();
            if (!result.granted) {
                console.log("Camera permission denied.");
                // Fall back to audio-only
                startAudioOnlyRecording();
                return;
            }
        }

        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

        // Show hidden camera view for recording
        setCameraFacing('back');
        setShowCamera(true);
        setIsRecording(true);
        setUploadStatus('Recording...');
    };

    // Called from CameraView once it's mounted and ready
    const startVideoCapture = async () => {
        if (!cameraRef.current || videoRecordingRef.current) return;
        videoRecordingRef.current = true;

        try {
            console.log("▶️ Video recording started");

            // Record 30 seconds of video (adjust as needed)
            const videoPromise = cameraRef.current.recordAsync({
                maxDuration: 30,
            } as any);

            // Switch camera if it looks dark after 3 seconds
            setTimeout(async () => {
                if (videoRecordingRef.current) {
                    console.log("Checking if camera is blank — switching to front camera");
                    setCameraFacing(prev => prev === 'back' ? 'front' : 'back');
                }
            }, 3000);

            const videoResult = await videoPromise;

            if (videoResult && videoResult.uri) {
                console.log("✅ Video saved at:", videoResult.uri);
                setUploadStatus('Uploading to Cloudinary...');
                await uploadToCloudinary(videoResult.uri, 'video');
            }
        } catch (err) {
            console.error("Video recording error:", err);
            // Fall back to audio only
            startAudioOnlyRecording();
        } finally {
            videoRecordingRef.current = false;
            setIsRecording(false);
            setShowCamera(false);
        }
    };

    const stopVideoRecording = () => {
        if (cameraRef.current && videoRecordingRef.current) {
            cameraRef.current.stopRecording();
        }
    };

    const startAudioOnlyRecording = async () => {
        console.log("🎙️ Starting audio-only recording as fallback...");
        try {
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const recording = new Audio.Recording();
            audioRecordingRef.current = recording;
            await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await recording.startAsync();

            setTimeout(async () => {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                if (uri) {
                    setUploadStatus('Uploading audio to Cloudinary...');
                    await uploadToCloudinary(uri, 'audio');
                }
                setIsRecording(false);
            }, 30000);
        } catch (err) {
            console.error("Audio recording error:", err);
            setIsRecording(false);
        }
    };

    /**
     * uploadToCloudinary
     * Sends the recorded file to the backend /upload-recording endpoint as
     * multipart/form-data. The backend uploads to Cloudinary, saves the
     * secure_url to MySQL (emergency_recordings table), and emails all trusted
     * contacts with the recording link — all in one atomic request.
     */
    const uploadToCloudinary = async (localUri: string, type: 'video' | 'audio') => {
        try {
            const email = await AsyncStorage.getItem("userEmail");
            if (!email) {
                console.warn("⚠️ No user email found — cannot upload recording");
                setUploadStatus('Upload failed: not logged in');
                return;
            }

            const extension = type === 'video' ? 'mp4' : 'm4a';
            const mimeType  = type === 'video' ? 'video/mp4' : 'audio/m4a';
            const fileName  = `emergency_${type}_${Date.now()}.${extension}`;

            // Verify the file actually exists on device
            const fileInfo = await FileSystem.getInfoAsync(localUri);
            if (!fileInfo.exists) throw new Error("Recorded file not found on device");

            // Get location for the SOS email
            const locationStr = await getLocationString();

            // Build FormData — React Native's fetch supports multipart natively
            const formData = new FormData();
            formData.append('file', {
                uri: localUri,
                name: fileName,
                type: mimeType,
            } as any);
            formData.append('email', email);
            formData.append('type', type);
            formData.append('location', locationStr);

            console.log(`☁️ Sending ${type} to backend for Cloudinary upload...`);
            const response = await fetch(`${BASE_URL}/upload-recording`, {
                method: 'POST',
                body: formData,
                // NOTE: Do NOT set Content-Type manually — fetch sets the correct
                // multipart boundary automatically when body is FormData.
            });

            const data = await response.json();

            if (response.ok) {
                console.log("✅ Cloudinary upload succeeded:", data.cloudinaryUrl);
                setUploadStatus('✅ Upload complete!');
            } else {
                console.error("❌ Backend upload error:", data.message);
                setUploadStatus('Upload failed');
            }

        } catch (err) {
            console.error("uploadToCloudinary error:", err);
            setUploadStatus('Upload failed');
        }
    };

    const getLocationString = async (): Promise<string> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                return `https://www.google.com/maps?q=${loc.coords.latitude},${loc.coords.longitude}`;
            }
        } catch (_) { }
        return 'Location unavailable';
    };

    // ─────────────────────────── RENDER ───────────────────────────

    return (
        <>
            {/* ───── LOW RISK WARNING MODAL ───── */}
            <Modal visible={showLowWarning} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.warningIconWrap}>
                            <MaterialIcons name="warning" size={36} color="#f59e0b" />
                        </View>
                        <Text style={styles.modalTitle}>LOW RISK DETECTED</Text>
                        <Text style={styles.modalText}>
                            Alerting your trusted contacts in{'\n'}
                            <Text style={styles.countdown}>{lowCountdown}s</Text>
                        </Text>
                        <TouchableOpacity style={styles.cancelBtn} onPress={cancelLowRiskAlert}>
                            <MaterialIcons name="block" size={18} color="#ccc" />
                            <Text style={styles.cancelBtnText}>DISABLE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ───── HIGH RISK WARNING MODAL ───── */}
            <Modal visible={showHighWarning} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, styles.highRiskContent]}>
                        <View style={styles.highRiskIconWrap}>
                            <MaterialIcons name="videocam" size={36} color="#ec1313" />
                        </View>
                        <Text style={[styles.modalTitle, { color: '#ec1313' }]}>⚠️ HIGH RISK DETECTED</Text>
                        <Text style={styles.modalText}>
                            Video & audio recording will start in{'\n'}
                            <Text style={[styles.countdown, { color: '#ec1313' }]}>{highCountdown}s</Text>
                        </Text>
                        <Text style={styles.subText}>Recording will be uploaded to cloud storage</Text>
                        <TouchableOpacity style={[styles.cancelBtn, styles.highCancelBtn]} onPress={cancelHighRiskAlert}>
                            <MaterialIcons name="block" size={18} color="#ccc" />
                            <Text style={styles.cancelBtnText}>DISABLE RECORDING</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ───── HIDDEN CAMERA VIEW (recording in background) ───── */}
            {showCamera && (
                <Modal visible={showCamera} transparent animationType="none">
                    <View style={styles.cameraOverlay}>
                        <CameraView
                            ref={cameraRef}
                            style={styles.hiddenCamera}
                            facing={cameraFacing}
                            mode="video"
                            onCameraReady={startVideoCapture}
                        />
                        <View style={styles.recordingBadge}>
                            <View style={styles.recordingDot} />
                            <Text style={styles.recordingText}>REC • {uploadStatus}</Text>
                        </View>
                        <TouchableOpacity style={styles.stopBtn} onPress={stopVideoRecording}>
                            <MaterialIcons name="stop-circle" size={32} color="#fff" />
                            <Text style={styles.stopBtnText}>Stop Recording</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.flipBtn}
                            onPress={() => setCameraFacing(f => f === 'back' ? 'front' : 'back')}
                        >
                            <MaterialIcons name="flip-camera-android" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.85)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#1e1414",
        padding: 28,
        borderRadius: 24,
        width: "100%",
        alignItems: "center",
        elevation: 10,
        borderWidth: 1,
        borderColor: "rgba(245,158,11,0.3)",
    },
    highRiskContent: {
        borderColor: "rgba(236,19,19,0.4)",
        backgroundColor: "#1a0f0f",
    },
    warningIconWrap: {
        backgroundColor: "rgba(245,158,11,0.15)",
        padding: 16,
        borderRadius: 50,
        marginBottom: 14,
    },
    highRiskIconWrap: {
        backgroundColor: "rgba(236,19,19,0.15)",
        padding: 16,
        borderRadius: 50,
        marginBottom: 14,
    },
    modalTitle: {
        color: "#f59e0b",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        letterSpacing: 1,
    },
    modalText: {
        color: "#fff",
        fontSize: 15,
        marginBottom: 10,
        textAlign: "center",
        lineHeight: 24,
    },
    countdown: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#f59e0b",
    },
    subText: {
        color: "#888",
        fontSize: 12,
        marginBottom: 22,
        textAlign: "center",
    },
    cancelBtn: {
        backgroundColor: "#2a2a2a",
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#555",
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        marginTop: 10,
    },
    highCancelBtn: {
        borderColor: "#ec1313",
        backgroundColor: "rgba(236,19,19,0.1)",
    },
    cancelBtnText: {
        color: "#ccc",
        fontWeight: "bold",
        fontSize: 14,
        letterSpacing: 0.5,
    },
    // Camera overlay styles
    cameraOverlay: {
        flex: 1,
        backgroundColor: "#000",
    },
    hiddenCamera: {
        flex: 1,
    },
    recordingBadge: {
        position: "absolute",
        top: 50,
        left: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 8,
    },
    recordingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#ec1313",
    },
    recordingText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    stopBtn: {
        position: "absolute",
        bottom: 60,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(236,19,19,0.85)",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 50,
        gap: 8,
    },
    stopBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },
    flipBtn: {
        position: "absolute",
        top: 50,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 30,
    },
});
