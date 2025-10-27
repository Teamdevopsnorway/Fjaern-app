import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export function TestScreen(props: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Screen</Text>
      <Text style={styles.subtitle}>If you see this, navigation works!</Text>
      <Pressable
        style={styles.button}
        onPress={() => props.navigation.navigate("Swipe")}
      >
        <Text style={styles.buttonText}>Go to Swipe Screen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
