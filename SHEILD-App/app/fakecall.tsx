import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function FakeCall() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fake Call</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/incoming")}
      >
        <Text style={styles.buttonText}>Start Fake Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181111",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#ec1313",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});