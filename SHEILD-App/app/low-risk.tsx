import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../config/api";

export default function LowRiskKeywords() {
    const [input, setInput] = useState("");
    const [keywords, setKeywords] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    // 🔹 Load userId once
    useEffect(() => {
        const getUser = async () => {
            const id = await AsyncStorage.getItem("userId");
            console.log("Stored User ID:", id);
            setUserId(id);
        };

        getUser();
    }, []);

    // 🔹 Load keywords when userId is ready
    useEffect(() => {
        if (userId) {
            loadKeywords();
        }
    }, [userId]);

    const loadKeywords = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/get-keywords/${userId}/LOW`
            );

            const data = await response.json();
            console.log("Fetched LOW keywords:", data);

            setKeywords(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Load Keywords Error:", error);
        }
    };

    const addKeyword = async () => {
        if (!input.trim()) return;

        if (!userId) {
            Alert.alert("Error", "User not logged in");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/add-keyword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    keyword_text: input.trim().toLowerCase(),
                    security_level: "LOW",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add keyword");
            }

            setInput("");
            loadKeywords();
        } catch (error) {
            console.error("Add Keyword Error:", error);
            Alert.alert("Error", "Could not save keyword");
        }
    };

    const deleteKeyword = async (id: number) => {
        try {
            await fetch(`${BASE_URL}/delete-keyword/${id}`, {
                method: "DELETE",
            });

            loadKeywords();
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Low Risk Keywords</Text>

            <TextInput
                placeholder="Enter low risk word"
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

            <FlatList
                data={keywords}
                keyExtractor={(item) =>
                    item.keyword_id?.toString() || Math.random().toString()
                }
                renderItem={({ item }) => (
                    <View style={styles.keywordItem}>
                        <MaterialIcons name="info" size={18} color="#FFA500" />
                        <Text style={{ color: "#fff", flex: 1 }}>
                            {item.keyword_text}
                        </Text>

                        <TouchableOpacity
                            onPress={() => deleteKeyword(item.keyword_id)}
                        >
                            <MaterialIcons name="delete" size={20} color="#EC1313" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ color: "#777", marginTop: 20 }}>
                        No low risk keywords added yet.
                    </Text>
                }
            />
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
        color: "#FFA500",
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