import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
const [loading, setLoading] = useState(false);
import { Alert } from "react-native";
import { ActivityIndicator } from "react-native";


export default function OtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
    const { phone } = useLocalSearchParams();
    console.log(phone);
    const [loading, setLoading] = useState(false);

const handleVerify = async () => {
  console.log("Verify clicked");
  console.log("OTP:", otp);

  if (!otp || otp.trim().length !== 6) {
    Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://10.0.2.2:5000/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      }
    );

    console.log("Response status:", response.status);

    // Always parse safely
    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid JSON response from server");
    }

    console.log("Server data:", data);

    if (response.ok && data?.success === true) {
  console.log("OTP verified successfully");

  // STOP LOADING FIRST
  setLoading(false);

  // Small delay ensures render cycle completes
  setTimeout(() => {
    Alert.alert("Success ✅", "OTP verified successfully!");

    setTimeout(() => {
      router.replace("/dashboard");
    }, 800);

  }, 100);

} else {
  setLoading(false);
  Alert.alert("Error ❌", "Invalid OTP. Please try again.");
}


  } catch (error) {
    console.log("Fetch error:", error);
    setLoading(false);
    Alert.alert("Server Error", "Unable to connect to server.");
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your phone
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



      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>Back</Text>
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
  back: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
