import { NativeModules, PermissionsAndroid, Platform } from "react-native";
import Voice from "@react-native-voice/voice";

const VOICE_START_METHOD = "startSpeech";

export function isVoiceModuleAvailable() {
  const nativeVoiceModule = NativeModules.Voice;
  return Boolean(
    Voice &&
      nativeVoiceModule &&
      typeof nativeVoiceModule[VOICE_START_METHOD] === "function"
  );
}

export async function ensureVoicePermission() {
  if (Platform.OS !== "android") {
    return true;
  }

  const currentStatus = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
  );

  if (currentStatus) {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: "Microphone permission required",
      message:
        "SHIELD needs microphone access to detect emergency voice commands.",
      buttonPositive: "Allow",
      buttonNegative: "Deny",
    }
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function safeVoiceStart(locale = "en-US") {
  if (!isVoiceModuleAvailable()) {
    return {
      ok: false,
      reason:
        "Voice native module is unavailable. Rebuild the Android development app with expo run:android.",
    };
  }

  const hasPermission = await ensureVoicePermission();
  if (!hasPermission) {
    return {
      ok: false,
      reason: "Microphone permission was denied.",
    };
  }

  try {
    const available = await Voice.isAvailable();
    if (!available) {
      return {
        ok: false,
        reason: "No speech recognition service is available on this device.",
      };
    }
  } catch (error) {
    return {
      ok: false,
      reason: `Voice availability check failed: ${String(error)}`,
    };
  }

  try {
    await Voice.start(locale);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: `Voice.start failed: ${String(error)}`,
    };
  }
}

export async function safeVoiceStop() {
  if (!isVoiceModuleAvailable()) {
    return;
  }

  try {
    await Voice.stop();
  } catch {}
}

export async function safeVoiceCancel() {
  if (!isVoiceModuleAvailable()) {
    return;
  }

  try {
    await Voice.cancel();
  } catch {}
}

export async function safeVoiceDestroy() {
  if (!isVoiceModuleAvailable()) {
    return;
  }

  try {
    await Voice.destroy();
  } catch {}

  try {
    Voice.removeAllListeners();
  } catch {}
}
