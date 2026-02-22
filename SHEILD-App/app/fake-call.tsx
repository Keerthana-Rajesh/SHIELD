import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function FakeCallSetup() {
  const router = useRouter();

  const [selectedCaller, setSelectedCaller] = useState("Mom");
  const [selectedTimer, setSelectedTimer] = useState("10s");
  const [selectedVoice, setSelectedVoice] = useState(
    "Where are you? I’m outside."
  );

  const callers = [
    { name: "Mom" },
    { name: "Dad" },
    { name: "Boyfriend" },
    { name: "Best Friend" },
  ];

  const timers = ["Call Now", "5s", "10s", "30s", "1m"];

  const voices = [
    "Where are you? I’m outside.",
    "Hey, are you almost home?",
    "I'm waiting at the corner.",
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Fake Call Setup</Text>

        <MaterialIcons name="info-outline" size={24} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* SELECT CALLER */}
        <Text style={styles.sectionTitle}>SELECT CALLER</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {callers.map((caller) => (
            <TouchableOpacity
              key={caller.name}
              style={styles.callerItem}
              onPress={() => setSelectedCaller(caller.name)}
            >
              <View
                style={[
                  styles.avatarBorder,
                  selectedCaller === caller.name && {
                    borderColor: "#ec1313",
                  },
                ]}
              >
                <View style={styles.initialAvatar}>
                  <Text style={styles.initialText}>
                    {caller.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.callerName}>{caller.name}</Text>
              <Text style={styles.callerSub}>Mobile</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TIMER */}
        <Text style={styles.sectionTitle}>SET TIMER</Text>

        <View style={styles.timerRow}>
          {timers.map((timer) => (
            <TouchableOpacity
              key={timer}
              style={[
                styles.timerButton,
                selectedTimer === timer && styles.timerSelected,
              ]}
              onPress={() => setSelectedTimer(timer)}
            >
              <Text
                style={[
                  styles.timerText,
                  selectedTimer === timer && { color: "#fff" },
                ]}
              >
                {timer}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* VOICE MESSAGE */}
        <Text style={styles.sectionTitle}>VOICE MESSAGE</Text>

        {voices.map((voice) => (
          <TouchableOpacity
            key={voice}
            style={[
              styles.voiceCard,
              selectedVoice === voice && styles.voiceSelected,
            ]}
            onPress={() => setSelectedVoice(voice)}
          >
            <Text style={styles.voiceText}>{voice}</Text>
          </TouchableOpacity>
        ))}

        {/* CUSTOM TTS */}
        <TextInput
          placeholder="Custom Text-to-Speech"
          placeholderTextColor="#777"
          style={styles.input}
        />

        {/* RECORD BUTTON */}
        <TouchableOpacity style={styles.recordButton}>
          <MaterialIcons name="mic" size={20} color="#ec1313" />
          <Text style={styles.recordText}>Record Your Own</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* START BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() =>
            router.push({
              pathname: "/incoming",
              params: {
                name: selectedCaller,
              },
            })
          }
        >
          <MaterialIcons name="call" size={22} color="#fff" />
          <Text style={styles.startText}>START FAKE CALL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#221610",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionTitle: {
    color: "#ec1313",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  callerItem: {
    alignItems: "center",
    marginHorizontal: 12,
  },

  avatarBorder: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 40,
    padding: 2,
  },

  initialAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ec1313",
    justifyContent: "center",
    alignItems: "center",
  },

  initialText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  callerName: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 6,
  },

  callerSub: {
    color: "#777",
    fontSize: 10,
  },

  timerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },

  timerButton: {
    backgroundColor: "#2d1f18",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 5,
  },

  timerSelected: {
    backgroundColor: "#ec1313",
  },

  timerText: {
    color: "#ccc",
    fontWeight: "600",
  },

  voiceCard: {
    backgroundColor: "#2d1f18",
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  voiceSelected: {
    borderColor: "#ec1313",
    borderWidth: 1,
  },

  voiceText: {
    color: "#fff",
    fontSize: 13,
  },

  input: {
    backgroundColor: "#2d1f18",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginTop: 10,
  },

  recordButton: {
    borderWidth: 1,
    borderColor: "#ec1313",
    borderStyle: "dashed",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  recordText: {
    color: "#ec1313",
    fontWeight: "bold",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  startButton: {
    backgroundColor: "#ec1313",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  startText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});