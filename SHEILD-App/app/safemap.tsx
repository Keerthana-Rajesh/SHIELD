import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SafeMap() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        
        {/* Top App Bar */}
        <View style={styles.header}>
          <MaterialIcons name="explore" size={26} color="#ec1313" />
          <Text style={styles.headerTitle}>Safe Map</Text>
          <TouchableOpacity>
            <MaterialIcons name="my-location" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <MaterialIcons name="map" size={60} color="#555" />
          <Text style={styles.mapText}>Live Location Map</Text>
          <Text style={styles.mapSub}>
            Real-time tracking & emergency zones
          </Text>
        </View>

        {/* Live Status Card */}
        <View style={styles.statusCard}>
          <MaterialIcons name="location-on" size={22} color="#ec1313" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.statusTitle}>Location Sharing Active</Text>
            <Text style={styles.statusSub}>
              Your trusted contacts can view your live location
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickButton icon="share-location" label="Share Now" />
          <QuickButton icon="warning" label="Danger Zones" />
          <QuickButton icon="history" label="Route History" />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
          icon="explore"
          label="SafeMap"
          active
        />
        <NavItem
          icon="person"
          label="Profile"
          onPress={() => router.push("/profile")}
        />
      </View>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

const QuickButton = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.quickButton}>
    <MaterialIcons name={icon} size={24} color="#ec1313" />
    <Text style={styles.quickLabel}>{label}</Text>
  </TouchableOpacity>
);

const NavItem = ({ icon, label, active, onPress }: any) => (
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

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#221010",
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

  mapContainer: {
    height: 280,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  mapText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  mapSub: {
    color: "#777",
    fontSize: 12,
    marginTop: 5,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(236,19,19,0.1)",
    borderWidth: 1,
    borderColor: "rgba(236,19,19,0.3)",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 16,
    marginBottom: 25,
  },

  statusTitle: {
    color: "#fff",
    fontWeight: "bold",
  },

  statusSub: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },

  quickButton: {
    backgroundColor: "#2a1b1b",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    width: 100,
  },

  quickLabel: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },

  navBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
    backgroundColor: "#221010",
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
    marginTop: 4,
  },
});
