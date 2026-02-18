import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================================
     ✅ Auto redirect if logged in
  ================================= */
  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

      if (isLoggedIn === "true") {
        router.replace("/dashboard");
      }
    };

    checkLogin();
  }, []);

  /* ================================
     ✅ Send OTP
  ================================= */
  const handleGetOtp = async () => {
  if (!phone || phone.length !== 10) {
    Alert.alert("Invalid Number", "Enter a valid 10-digit phone number");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://172.16.67.194:5000/send-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      router.push(`/otp?phone=${phone}`);
    } else {
      Alert.alert("Error", data.message || "Failed to send OTP");
    }

  } catch (error) {
    Alert.alert("Server Error", "Unable to connect to server");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="shield" size={32} color="#ec1313" />
        <MaterialIcons name="help-outline" size={24} color="#777" />
      </View>

      {/* Branding */}
      <Text style={styles.logo}>SHIELD</Text>
      <Text style={styles.tagline}>
        Silent Protection. Smart Response.
      </Text>

      {/* Fingerprint Circle */}
      <View style={styles.circle}>
        <MaterialIcons name="fingerprint" size={50} color="#ec1313" />
      </View>

      {/* Login Section */}
      <Text style={styles.loginTitle}>Login</Text>
      <Text style={styles.loginSub}>
        Enter your phone number to receive a secure code.
      </Text>

      {/* Phone Input */}
      <View style={styles.inputWrapper}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Get OTP Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleGetOtp}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Get OTP</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>SECURE ACCESS</Text>
        <View style={styles.line} />
      </View>

      {/* Alternate Login */}
      <View style={styles.altRow}>
        <TouchableOpacity style={styles.altButton}>
          <MaterialIcons name="face" size={22} color="#aaa" />
          <Text style={styles.altText}>FaceID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.altButton}>
          <MaterialIcons name="g-translate" size={22} color="#aaa" />
          <Text style={styles.altText}>Google</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        By signing in, you agree to our{" "}
        <Text style={styles.link}>Terms</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>

      <View style={styles.secureRow}>
        <MaterialIcons name="lock" size={14} color="#666" />
        <Text style={styles.secureText}>
          End-to-end encrypted connection
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ================================
   🎨 STYLES
================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },

  tagline: {
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },

  circle: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(236,19,19,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  loginTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },

  loginSub: {
    color: "#888",
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
  },

  prefix: {
    color: "#aaa",
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: "#fff",
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ec1313",
    padding: 15,
    borderRadius: 12,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },

  dividerText: {
    color: "#666",
    marginHorizontal: 10,
    fontSize: 10,
    letterSpacing: 2,
  },

  altRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  altButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1c1c1c",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    justifyContent: "center",
  },

  altText: {
    color: "#aaa",
  },

  footerText: {
    color: "#666",
    textAlign: "center",
    fontSize: 12,
    marginTop: 30,
  },

  link: {
    color: "#ec1313",
  },

  secureRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },

  secureText: {
    color: "#666",
    fontSize: 11,
  },
});
