import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Helpline() {
    const router = useRouter();
    const makeCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const helplines: {
        title: string;
        number: string;
        icon: keyof typeof MaterialIcons.glyphMap;
    }[] = [
            { title: "Police", number: "100", icon: "local-police" },
            { title: "Ambulance", number: "102", icon: "medical-services" },
            { title: "Fire Force", number: "101", icon: "local-fire-department" },
            { title: "Women Helpline", number: "1091", icon: "person" },
            { title: "Child Helpline", number: "1098", icon: "child-care" },
            { title: "Disaster Mgmt", number: "108", icon: "warning" },
            { title: "Cyber Crime", number: "1930", icon: "security" },
            { title: "Test Call", number: "8075584570", icon: "call" },
        ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Emergency Helplines</Text>

                    <View style={styles.shieldIcon}>
                        <MaterialIcons name="shield" size={20} color="#EC1313" />
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.heroCircle}>
                        <MaterialIcons name="emergency" size={50} color="#EC1313" />
                    </View>

                    <Text style={styles.heroTitle}>Emergency Assistance</Text>
                    <Text style={styles.heroSubtitle}>
                        Tap any helpline below to initiate an instant emergency call.
                    </Text>
                </View>

                {/* Helpline Cards */}
                {helplines.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardLeft}>
                            <View style={styles.iconBox}>
                                <MaterialIcons name={item.icon} size={24} color="#EC1313" />
                            </View>

                            <View>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardNumber}>{item.number}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.callButton}
                            onPress={() => makeCall(item.number)}
                        >
                            <Text style={styles.callText}>CALL</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Emergency 112 Button */}
                <TouchableOpacity
                    style={styles.emergencyButton}
                    onPress={() => makeCall("112")}
                >
                    <MaterialIcons name="call" size={28} color="#fff" />
                    <Text style={styles.emergencyText}>CALL EMERGENCY 112</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#181111",
        paddingHorizontal: 16,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 50,
        marginBottom: 10,
    },

    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    shieldIcon: {
        backgroundColor: "rgba(236,19,19,0.1)",
        padding: 8,
        borderRadius: 20,
    },

    hero: {
        alignItems: "center",
        marginVertical: 30,
    },

    heroCircle: {
        width: 110,
        height: 110,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: "#EC1313",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },

    heroTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },

    heroSubtitle: {
        color: "#aaa",
        textAlign: "center",
        marginTop: 5,
        fontSize: 12,
    },

    card: {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderColor: "rgba(236,19,19,0.2)",
        borderWidth: 1,
        borderRadius: 14,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    cardLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: "rgba(236,19,19,0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    cardTitle: {
        color: "#fff",
        fontWeight: "600",
    },

    cardNumber: {
        color: "#EC1313",
        fontWeight: "bold",
        marginTop: 3,
    },

    callButton: {
        backgroundColor: "#EC1313",
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 8,
    },

    callText: {
        color: "#fff",
        fontWeight: "bold",
    },

    emergencyButton: {
        backgroundColor: "#EC1313",
        padding: 18,
        borderRadius: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 120,
    },

    emergencyText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 10,
    },
});