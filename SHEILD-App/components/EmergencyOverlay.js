import React, { useEffect, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function EmergencyOverlay({ visible, onCancel }) {
    const pulseAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0.8,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(0.8);
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View style={styles.overlayContainer}>
                <View style={styles.bottomSheet}>
                    <View style={styles.dragHandle} />

                    <Animated.View style={[styles.micGlow, { transform: [{ scale: pulseAnim }] }]}>
                        <View style={styles.micCircle}>
                            <MaterialIcons name="mic" size={40} color="#fff" />
                        </View>
                    </Animated.View>

                    <Text style={styles.title}>SHIELD Activated</Text>
                    <Text style={styles.subtitle}>Listening for emergency keywords...</Text>

                    <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    bottomSheet: {
        backgroundColor: "#181111",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        alignItems: "center",
        shadowColor: "#ec1313",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 20,
    },
    dragHandle: {
        width: 50,
        height: 5,
        backgroundColor: "#333",
        borderRadius: 5,
        marginBottom: 30,
    },
    micGlow: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgba(236,19,19,0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    micCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#ec1313",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#ec1313",
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        color: "#aaa",
        fontSize: 14,
        marginBottom: 30,
    },
    cancelBtn: {
        width: "100%",
        paddingVertical: 15,
        backgroundColor: "#2a1b1b",
        borderRadius: 15,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ec1313",
    },
    cancelBtnText: {
        color: "#ec1313",
        fontSize: 16,
        fontWeight: "bold",
    },
});