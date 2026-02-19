import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
  if (!phone) {
    Alert.alert("Error", "Phone number missing.");
    return;
  }

  if (!otp || otp.length !== 6) {
    Alert.alert("Invalid OTP", "Enter a valid 6-digit OTP");
    return;
  }

  try {
    setLoading(true);

    // 🔹 Ensure phone is always string
    const phoneString =
      Array.isArray(phone) ? phone[0] : phone;

    const response = await fetch(
      "http://10.200.110.103:5000/verify-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneString,
          otp,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {

      // ✅ Mark user logged in
      await AsyncStorage.setItem("isLoggedIn", "true");

      // ✅ Save phone locally
      await AsyncStorage.setItem("userPhone", phoneString);

      // 🔥 Route based on user type
      if (data.existingUser) {
        router.replace("/dashboard");
      } else {
        router.replace("/profile-setup");
      }

    } else {
      Alert.alert("Error ❌", data.message || "Invalid OTP");
    }

  } catch (error) {
    console.log("OTP Verify Error:", error);
    Alert.alert("Server Error", "Unable to connect to server");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {phone}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#888"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#1c1c1c",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: "#ec1313",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
