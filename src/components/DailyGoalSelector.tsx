import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGamificationStore } from "../state/gamificationStore";

interface DailyGoalSelectorProps {
  onClose?: () => void;
}

const GOAL_OPTIONS = [0, 10, 20, 30, 50, 100];

export const DailyGoalSelector: React.FC<DailyGoalSelectorProps> = ({ onClose }) => {
  const { dailyGoal, setDailyGoal } = useGamificationStore();

  const handleSelectGoal = (goal: number) => {
    setDailyGoal(goal);
    if (onClose) {
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flag" size={28} color="#2C5F7C" />
        <Text style={styles.title}>Velg dagsmål</Text>
      </View>

      <Text style={styles.description}>
        Sett et daglig mål for hvor mange bilder du vil rydde. Få ekstra confetti når du når målet! 🎉
      </Text>

      <View style={styles.optionsContainer}>
        {GOAL_OPTIONS.map((goal) => (
          <Pressable
            key={goal}
            style={[
              styles.option,
              dailyGoal === goal && styles.optionSelected,
            ]}
            onPress={() => handleSelectGoal(goal)}
          >
            <View style={styles.optionContent}>
              {goal === 0 ? (
                <>
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={dailyGoal === 0 ? "#fff" : "#B8D4E0"}
                  />
                  <Text style={[
                    styles.optionText,
                    dailyGoal === 0 && styles.optionTextSelected,
                  ]}>
                    Ingen mål
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="star"
                    size={24}
                    color={dailyGoal === goal ? "#FFD700" : "#B8D4E0"}
                  />
                  <Text style={[
                    styles.optionText,
                    dailyGoal === goal && styles.optionTextSelected,
                  ]}>
                    {goal} bilder
                  </Text>
                </>
              )}
            </View>

            {dailyGoal === goal && (
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            )}
          </Pressable>
        ))}
      </View>

      <Text style={styles.tip}>
        💡 Tip: Start med et lavt mål og øk det over tid!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#E8F4F8",
    borderRadius: 24,
    margin: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C5F7C",
  },
  description: {
    fontSize: 14,
    color: "#2C5F7C",
    marginBottom: 24,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#B8D4E0",
  },
  optionSelected: {
    backgroundColor: "#2C5F7C",
    borderColor: "#2C5F7C",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C5F7C",
  },
  optionTextSelected: {
    color: "#fff",
  },
  tip: {
    fontSize: 13,
    color: "#5A8FA8",
    marginTop: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
});
