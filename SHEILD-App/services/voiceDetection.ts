import { DeviceEventEmitter } from "react-native";
import { triggerLowRisk, triggerHighRisk } from "./emergencyActions";
import {
    isVoiceModuleAvailable,
    safeVoiceStart,
    safeVoiceStop,
    voiceRuntime,
} from "./voiceModule";
import { findMatchedKeyword, normalizeSpeechText } from "./keywordMatcher";
import { fetchKeywords } from "./keywordService";
import AsyncStorage from "@react-native-async-storage/async-storage";

let lowRiskKeywords = ["call me", "come later", "emergency"];
let highRiskKeywords = ["help", "danger", "save me", "help help"];

export const syncKeywords = async () => {
    try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
            const data = await fetchKeywords(userId);
            if (data.lowKeywords && data.lowKeywords.length > 0) lowRiskKeywords = data.lowKeywords;
            if (data.highKeywords && data.highKeywords.length > 0) highRiskKeywords = data.highKeywords;
            console.log("🗣️ Voice keywords synced from backend:", { low: lowRiskKeywords.length, high: highRiskKeywords.length });
        }
    } catch (error) {
        console.log("Keyword sync failed", error);
    }
};

export const startVoiceListening = async () => {
    console.log("🗣️ Attempting to start voice detection...");
    await syncKeywords();
    const result = await safeVoiceStart("en-US");
    if (!result.ok) {
        console.log("❌ Voice Listen Start Failed:", result.reason);
    } else {
        console.log("✅ Voice Listening / Keyword Detection Started");
    }
};

export const stopVoiceListening = async () => {
    await safeVoiceStop();
    console.log("🛑 Voice Listening Stopped");
};

if (isVoiceModuleAvailable()) {
    voiceRuntime.onSpeechResults = (event) => {
        if (!event.value || event.value.length === 0) {
            return;
        }

        const transcriptParts = event.value;
        const spokenText = normalizeSpeechText(transcriptParts.join(" "));

        console.log("🎙️ Heard:", spokenText);

        const highMatch = findMatchedKeyword(transcriptParts, highRiskKeywords);
        if (highMatch) {
            console.log("🚨 EMERGENCY KEYWORD DETECTED:", highMatch);
            DeviceEventEmitter.emit("KEYWORD_DETECTED", { keyword: highMatch, risk: "HIGH" });
            triggerHighRisk();
            return;
        }

        const lowMatch = findMatchedKeyword(transcriptParts, lowRiskKeywords);
        if (lowMatch) {
            console.log("⚠️ CAUTION KEYWORD DETECTED:", lowMatch);
            DeviceEventEmitter.emit("KEYWORD_DETECTED", { keyword: lowMatch, risk: "LOW" });
            triggerLowRisk();
            return;
        }
    };

    voiceRuntime.onSpeechError = (error) => {
        console.log("🎙️ Speech Recognition Error Callback:", error);
    };
}
