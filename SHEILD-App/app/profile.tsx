import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


export default function Profile() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [notes, setNotes] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);

  useFocusEffect(
  useCallback(() => {
    const fetchUser = async () => {
      const storedPhone = await AsyncStorage.getItem("userPhone");
      if (!storedPhone) return;

      setPhone(storedPhone);

      try {
        const response = await fetch(
          `http://10.200.110.103:5000/user/${storedPhone}`
        );

        const data = await response.json();

        setName(data.name || "");
        setAge(data.age ? String(data.age) : "");
        setBloodGroup(data.blood_group || "");
        setNotes(data.notes || "");
        setAiEnabled(data.ai_enabled === 1);
      } catch {
        Alert.alert("Error", "Unable to fetch profile");
      }
    };

    fetchUser();
  }, [])
);


  const handleUpdate = async () => {
  try {
    const response = await fetch(
      `http://10.200.110.103:5000/update-user/${phone}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age,
          bloodGroup,
          notes,
          aiEnabled,
        }),
      }
    );

    if (response.ok) {
      Alert.alert("Success", "Profile updated successfully!");
    } else {
      Alert.alert("Error", "Update failed");
    }
  } catch {
    Alert.alert("Server Error");
  }
};


  return (
  <View style={styles.container}>
    {/* 🔹 Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Edit Profile</Text>
      <View style={{ width: 22 }} />
    </View>

    {/* 🔹 Scroll Content */}
    <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
      {/* 🔹 Profile Image */}
      <View style={styles.profileSection}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.profileImage}
          />
          <View style={styles.overlay}>
            <MaterialIcons name="photo-camera" size={28} color="#fff" />
          </View>
        </View>
      </View>

      {/* 🔹 Inputs */}
      <View style={styles.form}>
        <InputField
          icon="person"
          label="Full Name"
          value={name}
          onChangeText={setName}
        />

        <InputField
          icon="call"
          label="Phone Number"
          value={phone}
          editable={false}
        />

        <View style={styles.row}>
          <InputField
            icon="calendar-today"
            label="Age"
            value={age}
            onChangeText={setAge}
            style={{ flex: 1 }}
          />

          <InputField
            icon="bloodtype"
            label="Blood Group"
            value={bloodGroup}
            onChangeText={setBloodGroup}
            style={{ flex: 1 }}
          />
        </View>

        {/* Emergency Info */}
        <View style={styles.emergencyBox}>
          <View style={styles.emergencyHeader}>
            <MaterialIcons
              name="medical-information"
              size={20}
              color="#ec1313"
            />
            <Text style={styles.emergencyTitle}>
              Emergency Medical Info
            </Text>
          </View>

          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Medical conditions, allergies..."
            placeholderTextColor="#888"
            multiline
          />
        </View>

        {/* AI Switch */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>AI Detection Enabled</Text>
          <Switch
            value={aiEnabled}
            onValueChange={setAiEnabled}
            trackColor={{ true: "#ec1313" }}
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          This information is encrypted and shared only during emergency.
        </Text>
      </View>
    </ScrollView>

    {/* 🔥 Bottom Navigation */}
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
        onPress={() => router.push("/safemap")}
      />
      <NavItem
        icon="person"
        label="Profile"
        active
      />
    </View>
  </View>
);


}

/* 🔥 Reusable Input Component */

const InputField = ({
  icon,
  label,
  value,
  onChangeText,
  editable = true,
  style,
}: any) => (
  <View style={[styles.inputBlock, style]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <MaterialIcons name={icon} size={20} color="#aaa" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholderTextColor="#888"
      />
    </View>
  </View>
);
const NavItem = ({ icon, label, active, onPress }: any) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <MaterialIcons
      name={icon}
      size={24}
      color={active ? "#ec1313" : "#888"}
    />
    <Text
      style={[
        styles.navLabel,
        { color: active ? "#ec1313" : "#888" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* 🔥 Styles */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#221010",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ec1313",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    paddingHorizontal: 20,
  },
  inputBlock: {
    marginBottom: 18,
  },
  label: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#392828",
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    height: 50,
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  emergencyBox: {
    backgroundColor: "rgba(236,19,19,0.1)",
    borderRadius: 16,
    padding: 15,
    marginVertical: 15,
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  emergencyTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  textArea: {
    backgroundColor: "#221010",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    minHeight: 80,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  switchText: {
    color: "#fff",
    fontSize: 14,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ec1313",
    padding: 16,
    borderRadius: 18,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerNote: {
    textAlign: "center",
    color: "#777",
    fontSize: 11,
    marginTop: 15,
  },
  navBar: {
  position: "absolute",
  bottom: 0,
  width: "100%",
  height: 80,
  backgroundColor: "#221010",
  borderTopWidth: 1,
  borderTopColor: "rgba(255,255,255,0.1)",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  paddingBottom: 10,
},

navItem: {
  alignItems: "center",
},

navLabel: {
  fontSize: 11,
  marginTop: 2,
},

});
