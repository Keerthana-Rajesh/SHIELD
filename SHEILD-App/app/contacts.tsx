import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Contacts() {
    const router = useRouter();
    
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>

        {/* Top App Bar */}
        <View style={styles.header}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          <Text style={styles.headerTitle}>Trusted Contacts</Text>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </View>

        {/* Header Description */}
        <View style={styles.section}>
          <View style={styles.circleHeader}>
            <MaterialIcons name="shield" size={22} color="#ec1313" />
            <Text style={styles.sectionTitle}>Emergency Circle</Text>
          </View>

          <Text style={styles.sectionSub}>
            The people below will be instantly notified with your live location
            if SHIELD AI detects an emergency.
          </Text>
        </View>

        {/* Contacts */}
        <ContactCard
          name="Sarah Johnson"
          relation="Sister"
          phone="+1 (555) 012-3456"
        />

        <ContactCard
          name="Michael Chen"
          relation="Partner"
          phone="+1 (555) 987-6543"
        />

        {/* Emergency Services */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyIcon}>
            <MaterialIcons name="local-police" size={26} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>Emergency Services</Text>
            <Text style={styles.emergencySub}>
              PRIORITY CONTACT • 911
            </Text>
          </View>

          <TouchableOpacity style={styles.callButton}>
            <MaterialIcons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Add Contact */}
        <TouchableOpacity style={styles.addContact}>
          <MaterialIcons name="person-add" size={22} color="#aaa" />
          <Text style={styles.addText}>
            Add New Trusted Contact
          </Text>
        </TouchableOpacity>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SHIELD AI monitors environment sounds and movement patterns.
            {"\n"}
            You can manage notification triggers in Settings.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <NavItem icon="home" label="Home" onPress={() => router.push("/dashboard")}/>
        <NavItem icon="group" label="Contacts" active />
        <NavItem icon="explore" label="Safe Map" onPress={() => router.push("/safemap")}/>
        <NavItem icon="person" label="Profile" onPress={() => router.push("/profile")}/>
      </View>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

const ContactCard = ({ name, relation, phone }: any) => (
  <View style={styles.card}>
    <View style={styles.avatar} />

    <View style={{ flex: 1 }}>
      <Text style={styles.cardName}>{name}</Text>
      <Text style={styles.cardSub}>
        {relation} • {phone}
      </Text>
    </View>

    <View style={styles.cardActions}>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="call" size={18} color="#ec1313" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="chat-bubble" size={18} color="#ec1313" />
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialIcons name="more-vert" size={18} color="#777" />
      </TouchableOpacity>
    </View>
  </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  circleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  sectionSub: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 8,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(57,40,40,0.4)",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#333",
    marginRight: 15,
  },

  cardName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  cardSub: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconButton: {
    backgroundColor: "rgba(236,19,19,0.1)",
    padding: 8,
    borderRadius: 20,
  },

  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(236,19,19,0.1)",
    borderWidth: 1,
    borderColor: "rgba(236,19,19,0.3)",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },

  emergencyIcon: {
    backgroundColor: "#ec1313",
    padding: 12,
    borderRadius: 30,
    marginRight: 15,
  },

  emergencyTitle: {
    color: "#fff",
    fontWeight: "bold",
  },

  emergencySub: {
    color: "#ec1313",
    fontSize: 11,
    marginTop: 4,
  },

  callButton: {
    backgroundColor: "#ec1313",
    padding: 10,
    borderRadius: 25,
  },

  addContact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#444",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    gap: 8,
  },

  addText: {
    color: "#aaa",
    fontWeight: "500",
  },

  footer: {
    paddingHorizontal: 30,
    marginTop: 30,
    alignItems: "center",
  },

  footerText: {
    color: "#666",
    fontSize: 11,
    textAlign: "center",
  },

  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#ec1313",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
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
