import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Switch,
} from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Settings() {
    const [keywordEnabled, setKeywordEnabled] = useState(true);
    const [volumeTrigger, setVolumeTrigger] = useState(false);
    const [powerTrigger, setPowerTrigger] = useState(true);
    const [shakeEnabled, setShakeEnabled] = useState(true);
    const [shakeLevel, setShakeLevel] = useState(0.5);
    const [autoSiren, setAutoSiren] = useState(true);
    const [loopAudio, setLoopAudio] = useState(false);
    const [pinEnabled, setPinEnabled] = useState(true);
    const [stealthMode, setStealthMode] = useState(false);
    const router = useRouter();


    return (
        <View style={{ flex: 1 }}>

            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialIcons name="security" size={28} color="#EC1313" />
                        <Text style={styles.headerTitle}>SHIELD</Text>
                    </View>
                    <MaterialIcons name="help-outline" size={22} color="#AAA" />
                </View>

                {/* PROFILE SETUP */}
                <Section title="PROFILE SETUP">
                    <View style={styles.card}>
                        <View style={styles.avatar}>
                            <Text style={{ color: "#EC1313", fontWeight: "bold" }}>JD</Text>
                        </View>

                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor="#777"
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="Emergency Contact"
                            placeholderTextColor="#777"
                            style={styles.input}
                        />

                        <TouchableOpacity style={styles.primaryBtn}>
                            <Text style={styles.primaryText}>SAVE CHANGES</Text>
                        </TouchableOpacity>
                    </View>
                </Section>

                {/* KEYWORD SETUP */}
                <Section title="KEYWORD SETUP">
                    <Row
                        icon="keyboard-voice"
                        label="Keyword Detection"
                        value={keywordEnabled}
                        onValueChange={setKeywordEnabled}
                    />
                </Section>

                {/* HARDWARE SETUP */}
                <Section title="HARDWARE SETUP">
                    <Row
                        icon="volume-up"
                        label="Volume Button Trigger"
                        value={volumeTrigger}
                        onValueChange={setVolumeTrigger}
                    />
                    <Row
                        icon="power-settings-new"
                        label="Triple Power Press"
                        value={powerTrigger}
                        onValueChange={setPowerTrigger}
                    />
                    <Row
                        icon="vibration"
                        label="Shake Detection"
                        value={shakeEnabled}
                        onValueChange={setShakeEnabled}
                    />

                    <View style={{ paddingHorizontal: 15 }}>
                        <Text style={styles.sliderLabel}>Shake Sensitivity</Text>
                        <Slider
                            minimumValue={0}
                            maximumValue={1}
                            value={shakeLevel}
                            onValueChange={setShakeLevel}
                            minimumTrackTintColor="#EC1313"
                            maximumTrackTintColor="#444"
                        />
                    </View>
                </Section>

                {/* AUDIO SETTINGS */}
                <Section title="AUDIO SETTINGS">
                    <Row
                        icon="campaign"
                        label="Auto-play Siren"
                        value={autoSiren}
                        onValueChange={setAutoSiren}
                    />
                    <Row
                        icon="loop"
                        label="Loop Alert Audio"
                        value={loopAudio}
                        onValueChange={setLoopAudio}
                    />
                </Section>

                {/* SECURITY SETTINGS */}
                <Section title="SECURITY SETTINGS">
                    <Row
                        icon="lock"
                        label="PIN Protection"
                        value={pinEnabled}
                        onValueChange={setPinEnabled}
                    />
                    <Row
                        icon="visibility-off"
                        label="Stealth Mode"
                        value={stealthMode}
                        onValueChange={setStealthMode}
                    />
                </Section>

                {/* RESET */}
                <TouchableOpacity style={styles.resetBtn}>
                    <MaterialIcons name="delete-forever" size={20} color="#EC1313" />
                    <Text style={styles.resetText}>RESET ALL DATA</Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                    Stay Protected • SHIELD Safety App
                </Text>

            </ScrollView>

            {/* BOTTOM NAVIGATION */}
            <View style={styles.navBar}>
                <NavItem
                    icon="home"
                    label="Home"
                    onPress={() => router.replace("/dashboard")}
                />
                <NavItem
                    icon="group"
                    label="Contacts"
                    onPress={() => router.push("/contacts")}
                />
                <NavItem
                    icon="map"
                    label="SafeMap"
                    onPress={() => router.push("/safemap")}
                />
                <NavItem
                    icon="settings"
                    label="Settings"
                    active
                />
            </View>

        </View>
    );
}

/* ---------- COMPONENTS ---------- */

const Section = ({ title, children }: any) => (
    <View style={{ marginBottom: 30 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>{children}</View>
    </View>
);

const Row = ({ icon, label, value, onValueChange }: any) => (
    <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialIcons name={icon} size={20} color="#AAA" />
            <Text style={{ color: "#fff" }}>{label}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ true: "#EC1313" }}
            thumbColor="#fff"
        />
    </View>
);

const NavItem = ({ icon, label, active, onPress }: any) => (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
        <MaterialIcons
            name={icon}
            size={24}
            color={active ? "#EC1313" : "#777"}
        />
        <Text
            style={[
                styles.navLabel,
                { color: active ? "#EC1313" : "#777" },
            ]}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#221610",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    sectionTitle: {
        color: "#EC1313",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#2D1F18",
        borderRadius: 16,
        padding: 15,
        gap: 15,
    },
    avatar: {
        alignSelf: "center",
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(236,19,19,0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    input: {
        backgroundColor: "#221610",
        padding: 12,
        borderRadius: 10,
        color: "#fff",
    },
    primaryBtn: {
        backgroundColor: "#EC1313",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    primaryText: {
        color: "#fff",
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
    },
    sliderLabel: {
        color: "#AAA",
        fontSize: 12,
        marginBottom: 5,
    },
    resetBtn: {
        marginTop: 10,
        borderColor: "#EC1313",
        borderWidth: 1,
        padding: 15,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
    },
    resetText: {
        color: "#EC1313",
        fontWeight: "bold",
    },
    footer: {
        textAlign: "center",
        marginTop: 30,
        color: "#555",
        fontSize: 10,
    },
    navBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 80,
        backgroundColor: "#221610",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    navItem: {
        alignItems: "center",
    },

    navLabel: {
        fontSize: 10,
        marginTop: 2,
    },
});