import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Top App Bar */}
        <View style={styles.header}>
          <MaterialIcons name="favorite" size={28} color="#ec1313" />
          <Text style={styles.headerTitle}>SHIELD</Text>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="account-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Status Header */}
        <View style={styles.statusSection}>
          <Text style={styles.statusTitle}>Safety Service Active</Text>
          <View style={styles.statusRow}>
            <View style={styles.greenDot} />
            <Text style={styles.statusSub}>
              System monitoring for your safety
            </Text>
          </View>
        </View>

        {/* SOS Button Section */}
        <View style={styles.sosContainer}>
          <View style={styles.sosOuter} />
          <View style={styles.sosMiddle} />

          <TouchableOpacity style={styles.sosButton}>
            <MaterialIcons name="back-hand" size={40} color="#fff" />
            <Text style={styles.sosText}>HOLD TO TRIGGER</Text>
            <Text style={styles.sosSub}>EMERGENCY SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Status Cards */}
        <View style={styles.cardRow}>
          <StatusCard icon="mic" label="Mic" value="Active" />
          <StatusCard icon="location-on" label="Location" value="Shared" />
          <StatusCard icon="sensors" label="Sensors" value="Locked" />
        </View>

        {/* AI Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiIcon}>
            <MaterialIcons name="smart-toy" size={22} color="#ec1313" />
          </View>
          <View>
            <Text style={styles.aiTitle}>AI Guardian is analyzing</Text>
            <Text style={styles.aiSub}>
              Silent mode enabled. No threats detected.
            </Text>
          </View>
        </View>

        {/* Activity Log */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>RECENT ACTIVITY</Text>

          <ActivityItem
            icon="history"
            text="Home arrival recorded"
            time="2h ago"
          />
          <ActivityItem
            icon="route"
            text={`Trusted contact alerted: "I'm heading home"`}
            time="3h ago"
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <NavItem icon="home" label="Home" active />
        <NavItem icon="map" label="SafeMap" />
        <NavItem icon="group" label="Circles" />
        <NavItem icon="settings" label="Settings" />
      </View>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */

const StatusCard = ({ icon, label, value }: any) => (
  <View style={styles.card}>
    <MaterialIcons name={icon} size={22} color="#ec1313" />
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const ActivityItem = ({ icon, text, time }: any) => (
  <View style={styles.activityItem}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <MaterialIcons name={icon} size={16} color="#aaa" />
      <Text style={styles.activityText}>{text}</Text>
    </View>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
);

const NavItem = ({ icon, label, active }: any) => (
  <TouchableOpacity style={styles.navItem}>
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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181111",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  profileButton: {
    backgroundColor: "#2a1b1b",
    padding: 8,
    borderRadius: 20,
  },

  statusSection: {
    alignItems: "center",
    marginTop: 10,
  },

  statusTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 6,
  },

  greenDot: {
    width: 8,
    height: 8,
    backgroundColor: "green",
    borderRadius: 4,
  },

  statusSub: {
    color: "#aaa",
    fontSize: 12,
  },

  sosContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },

  sosOuter: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(236,19,19,0.1)",
  },

  sosMiddle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(236,19,19,0.2)",
  },

  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#ec1313",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ec1313",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },

  sosText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 6,
  },

  sosSub: {
    color: "#fff",
    fontSize: 9,
    marginTop: 2,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
  },

  card: {
    backgroundColor: "#2a1b1b",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    width: 100,
  },

  cardLabel: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 5,
  },

  cardValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(236,19,19,0.1)",
    borderColor: "rgba(236,19,19,0.2)",
    borderWidth: 1,
    margin: 20,
    padding: 15,
    borderRadius: 15,
    gap: 12,
  },

  aiIcon: {
    backgroundColor: "rgba(236,19,19,0.2)",
    padding: 8,
    borderRadius: 10,
  },

  aiTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },

  aiSub: {
    color: "#aaa",
    fontSize: 11,
  },

  activitySection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  activityTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },

  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a1b1b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  activityText: {
    color: "#ccc",
    fontSize: 12,
  },

  activityTime: {
    color: "#777",
    fontSize: 10,
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
});
