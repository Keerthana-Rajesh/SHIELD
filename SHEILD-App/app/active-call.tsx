import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function ActiveCall() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);
  const params = useLocalSearchParams();
  const callerName = (params.name as string) || "Unknown";

  // ⏱ Call Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <View style={styles.container}>

      {/* HEADER INFO */}
      <View style={styles.header}>

        <View style={styles.avatar}>
          <Text style={styles.initialText}>
            {callerName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{callerName}</Text>
        <Text style={styles.label}>Mobile</Text>
        <Text style={styles.timer}>{formatTime()}</Text>

      </View>
      {/* WAVEFORM */}
      <View style={styles.waveContainer}>
        {[...Array(10)].map((_, i) => (
          <WaveBar key={i} delay={i * 100} />
        ))}
      </View>

      {/* CONTROL GRID */}
      <View style={styles.grid}>
        <Control icon="mic-off" label="Mute" />
        <Control icon="dialpad" label="Keypad" />
        <Control icon="volume-up" label="Speaker" />
        <Control icon="add-call" label="Add call" />
        <Control icon="videocam" label="Video call" />
        <Control icon="account-circle" label="Contacts" />
      </View>

      {/* END CALL */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <TouchableOpacity
          style={styles.endButton}
          onPress={() => router.replace("/fake-call")}
        >
          <MaterialIcons
            name="call-end"
            size={36}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const WaveBar = ({ delay }: { delay: number }) => {
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.3,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    const timeout = setTimeout(() => animation.start(), delay);

    return () => {
      clearTimeout(timeout);
      animation.stop();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          transform: [{ scaleY: scale }],
        },
      ]}
    />
  );
};

const Control = ({ icon, label }: any) => (
  <View style={{ alignItems: "center", marginBottom: 30 }}>
    <TouchableOpacity style={styles.controlButton}>
      <MaterialIcons name={icon} size={26} color="#ccc" />
    </TouchableOpacity>
    <Text style={styles.controlLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 70,
    justifyContent: "space-between",
  },

  header: {
    alignItems: "center",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ec1313",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  name: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  label: {
    color: "#888",
    fontSize: 16,
    marginTop: 4,
  },

  timer: {
    marginTop: 10,
    fontSize: 20,
    color: "#ccc",
    fontFamily: "monospace",
    letterSpacing: 3,
  },

  waveContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginVertical: 30,
  },

  bar: {
    width: 4,
    height: 40,
    backgroundColor: "#ec5b13",
    borderRadius: 2,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },

  controlButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },

  controlLabel: {
    color: "#888",
    fontSize: 12,
    marginTop: 6,
  },

  endButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ec1313",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  initialText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
});
