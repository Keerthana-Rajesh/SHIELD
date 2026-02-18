import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Switch,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ProfileSetup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [notes, setNotes] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);

  const handleSave = async () => {
  if (!name) {
    Alert.alert("Error", "Please enter your name");
    return;
  }

  if (!password || password.length < 4) {
    Alert.alert("Error", "Password must be at least 4 characters");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }

  try {
    const phone = await AsyncStorage.getItem("userPhone");

    if (!phone) {
      Alert.alert("Error", "Phone number missing");
      return;
    }

    const response = await fetch(
      "http://172.16.67.194:5000/register-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age,
          bloodGroup,
          notes,
          password,
          aiEnabled,
          phone,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Save minimal local session data
      await AsyncStorage.setItem("isLoggedIn", "true");

      Alert.alert("Success", "Account created successfully!");

      router.replace("/dashboard");
    } else {
      Alert.alert("Error", data.message || "Registration failed");
    }

  } catch (error) {
    Alert.alert("Server Error", "Unable to connect to server");
  }
};



  return (
  <View style={{ flex: 1, backgroundColor: "#181111" }}>
    
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 140, // extra space for fixed button
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

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
      <InputField
        label="Full Name"
        icon="person"
        value={name}
        onChangeText={setName}
        placeholder="Jane Doe"
      />

      {/* Age + Blood Group */}
      <View style={styles.row}>
        <InputField
          label="Age"
          icon="calendar-today"
          value={age}
          onChangeText={setAge}
          placeholder="24"
          keyboardType="number-pad"
          style={{ flex: 1 }}
        />

        <InputField
          label="Blood Group"
          icon="bloodtype"
          value={bloodGroup}
          onChangeText={setBloodGroup}
          placeholder="A+"
          style={{ flex: 1 }}
        />
      </View>

      {/* Password */}
      <InputField
        label="Create Password"
        icon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secure
      />

      {/* Confirm Password */}
      <InputField
        label="Confirm Password"
        icon="lock"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        secure
      />

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

    </ScrollView>

    {/* 🔥 FIXED SAVE BUTTON AT BOTTOM */}
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: "#181111",
      }}
    >
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Profile</Text>
        <MaterialIcons name="verified-user" size={20} color="#fff" />
      </TouchableOpacity>
    </View>

  </View>
);
}

/* ---------- Reusable Input ---------- */

const InputField = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secure,
  style,
}: any) => (
  <View style={[styles.inputBlock, style]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secure}
      />
      <MaterialIcons name={icon} size={20} color="#777" />
    </View>
  </View>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
  backgroundColor: "#181111",
},
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginTop: 20,
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
  },
});
