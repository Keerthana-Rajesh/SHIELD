import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";

type RecordingMode = "idle" | "recording" | "paused" | "recorded";
type Gender = "male" | "female";

export default function FakeCallSetup() {
  const router = useRouter();

  const [selectedCaller, setSelectedCaller] = useState("Mom");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("30");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calling, setCalling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [selectedGender, setSelectedGender] = useState<Gender>("female");

  const [recordingMode, setRecordingMode] =
    useState<RecordingMode>("idle");
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number | null>(null);

  const [recording, setRecording] =
    useState<Audio.Recording | null>(null);
    const [selectedVoice, setSelectedVoice] = useState(
  "Where are you? I'm outside."
);

  const previewSoundRef = useRef<Audio.Sound | null>(null);
  const durationIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;
  const [savedVoices, setSavedVoices] = useState<SavedVoice[]>([]);

  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [currentlyPlayingId, setCurrentlyPlayingId] = useState<number | null>(null);

const [position, setPosition] = useState(0);
const [duration, setDuration] = useState(1);

  // -----------------------------
  // Callers & Voices
  // -----------------------------
  const callers = [
    { name: "Mom" },
    { name: "Dad" },
    { name: "Boyfriend" },
    { name: "Best Friend" },
  ];
  const directory = FileSystem.documentDirectory;
if (!directory) return;

const newPath: string = directory + `voice-${Date.now()}.m4a`;

  // ===============================
// 🗣 PRESET VOICES
// ===============================

const voices = [
  "Where are you? I'm outside.",
  "Hey, are you almost home?",
  "I'm waiting at the corner.",
];
type SavedVoice = {
  id: number;
  name: string;
  uri: string;
  isSelected: boolean;
};

const newVoice = {
  id: Date.now(),
  name: `Recorded Voice ${savedVoices.length + 1}`,
  uri: newPath as string,
  isSelected: false,
};

  // -----------------------------
  // Permission
  // -----------------------------

 useEffect(() => {
  const loadVoices = async () => {
    const data = await AsyncStorage.getItem("RECORDED_VOICES");
    if (data) {
      setSavedVoices(JSON.parse(data));
    }
  };

  loadVoices();
}, []);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Microphone access is needed to record your voice."
        );
      }
    })();
  }, []);

  // -----------------------------
  // Duration Timer
  // -----------------------------
  useEffect(() => {
    if (recordingMode === "recording") {
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [recordingMode]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };


  const selectVoice = async (id: number) => {
  setSelectedVoiceId(id);

  const updated = savedVoices.map(v => ({
    ...v,
    isSelected: v.id === id,
  }));

  setSavedVoices(updated);

  await AsyncStorage.setItem(
    "RECORDED_VOICES",
    JSON.stringify(updated)
  );
};

  // -----------------------------
  // Recording Functions
  // -----------------------------
  const startRecording = async () => {
    try {
      if (recording) return;

      setRecordingMode("recording");
      setRecordingDuration(0);
      setRecordingUri(null);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();

      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      await newRecording.startAsync();
      setRecording(newRecording);

      console.log("Recording started");
    } catch (error) {
      console.log("Start recording error:", error);
      setRecordingMode("idle");
    }
  };

  const pauseRecording = async () => {
    if (!recording) return;
    await recording.pauseAsync();
    setRecordingMode("paused");
  };

  const resumeRecording = async () => {
    if (!recording) return;
    await recording.startAsync();
    setRecordingMode("recording");
  };

  const stopRecording = async () => {
  try {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const tempUri = recording.getURI();
    if (!tempUri) return;

    const newPath =
      FileSystem.documentDirectory +
      `voice-${Date.now()}.m4a`;

    await FileSystem.copyAsync({
      from: tempUri,
      to: newPath,
    });

    // 🔥 Create Voice Object
    const newVoice: SavedVoice = {
  id: Date.now(),
  name: `Recorded Voice ${savedVoices.length + 1}`,
  uri: newPath,
  isSelected: false,
};

// ✅ CREATE updatedVoices HERE
const updatedVoices = [...savedVoices, newVoice];

// ✅ USE IT AFTER DEFINING
setSavedVoices(updatedVoices);

await AsyncStorage.setItem(
  "RECORDED_VOICES",
  JSON.stringify(updatedVoices)
);

    setRecordingUri(newPath);
    setRecording(null);
    setRecordingMode("recorded");

  } catch (error) {
    console.log("Stop recording error:", error);
  }
};

  const previewRecording = async () => {
  try {
    if (!recordingUri) {
      Alert.alert("No recording found");
      return;
    }

    // 🔥 VERY IMPORTANT FOR ANDROID
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false, // 🔥 THIS FIXES LOW/NO SOUND
      staysActiveInBackground: false,
    });

    // If already playing → stop
    if (previewSoundRef.current) {
      await previewSoundRef.current.stopAsync();
      await previewSoundRef.current.unloadAsync();
      previewSoundRef.current = null;
      setIsPreviewing(false);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: recordingUri },
      {
        shouldPlay: true,
        volume: 1.0, // 🔥 Force full volume
      }
    );

    previewSoundRef.current = sound;
    setIsPreviewing(true);

    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.didJustFinish) {
        setIsPreviewing(false);
      }
    });

  } catch (error) {
    console.log("Preview error:", error);
  }
};

const previewSavedVoice = async (uri: string) => {
  try {
    if (currentSound) {
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );

    setCurrentSound(sound);
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
        setIsPlaying(status.isPlaying);
      }
    });

  } catch (error) {
    console.log("Preview error:", error);
  }
};

const togglePlayPause = async (id: number, uri: string) => {
  try {
    // If tapping same audio
    if (currentlyPlayingId === id && currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
        setIsPlaying(false);
      } else {
        await currentSound.playAsync();
        setIsPlaying(true);
      }
      return;
    }

    // If different audio selected
    if (currentSound) {
      await currentSound.unloadAsync();
      setCurrentSound(null);
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );

    setCurrentSound(sound);
    setCurrentlyPlayingId(id);
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish) {
          setCurrentlyPlayingId(null);
        }
      }
    });

  } catch (error) {
    console.log("Toggle error:", error);
  }
};

const seekAudio = async (value: number) => {
  if (!currentSound) return;
  await currentSound.setPositionAsync(value);
};

  const clearRecording = async () => {
    if (previewSoundRef.current) {
      await previewSoundRef.current.unloadAsync();
      previewSoundRef.current = null;
    }
    setRecordingUri(null);
    setRecordingMode("idle");
    setRecordingDuration(0);
  };

  const deleteVoice = async (id: number, uri: string) => {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });

    const updated = savedVoices.filter(v => v.id !== id);
    setSavedVoices(updated);

    await AsyncStorage.setItem(
      "RECORDED_VOICES",
      JSON.stringify(updated)
    );

  } catch (error) {
    console.log("Delete error:", error);
  }
};

const renameVoice = async (id: number, newName: string) => {
  const updated = savedVoices.map(v =>
    v.id === id ? { ...v, name: newName } : v
  );

  setSavedVoices(updated);

  await AsyncStorage.setItem(
    "RECORDED_VOICES",
    JSON.stringify(updated)
  );
};

  // -----------------------------
  // Call Trigger
  // -----------------------------
  const triggerCall = () => {
  const selectedVoice = savedVoices.find(v => v.isSelected);

  if (!selectedVoice) {
    Alert.alert("Select a recorded voice first");
    return;
  }

  router.push({
    pathname: "/active-call",
    params: {
      name: selectedCaller,
      recordingUri: selectedVoice.uri,
      gender: selectedGender,
    },
  });
};

  // -----------------------------
  // Timer Logic
  // -----------------------------
  const startTimer = () => {
    const totalSeconds =
      (parseInt(minutes) || 0) * 60 +
      (parseInt(seconds) || 0);

    if (totalSeconds <= 0) {
      triggerCall();
      return;
    }

    setCalling(true);
    setCountdown(totalSeconds);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) =>
        prev && prev > 1 ? prev - 1 : 0
      );
    }, 1000);

    timerRef.current = setTimeout(() => {
      setCalling(false);
      setCountdown(null);
      triggerCall();
    }, totalSeconds * 1000);
  };

  const cancelTimer = () => {
    clearTimeout(timerRef.current!);
    clearInterval(intervalRef.current!);
    setCalling(false);
    setCountdown(null);
  };


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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* SELECT CALLER */}
        <Text style={styles.sectionTitle}>SELECT CALLER</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
          {callers.map((caller) => (
            <TouchableOpacity
              key={caller.name}
              style={styles.callerItem}
              onPress={() => setSelectedCaller(caller.name)}
            >
              <View
                style={[
                  styles.avatarBorder,
                  selectedCaller === caller.name && { borderColor: "#ec1313" },
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
          <View style={styles.timeInputBox}>
            <TextInput
              style={styles.timeInput}
              keyboardType="number-pad"
              value={minutes}
              onChangeText={setMinutes}
              maxLength={2}
            />
            <Text style={styles.timeLabel}>min</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeInputBox}>
            <TextInput
              style={styles.timeInput}
              keyboardType="number-pad"
              value={seconds}
              onChangeText={(v) => setSeconds(Math.min(59, parseInt(v) || 0).toString())}
              maxLength={2}
            />
            <Text style={styles.timeLabel}>sec</Text>
          </View>
        </View>

        {calling && countdown !== null && (
          <Text style={styles.countdownText}>
            📞 Call in {countdown}s... tap Cancel to stop
          </Text>
        )}

        {/* VOICE TYPE (shared by voice message + record) */}
        <Text style={styles.sectionTitle}>VOICE TYPE</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={[styles.genderPill, selectedGender === "male" && styles.genderPillActive]}
            onPress={() => setSelectedGender("male")}
          >
            <Text style={styles.genderIcon}>👨</Text>
            <Text style={[styles.genderLabel, selectedGender === "male" && styles.genderLabelActive]}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderPill, selectedGender === "female" && styles.genderPillActive]}
            onPress={() => setSelectedGender("female")}
          >
            <Text style={styles.genderIcon}>👩</Text>
            <Text style={[styles.genderLabel, selectedGender === "female" && styles.genderLabelActive]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hintText}>
          Applies to both voice messages and your recorded voice
        </Text>

        {/* VOICE MESSAGE */}
        <Text style={styles.sectionTitle}>VOICE MESSAGE</Text>
        {voices.map((voice) => (
          <TouchableOpacity
            key={voice}
            style={[styles.voiceCard, selectedVoice === voice && styles.voiceSelected]}
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

        {/* RECORD YOUR VOICE */}
        <Text style={styles.sectionTitle}>RECORD YOUR VOICE</Text>

        {savedVoices.map((voice) => (
  <View
    key={voice.id}
    style={[
      styles.savedVoiceCard,
      voice.isSelected && { borderColor: "#22c55e", borderWidth: 2 }
    ]}
  >
    <Text style={{ color: "#fff", marginBottom: 8 }}>
      {voice.name}
    </Text>

    {/* Controls Row */}
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
      
      {/* Play / Pause */}
      <TouchableOpacity
  onPress={() => togglePlayPause(voice.id, voice.uri)}
>
  <MaterialIcons
    name={
      currentlyPlayingId === voice.id && isPlaying
        ? "pause"
        : "play-arrow"
    }
    size={22}
    color="#22c55e"
  />
</TouchableOpacity>

      {/* Select */}
      <TouchableOpacity
        onPress={() => selectVoice(voice.id)}
      >
        <MaterialIcons name="check-circle" size={22} color="#3b82f6" />
      </TouchableOpacity>

      {/* Delete */}
      <TouchableOpacity
        onPress={() => deleteVoice(voice.id, voice.uri)}
      >
        <MaterialIcons name="delete" size={22} color="#ec1313" />
      </TouchableOpacity>
      {/* Select For Call */}
<TouchableOpacity
  onPress={() => selectVoice(voice.id)}
>
  <MaterialIcons
    name={
      selectedVoiceId === voice.id
        ? "radio-button-checked"
        : "radio-button-unchecked"
    }
    size={22}
    color="#3b82f6"
  />
</TouchableOpacity>

    </View>

    {/* Show Slider ONLY if this voice is currently playing */}
    {currentlyPlayingId === voice.id && (
  <View style={{ marginTop: 10 }}>
    <Slider
      minimumValue={0}
      maximumValue={duration}
      value={position}
      onSlidingComplete={seekAudio}
      minimumTrackTintColor="#ec1313"
      maximumTrackTintColor="#555"
      thumbTintColor="#ec1313"
    />

    <View style={{
      flexDirection: "row",
      justifyContent: "space-between"
    }}>
      <Text style={{ color: "#888", fontSize: 12 }}>
        {Math.floor(position / 1000)}s
      </Text>

      <Text style={{ color: "#888", fontSize: 12 }}>
        {Math.floor(duration / 1000)}s
      </Text>
    </View>
  </View>
)}

  </View>
))}

        <View style={styles.recordSection}>
          {/* == IDLE STATE == */}
          {recordingMode === "idle" && (
            <TouchableOpacity style={styles.recordMicContainer} onPress={startRecording}>
              <View style={styles.micCircle}>
                <MaterialIcons name="mic" size={32} color="#fff" />
              </View>
              <Text style={styles.recordingLabel}>Tap to Record Your Voice</Text>
            </TouchableOpacity>
          )}

          {/* == RECORDING STATE == */}
          {recordingMode === "recording" && (
            <View style={styles.recordMicContainer}>
              {/* Pulse ring */}
              <View style={styles.pulseWrapper}>
                <Animated.View
                  style={[
                    styles.pulseRing,
                    {
                      transform: [{ scale: pulseAnim }],
                      opacity: pulseOpacity,
                    },
                  ]}
                />
                <View style={[styles.micCircle, styles.micCircleRecording]}>
                  <MaterialIcons name="mic" size={32} color="#fff" />
                </View>
              </View>

              <Text style={[styles.recordingLabel, { color: "#ec1313" }]}>
                ● Recording {formatDuration(recordingDuration)}
              </Text>

              {/* Pause + Stop row */}
              <View style={styles.recControlRow}>
                <TouchableOpacity style={styles.recControlBtn} onPress={pauseRecording}>
                  <MaterialIcons name="pause" size={24} color="#fff" />
                  <Text style={styles.recControlText}>Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.recControlBtn, styles.recStopBtn]} onPress={stopRecording}>
                  <MaterialIcons name="stop" size={24} color="#fff" />
                  <Text style={styles.recControlText}>Stop</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* == PAUSED STATE == */}
          {recordingMode === "paused" && (
            <View style={styles.recordMicContainer}>
              <View style={[styles.micCircle, styles.micCirclePaused]}>
                <MaterialIcons name="pause" size={32} color="#fff" />
              </View>
              <Text style={[styles.recordingLabel, { color: "#f59e0b" }]}>
                ⏸ Paused at {formatDuration(recordingDuration)}
              </Text>

              <View style={styles.recControlRow}>
                <TouchableOpacity style={styles.recControlBtn} onPress={resumeRecording}>
                  <MaterialIcons name="fiber-manual-record" size={20} color="#ec1313" />
                  <Text style={styles.recControlText}>Resume</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.recControlBtn, styles.recStopBtn]} onPress={stopRecording}>
                  <MaterialIcons name="stop" size={24} color="#fff" />
                  <Text style={styles.recControlText}>Stop</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* == RECORDED STATE == */}
          {recordingMode === "recorded" && (
            <>
              <TouchableOpacity style={styles.recordMicContainer} onPress={startRecording}>
                <View style={[styles.micCircle, styles.micCircleRecorded]}>
                  <MaterialIcons name="check" size={32} color="#fff" />
                </View>
                <Text style={styles.recordingLabel}>
                  ✔ Saved ({formatDuration(recordingDuration)}) — Tap to Re-record
                </Text>
              </TouchableOpacity>

              <View style={styles.recordActions}>
                <TouchableOpacity style={styles.previewButton} onPress={previewRecording}>
                  <MaterialIcons
                    name={isPreviewing ? "stop" : "play-arrow"}
                    size={22}
                    color="#ec1313"
                  />
                  <Text style={styles.previewText}>
                    {isPreviewing ? "Stop" : `Preview (${selectedGender === "male" ? "♂ Male" : "♀ Female"})`}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.clearButton} onPress={clearRecording}>
                  <MaterialIcons name="delete-outline" size={20} color="#888" />
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomContainer}>
        {calling ? (
          <TouchableOpacity style={styles.cancelButton} onPress={cancelTimer}>
            <MaterialIcons name="cancel" size={22} color="#fff" />
            <Text style={styles.startText}>CANCEL TIMER</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.callNowButton} onPress={triggerCall}>
              <MaterialIcons name="call" size={20} color="#fff" />
              <Text style={styles.startText}>NOW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={startTimer}>
              <MaterialIcons name="timer" size={22} color="#fff" />
              <Text style={styles.startText}>START FAKE CALL</Text>
            </TouchableOpacity>
          </View>
        )}
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
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 4,
  },
  timeInputBox: {
    backgroundColor: "#2d1f18",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    width: 80,
  },
  timeInput: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  timeLabel: {
    color: "#777",
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 1,
  },
  timeSeparator: {
    color: "#ec1313",
    fontSize: 32,
    fontWeight: "bold",
  },
  countdownText: {
    color: "#ec1313",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
    letterSpacing: 1,
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

  // Gender pills – shared
  genderRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 12,
  },
  genderPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2d1f18",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  genderPillActive: {
    borderColor: "#ec1313",
    backgroundColor: "#3a1c14",
  },
  genderIcon: {
    fontSize: 22,
  },
  genderLabel: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 15,
  },
  genderLabelActive: {
    color: "#fff",
  },
  hintText: {
    color: "#555",
    fontSize: 11,
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 8,
  },

  // Recording section
  recordSection: {
    marginHorizontal: 20,
    backgroundColor: "#2d1f18",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3d2820",
    overflow: "hidden",
  },
  recordMicContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },

  // Pulse animation
  pulseWrapper: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(236, 19, 19, 0.25)",
  },

  micCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ec1313",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  micCircleRecording: {
    backgroundColor: "#c00",
  },
  micCirclePaused: {
    backgroundColor: "#f59e0b",
  },
  micCircleRecorded: {
    backgroundColor: "#22c55e",
  },
  recordingLabel: {
    color: "#ccc",
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  // Recording control buttons (pause/stop/resume)
  recControlRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  recControlBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  recStopBtn: {
    backgroundColor: "rgba(236,19,19,0.2)",
  },
  recControlText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Preview/Clear buttons
  recordActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#3d2820",
  },
  previewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: "#3d2820",
  },
  previewText: {
    color: "#ec1313",
    fontWeight: "bold",
    fontSize: 13,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  clearText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 13,
  },

  // Bottom
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  callNowButton: {
    backgroundColor: "#333",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    width: 90,
  },
  cancelButton: {
    backgroundColor: "#555",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  startButton: {
    flex: 1,
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
  savedVoiceCard: {
  backgroundColor: "#2d1f18",
  padding: 14,
  marginHorizontal: 20,
  marginTop: 10,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
});
