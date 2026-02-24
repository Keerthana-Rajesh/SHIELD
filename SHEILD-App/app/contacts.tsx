import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "react-native";

export default function Contacts() {
  const router = useRouter();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadContacts = async () => {
        try {
          setLoading(true);

          const email = await AsyncStorage.getItem("userEmail");

          if (!email) {
            if (isActive) setContacts([]);
            return;
          }

          const response = await fetch(
            `http://10.200.110.103:5000/contacts/${email}`
          );

          if (!response.ok) {
            console.log("Server error:", response.status);
            if (isActive) setContacts([]);
            return;
          }

          const data = await response.json();
          console.log("Contacts API response:", data);
          console.log("Loaded contacts:", data);

          if (!isActive) return;

          // 🔥 SAFELY HANDLE ANY RESPONSE FORMAT
          if (Array.isArray(data)) {
            setContacts(data);
          } else if (Array.isArray(data.contacts)) {
            setContacts(data.contacts);
          } else {
            setContacts([]);
          }

        } catch (error) {
          console.log("Error loading contacts:", error);
          if (isActive) setContacts([]);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      loadContacts();

      return () => {
        isActive = false;
      };
    }, [])
  );


  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://10.200.110.103:5000/delete-contact/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        alert("Contact deleted");
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
          <Text style={styles.headerTitle}>Trusted Contacts</Text>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </View>

        {/* DESCRIPTION */}
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

        {/* EMPTY STATE */}
        {contacts.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <MaterialIcons name="group" size={70} color="#444" />
            <Text style={{ color: "#777", marginTop: 15 }}>
              No Trusted Contacts Added Yet
            </Text>
            <Text style={{ color: "#555", fontSize: 12, marginTop: 5 }}>
              Tap + button to add someone
            </Text>
          </View>
        ) : (
          contacts.map((item) => (
            <ContactCard
              key={item.id}
              contact={item}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/addcontact")}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* NAVIGATION */}
      <View style={styles.navBar}>
        <NavItem icon="home" label="Home" onPress={() => router.push("/dashboard")} />
        <NavItem icon="group" label="Contacts" active />
        <NavItem icon="explore" label="Safe Map" onPress={() => router.push("/safemap")} />
        <NavItem icon="settings" label="Settings" onPress={() => router.push("/settings")} />
      </View>
    </View>
  );
}

/* ---------- CONTACT CARD COMPONENT ---------- */

const ContactCard = ({ contact, onDelete }: any) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <MaterialIcons
          name={
            contact.gender === "male"
              ? "man"
              : contact.gender === "female"
                ? "woman"
                : "person"
          }
          size={30}
          color="#ec1313"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.cardName}>{contact.name}</Text>
        <Text style={styles.cardSub}>
          {contact.relation} • {contact.phone}
        </Text>
        <Text style={{ color: "#888", fontSize: 11 }}>
          {contact.contact_email}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="call" size={18} color="#ec1313" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="chat-bubble" size={18} color="#ec1313" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Delete Contact",
              "Are you sure you want to delete this contact?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => onDelete(contact.id) }
              ]
            )
          }
        >
          <MaterialIcons name="delete" size={20} color="#ff4444" />
        </TouchableOpacity>

        {/* THREE DOT EDIT */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/addcontact",
              params: { contact: JSON.stringify(contact) },
            })
          }
        >
          <MaterialIcons name="edit" size={20} color="#ec1313" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ---------- NAV ITEM ---------- */

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
    backgroundColor: "#2A1B1B",
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
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
