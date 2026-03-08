import Voice from "@react-native-voice/voice";
import { triggerLowRisk, triggerHighRisk } from "./emergencyActions";

const lowRiskKeywords = ["call me", "come later"];
const highRiskKeywords = ["help", "danger", "save me"];

export const startVoiceListening = async () => {

    try {
        await Voice.start("en-US");
    } catch (e) {
        console.log(e);
    }

};

export const stopVoiceListening = async () => {
    try {
        await Voice.stop();
    } catch (e) {
        console.log("Error stopping voice:", e);
    }
};

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