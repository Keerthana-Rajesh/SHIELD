import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function IconTestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Icon Test</Text>
      <Text style={styles.subtitle}>APK and dev builds should render all glyphs below.</Text>

      <View style={styles.row}>
        <MaterialIcons name="home" size={40} color="red" />
        <MaterialCommunityIcons name="shield-home" size={40} color="#ec1313" />
        <FontAwesome name="phone" size={40} color="#ffffff" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    padding: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#bbbbbb",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
