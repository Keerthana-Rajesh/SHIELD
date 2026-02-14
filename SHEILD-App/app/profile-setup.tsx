import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Switch,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileSetup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [notes, setNotes] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);

  const handleSave = () => {
    if (!name) {
      alert("Please enter your name");
      return;
    }

    alert("Profile Saved!");
    router.replace("/dashboard");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Profile Setup</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* Hero Section */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200",
        }}
        style={styles.hero}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.heroOverlay} />

        <View style={styles.profileCircle}>
          <MaterialIcons name="add-a-photo" size={30} color="#777" />
        </View>
      </ImageBackground>

      {/* Header Text */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>Your Profile</Text>
        <Text style={styles.sectionSub}>
          Information helps SHIELD AI responders during emergencies.
        </Text>
      </View>

      {/* Full Name */}
      <View style={styles.inputBlock}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Jane Doe"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
          <MaterialIcons name="person" size={20} color="#777" />
        </View>
      </View>

      {/* Age + Blood Group */}
      <View style={styles.row}>
        <View style={[styles.inputBlock, { flex: 1 }]}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="24"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
            />
            <MaterialIcons name="calendar-today" size={18} color="#777" />
          </View>
        </View>

        <View style={[styles.inputBlock, { flex: 1 }]}>
          <Text style={styles.label}>Blood Group</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="A+"
              placeholderTextColor="#666"
              value={bloodGroup}
              onChangeText={setBloodGroup}
            />
            <MaterialIcons name="bloodtype" size={20} color="#777" />
          </View>
        </View>
      </View>

      {/* Medical Notes */}
      <View style={styles.inputBlock}>
        <Text style={styles.label}>Emergency Medical Notes</Text>
        <View style={[styles.inputRow, { alignItems: "flex-start" }]}>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Allergies, chronic conditions..."
            placeholderTextColor="#666"
            multiline
            value={notes}
            onChangeText={setNotes}
          />
          <MaterialIcons name="description" size={20} color="#777" />
        </View>
      </View>

      {/* AI Toggle */}
      <View style={styles.aiBox}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <MaterialIcons name="psychology" size={22} color="#ec1313" />
          <View>
            <Text style={styles.aiTitle}>Enhanced AI Detection</Text>
            <Text style={styles.aiSub}>
              Share profile with responders automatically
            </Text>
          </View>
        </View>

        <Switch
          value={aiEnabled}
          onValueChange={setAiEnabled}
          trackColor={{ false: "#444", true: "#ec1313" }}
          thumbColor="#fff"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Profile</Text>
        <MaterialIcons name="verified-user" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        Your data is encrypted and only shared with emergency services during
        an active incident.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#181111",
    padding: 20,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  topTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  hero: {
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#ec1313",
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  sectionSub: {
    color: "#aaa",
    marginTop: 5,
    marginBottom: 20,
  },

  inputBlock: {
    marginBottom: 18,
  },

  label: {
    color: "#fff",
    marginBottom: 6,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    color: "#fff",
    height: 50,
  },

  row: {
    flexDirection: "row",
    gap: 15,
  },

  aiBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(236,19,19,0.1)",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(236,19,19,0.3)",
    marginVertical: 20,
  },

  aiTitle: {
    color: "#fff",
    fontWeight: "600",
  },

  aiSub: {
    color: "#aaa",
    fontSize: 12,
  },

  saveButton: {
    flexDirection: "row",
    backgroundColor: "#ec1313",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  footerNote: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
