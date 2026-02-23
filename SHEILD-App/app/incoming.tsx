import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function IncomingCall() {
  const router = useRouter();
  const { name, recordingUri, gender } = useLocalSearchParams();

  // Optional: Auto vibrate / ringtone logic can go here

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Fake Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.time}>10:00</Text>

        <View style={{ flexDirection: "row", gap: 6 }}>
          <MaterialIcons name="signal-cellular-4-bar" size={18} color="#fff" />
          <MaterialIcons name="wifi" size={18} color="#fff" />
          <MaterialIcons name="battery-full" size={18} color="#fff" />
        </View>
      </View>

      {/* Caller Info */}
      <View style={styles.callerContainer}>
        <View style={styles.avatarWrapper}>
          <Text style={styles.initialText}>
            {name ? (name as string).charAt(0).toUpperCase() : "?"}
          </Text>
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.number}>Mobile +1 (555) 012-3456</Text>

        <Text style={styles.incomingText}>Incoming Call...</Text>
      </View>

      {/* Utility Options */}
      <View style={styles.utilityRow}>
        <View style={styles.utilityItem}>
          <MaterialIcons name="alarm" size={28} color="#aaa" />
          <Text style={styles.utilityText}>Remind Me</Text>
        </View>

        <View style={styles.utilityItem}>
          <MaterialIcons name="chat" size={28} color="#aaa" />
          <Text style={styles.utilityText}>Message</Text>
        </View>
      </View>
      {/* Accept / Decline Buttons */}
      <View style={styles.actionRow}>

        {/* Decline */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => router.replace("/fake-call")}
          >
            <MaterialIcons
              name="call"
              size={36}
              color="#fff"
              style={{ transform: [{ rotate: "135deg" }] }}
            />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>DECLINE</Text>
        </View>

        {/* Accept */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => router.replace({ pathname: "/active-call", params: { name, recordingUri, gender } })}
          >
            <MaterialIcons name="call" size={36} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>ACCEPT</Text>
        </View>

      </View>

      {/* Android Bottom Line */}
      <View style={styles.bottomBar} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 50,
    justifyContent: "space-between",
  },

  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },

  time: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  callerContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  avatarWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#ec1313",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  initialText: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },

  number: {
    color: "#888",
    fontSize: 16,
    marginTop: 5,
  },

  incomingText: {
    color: "#ec5b13",
    marginTop: 40,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 3,
  },

  utilityRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },

  utilityItem: {
    alignItems: "center",
    gap: 5,
  },

  utilityText: {
    color: "#aaa",
    fontSize: 10,
    letterSpacing: 1,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 60,
  },

  declineButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  acceptButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  actionLabel: {
    color: "#aaa",
    fontSize: 10,
    marginTop: 10,
    letterSpacing: 2,
    fontWeight: "bold",
  },

  bottomBar: {
    alignSelf: "center",
    width: 120,
    height: 5,
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 10,
  },
});
