import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, []);

  const handleOTP = async () => {
  const response = await fetch("http://10.200.110.103:5000/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json();

  if (response.ok) {
    router.navigate({
        pathname: "/otp",
        params: { phone },
});

  } else {
    alert("Failed to send OTP");
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="shield" size={36} color="#ec1313" />
        <TouchableOpacity>
          <MaterialIcons name="help-outline" size={26} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Branding */}
      <View style={styles.branding}>
        <Text style={styles.title}>SHIELD</Text>
        <Text style={styles.subtitle}>
          Silent Protection. Smart Response.
        </Text>
      </View>

      {/* Fingerprint */}
      <View style={styles.fingerprintWrapper}>
        <Animated.View
          style={[
            styles.fingerprintCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <MaterialIcons name="fingerprint" size={48} color="#ec1313" />
        </Animated.View>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        <Text style={styles.loginHeading}>Login</Text>
        <Text style={styles.loginSub}>
          Enter your phone number to receive a secure code.
        </Text>

        <Text style={styles.label}>Phone Number</Text>

        <View style={styles.inputContainer}>
          <View style={styles.countryContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <MaterialIcons name="expand-more" size={18} color="#aaa" />
          </View>

          <TextInput
            style={styles.input}
            placeholder="(555) 000-0000"
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity style={styles.otpButton} onPress={handleOTP}>
          <Text style={styles.otpText}>Get OTP</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>SECURE ACCESS</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Alternate Buttons */}
        <View style={styles.altRow}>
          <TouchableOpacity style={styles.altButton}>
            <MaterialIcons name="face" size={22} color="#ccc" />
            <Text style={styles.altText}>FaceID</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.altButton}>
            <MaterialIcons name="g-translate" size={22} color="#ccc" />
            <Text style={styles.altText}>Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Text>

        <View style={styles.lockRow}>
          <MaterialIcons name="lock" size={14} color="#666" />
          <Text style={styles.lockText}>
            End-to-end encrypted connection
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  branding: {
    alignItems: "center",
    marginTop: 30,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 8,
    color: "#aaa",
    fontSize: 15,
  },

  fingerprintWrapper: {
    alignItems: "center",
    marginVertical: 35,
  },

  fingerprintCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(236,19,19,0.1)",
    borderWidth: 2,
    borderColor: "rgba(236,19,19,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  formSection: {
    marginTop: 10,
  },

  loginHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  loginSub: {
    color: "#aaa",
    marginBottom: 20,
  },

  label: {
    color: "#ccc",
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  countryCode: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 4,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },

  otpButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ec1313",
    paddingVertical: 16,
    borderRadius: 16,
  },

  otpText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 6,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 11,
    color: "#666",
    letterSpacing: 1,
  },

  altRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  altButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333",
  },

  altText: {
    marginLeft: 6,
    color: "#ccc",
  },

  footer: {
    marginTop: 40,
    alignItems: "center",
  },

  footerText: {
    color: "#777",
    fontSize: 12,
    textAlign: "center",
  },

  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  lockText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 5,
  },
});
