import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, DeviceEventEmitter } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityService, Activity } from "../services/ActivityService";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function PreviousActivityScreen() {
    const router = useRouter();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadActivities = async () => {
        const data = await ActivityService.getActivities();
        setActivities(data);
    };

    useEffect(() => {
        loadActivities();
        const sub = DeviceEventEmitter.addListener("ACTIVITY_UPDATED", loadActivities);
        return () => sub.remove();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadActivities();
        setRefreshing(false);
    };

    const formatTime = (ts: number) => {
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (ts: number) => {
        const date = new Date(ts);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getActivityIcon = (type: string, level: string) => {
        if (type === 'AI_RISK') return "smart-toy";
        if (type === 'KEYWORD') return "mic";
        return "warning";
    };

    const getLevelColor = (level: string) => {
        if (level === 'HIGH') return "#ec1313";
        if (level === 'LOW') return "#f1c40f";
        return "#13ec5b";
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={["#1c1313", "#120c0c"]} style={StyleSheet.absoluteFill} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Security Activity</Text>
                    <Text style={styles.headerSub}>Past detections & alerts</Text>
                </View>
                <TouchableOpacity onPress={() => { ActivityService.clearActivities(); setActivities([]); }} style={styles.clearBtn}>
                    <MaterialIcons name="delete-sweep" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ec1313" />
                }
            >
                {activities.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="history" size={60} color="#333" />
                        <Text style={styles.emptyText}>No recent security activities detected</Text>
                        <Text style={styles.emptySub}>All systems are monitoring normally</Text>
                    </View>
                ) : (
                    activities.map((item, index) => (
                        <View key={item.id} style={styles.timelineItem}>
                            {/* Left Line */}
                            <View style={styles.timelineLineWrap}>
                                <View style={[styles.timelineDot, { backgroundColor: getLevelColor(item.level) }]} />
                                {index !== activities.length - 1 && <View style={styles.timelineLine} />}
                            </View>

                            {/* Content */}
                            <View style={styles.activityCard}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.iconBox, { backgroundColor: `${getLevelColor(item.level)}20` }]}>
                                        <MaterialIcons name={getActivityIcon(item.type, item.level) as any} size={20} color={getLevelColor(item.level)} />
                                    </View>
                                    <View style={styles.titleWrap}>
                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                        <Text style={styles.itemTime}>{formatDate(item.timestamp)} • {formatTime(item.timestamp)}</Text>
                                    </View>
                                    <View style={[styles.levelBadge, { backgroundColor: `${getLevelColor(item.level)}30` }]}>
                                        <Text style={[styles.levelText, { color: getLevelColor(item.level) }]}>{item.level}</Text>
                                    </View>
                                </View>
                                <Text style={styles.itemDetails}>{item.details}</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* AI Summary Banner */}
            <View style={styles.summaryBar}>
                <MaterialIcons name="verified-user" size={18} color="#13ec5b" />
                <Text style={styles.summaryText}>End-to-end encrypted activity logs</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#120c0c",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#2a1b1b",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center"
    },
    headerSub: {
        color: "#888",
        fontSize: 12,
        textAlign: "center"
    },
    clearBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
    },
    emptyText: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
    },
    emptySub: {
        color: "#666",
        fontSize: 13,
        marginTop: 5,
    },
    timelineItem: {
        flexDirection: "row",
        minHeight: 100,
    },
    timelineLineWrap: {
        width: 30,
        alignItems: "center",
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 2,
        marginTop: 25,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: "#222",
        marginVertical: 5,
    },
    activityCard: {
        flex: 1,
        backgroundColor: "#1c1313",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#2a1b1b",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    titleWrap: {
        flex: 1,
        marginLeft: 12,
    },
    itemTitle: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },
    itemTime: {
        color: "#666",
        fontSize: 11,
        marginTop: 2,
    },
    levelBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    levelText: {
        fontSize: 10,
        fontWeight: "bold",
    },
    itemDetails: {
        color: "#aaa",
        fontSize: 13,
        marginTop: 10,
        lineHeight: 18,
    },
    summaryBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 15,
        backgroundColor: "#1c1313",
        borderTopWidth: 1,
        borderTopColor: "#222",
    },
    summaryText: {
        color: "#666",
        fontSize: 11,
    }
});