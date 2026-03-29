import Voice from "@react-native-voice/voice";
import { triggerLowRisk, triggerHighRisk } from "./emergencyActions";
import {
    isVoiceModuleAvailable,
    safeVoiceStart,
    safeVoiceStop,
} from "./voiceModule";

const lowRiskKeywords = ["call me", "come later"];
const highRiskKeywords = ["help", "danger", "save me"];

export const startVoiceListening = async () => {
    const result = await safeVoiceStart("en-US");
    if (!result.ok) {
        console.log(result.reason);
    }
};

export const stopVoiceListening = async () => {
    await safeVoiceStop();
};

if (isVoiceModuleAvailable()) {
    Voice.onSpeechResults = (event) => {
        if (!event.value || event.value.length === 0) {
            return;
        }

        const spokenText = event.value[0].toLowerCase();

        console.log("Heard:", spokenText);

        if (lowRiskKeywords.some(word => spokenText.includes(word))) {
            triggerLowRisk();
        }

        if (highRiskKeywords.some(word => spokenText.includes(word))) {
            triggerHighRisk();
        }
    };
}
