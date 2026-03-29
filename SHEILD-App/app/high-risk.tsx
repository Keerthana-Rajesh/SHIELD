import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import BASE_URL from "../config/api";

export default function HighRiskKeywords() {
    const [input, setInput] = useState("");
    const [keywords, setKeywords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadKeywords = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");

            if (!userId) {
                Alert.alert("Error", "User not logged in");
                return;
            }

            setLoading(true);

            const response = await fetch(
                `${BASE_URL}/get-keywords/${userId}/HIGH`
            );

            const data = await response.json();
            setKeywords(data);
        } catch (error) {
            console.log("Load High Keywords Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Reload when page comes into focus
    useFocusEffect(
        useCallback(() => {
            loadKeywords();
        }, [])
    );

    const addKeyword = async () => {
        if (!input.trim()) return;

        try {
            const userId = await AsyncStorage.getItem("userId");

            if (!userId) {
                Alert.alert("Error", "User not logged in");
                return;
            }

            const response = await fetch(`${BASE_URL}/add-keyword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    keyword_text: input.trim().toLowerCase(),
                    security_level: "HIGH",
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || "Failed to add high risk keyword");
            }

            setInput("");
            loadKeywords();
        } catch (error) {
            console.log("Add High Keyword Error:", error);
            Alert.alert("Error", "Could not save high risk keyword");
        }
    };

    const deleteKeyword = async (id: number) => {
        try {
            const response = await fetch(`${BASE_URL}/delete-keyword/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete high risk keyword");
            }

            loadKeywords();
        } catch (error) {
            console.log("Delete High Keyword Error:", error);
            Alert.alert("Error", "Could not delete high risk keyword");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>High Risk Keywords</Text>

            <TextInput
                placeholder="Enter high risk word"
                placeholderTextColor="#777"
                style={styles.input}
                value={input}
                onChangeText={setInput}
            />

            <TouchableOpacity style={styles.addBtn} onPress={addKeyword}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    ADD KEYWORD
                </Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#EC1313" />
            ) : (
                <FlatList
                    data={keywords}
                    keyExtractor={(item) => item.keyword_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.keywordItem}>
                            <MaterialIcons
                                name="warning"
                                size={18}
                                color="#EC1313"
                            />
                            <Text style={{ color: "#fff", flex: 1 }}>
                                {item.keyword_text}
                            </Text>

                            <TouchableOpacity
                                onPress={() => deleteKeyword(item.keyword_id)}
                            >
                                <MaterialIcons
                                    name="delete"
                                    size={20}
                                    color="#EC1313"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#221610",
        padding: 20,
    },
    title: {
        color: "#EC1313",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#2D1F18",
        padding: 12,
        borderRadius: 10,
        color: "#fff",
    },
    addBtn: {
        backgroundColor: "#EC1313",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    keywordItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#3A2720",
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
    },
});
