import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../config/api";

export default function CloudStorage() {
    const [recordings, setRecordings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'video' | 'audio'>('audio');
    const router = useRouter();

    const fetchRecordings = async () => {
        try {
            const email = await AsyncStorage.getItem("userEmail");
            if (!email) return;

            const res = await fetch(`${BASE_URL}/recordings/${email}`);
            const data = await res.json();
            if (res.ok) {
                setRecordings(data);
            }
        } catch (err) {
            console.error("Fetch recordings error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRecordings();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchRecordings();
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            "Delete Recording",
            "Are you sure you want to delete this evidence?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await fetch(`${BASE_URL}/emergency-recording/${id}`, {
                                method: 'DELETE'
                            });
                            if (res.ok) {
                                setRecordings(prev => prev.filter(r => r.id !== id));
                            }
                        } catch (err) {
                            console.error("Delete error:", err);
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const filteredRecordings = recordings.filter(r => 
        filter === 'video' ? r.type === 'video' || r.type === 'video_clip' : r.type === 'audio' || r.type === 'audio_call'
    );

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>

                <View style={styles.headerLeft}>
                    <View style={styles.headerIcon}>
                        <MaterialIcons name="cloud" size={28} color="#ec1313" />
                    </View>

                    <View>
                        <Text style={styles.headerTitle}>Cloud Storage</Text>
                        <Text style={styles.headerSub}>
                            Emergency recordings saved securely
                        </Text>
                    </View>
                </View>

                <MaterialIcons name="more-vert" size={24} color="#aaa" />

            </View>


            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                {/* STORAGE STATUS */}
                <View style={styles.statusCard}>

                    <View style={styles.statusIcon}>
                        <MaterialIcons name="cloud-done" size={24} color="#ec1313" />
                    </View>

                    <View>
                        <Text style={styles.statusTitle}>
                            Secure Cloud Backup Active
                        </Text>

                        <Text style={styles.statusSub}>
                            Audio and video evidence stored safely
                        </Text>
                    </View>

                </View>


                {/* FILTER BUTTONS */}
                <View style={styles.filterRow}>

                    <TouchableOpacity 
                        style={filter === 'audio' ? styles.activeFilter : styles.filter}
                        onPress={() => setFilter('audio')}
                    >
                        <Text style={filter === 'audio' ? styles.activeFilterText : styles.filterText}>
                            Audio Recordings
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={filter === 'video' ? styles.activeFilter : styles.filter}
                        onPress={() => setFilter('video')}
                    >
                        <Text style={filter === 'video' ? styles.activeFilterText : styles.filterText}>
                            Video Recordings
                        </Text>
                    </TouchableOpacity>

                </View>


                {/* RECORDINGS */}
                {loading ? (
                    <ActivityIndicator size="large" color="#ec1313" style={{ marginTop: 50 }} />
                ) : filteredRecordings.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="folder-open" size={64} color="#333" />
                        <Text style={styles.emptyText}>No recordings found</Text>
                    </View>
                ) : (
                    filteredRecordings.map((rec) => (
                        <RecordingCard
                            key={rec.id}
                            icon={rec.type.includes('video') ? "videocam" : "mic"}
                            title={rec.type.includes('video') ? "Video Evidence" : "Audio Evidence"}
                            date={formatDate(rec.recorded_at || rec.created_at)}
                            duration="00:30 sec" // Mock duration
                            onDelete={() => handleDelete(rec.id)}
                            onPlay={() => Alert.alert("Play", "Opening: " + rec.url)}
                        />
                    ))
                )}

            </ScrollView>


            {/* BOTTOM NAVBAR */}

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

                <NavItem icon="cloud" label="Storage" active />

                <NavItem
                    icon="map"
                    label="SafeMap"
                    onPress={() => router.push("/safemap")}
                />

                <NavItem
                    icon="settings"
                    label="Settings"
                    onPress={() => router.push("/settings")}
                />

            </View>

        </View>
    );
}


/* RECORDING CARD */

interface RecordingCardProps {
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
    title: string;
    date: string;
    duration: string;
    active?: boolean;
    onDelete?: () => void;
    onPlay?: () => void;
}

function RecordingCard({ 
    icon, title, date, duration, active = false, onDelete, onPlay 
}: RecordingCardProps) {


    return (
        <View style={styles.recordingCard}>

            <View style={styles.recordingLeft}>

                <View style={styles.recordIcon}>
                    <MaterialIcons name={icon} size={22} color="#ec1313" />
                </View>

                <View>
                    <Text style={styles.recordTitle}>{title}</Text>

                    <Text style={styles.recordMeta}>
                        {date} • {duration}
                    </Text>
                </View>

            </View>


            <View style={styles.actionRow}>

                <TouchableOpacity style={styles.actionBtn} onPress={onPlay}>
                    <MaterialIcons name="play-arrow" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="download" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
                    <MaterialIcons name="delete" size={20} color="#ec1313" />
                </TouchableOpacity>

            </View>

        </View>
    );
}


/* NAV ITEM */

interface NavItemProps {
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
    label: string;
    active?: boolean;
    onPress?: () => void;
}

function NavItem({ icon, label, active, onPress }: NavItemProps) {

    return (
        <TouchableOpacity style={styles.navItem} onPress={onPress}>

            <MaterialIcons
                name={icon}
                size={24}
                color={active ? "#ec1313" : "#777"}
            />

            <Text
                style={[
                    styles.navLabel,
                    { color: active ? "#ec1313" : "#777" },
                ]}
            >
                {label}
            </Text>

        </TouchableOpacity>
    );
}


/* STYLES */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#181111",
        paddingTop: 40,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    headerIcon: {
        backgroundColor: "rgba(236,19,19,0.1)",
        padding: 10,
        borderRadius: 15,
        marginRight: 12,
    },

    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },

    headerSub: {
        color: "#aaa",
        fontSize: 12,
    },

    statusCard: {
        backgroundColor: "#2a1b1b",
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 15,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    statusIcon: {
        backgroundColor: "rgba(236,19,19,0.2)",
        padding: 8,
        borderRadius: 10,
        marginRight: 10,
    },

    statusTitle: {
        color: "#fff",
        fontWeight: "bold",
    },

    statusSub: {
        color: "#aaa",
        fontSize: 12,
    },

    filterRow: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 15,
    },

    activeFilter: {
        flex: 1,
        backgroundColor: "#ec1313",
        padding: 12,
        borderRadius: 15,
        alignItems: "center",
        marginRight: 10,
    },

    filter: {
        flex: 1,
        backgroundColor: "#2a1b1b",
        padding: 12,
        borderRadius: 15,
        alignItems: "center",
    },

    activeFilterText: {
        color: "#fff",
        fontWeight: "bold",
    },

    filterText: {
        color: "#aaa",
        fontWeight: "bold",
    },

    recordingCard: {
        backgroundColor: "#2a1b1b",
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 15,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    recordingLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    recordIcon: {
        backgroundColor: "#1f1f1f",
        padding: 8,
        borderRadius: 10,
        marginRight: 10,
    },

    recordTitle: {
        color: "#fff",
        fontWeight: "bold",
    },

    recordMeta: {
        color: "#888",
        fontSize: 11,
    },

    actionRow: {
        flexDirection: "row",
    },

    actionBtn: {
        backgroundColor: "#1f1f1f",
        padding: 8,
        borderRadius: 20,
        marginLeft: 6,
    },

    navBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 80,
        backgroundColor: "#181111",
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

    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
    },
    emptyText: {
        color: "#555",
        marginTop: 10,
        fontSize: 16,
    },
});