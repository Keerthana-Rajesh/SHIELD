import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [notes, setNotes] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [editing, setEditing] = useState(false);

  // 🔹 Fetch user details
  useEffect(() => {
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
      } catch (err) {
        Alert.alert("Error", "Unable to fetch user data");
      }
    };

    fetchUser();
  }, []);

  // 🔹 Update Profile
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://10.200.110.103:5000/update-user/${phone}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age,
            bloodGroup,
            notes,
            aiEnabled,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully!");
        setEditing(false);
      } else {
        Alert.alert("Error", "Update failed");
      }
    } catch (err) {
      Alert.alert("Server Error");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <TextInput
        style={styles.input}
        value={name}
        editable={false}
        placeholder="Name"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Age"
        editable={editing}
        placeholderTextColor="#888"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={bloodGroup}
        onChangeText={setBloodGroup}
        placeholder="Blood Group"
        editable={editing}
        placeholderTextColor="#888"
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Medical Notes"
        editable={editing}
        placeholderTextColor="#888"
        multiline
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>AI Enabled</Text>
        <Switch
          value={aiEnabled}
          onValueChange={setAiEnabled}
          disabled={!editing}
        />
      </View>

      {!editing ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setEditing(true)}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181111",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2a1b1b",
    color: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  switchText: {
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ec1313",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
