import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ProgressBar as ProgressBarPaper } from "react-native-paper";
import DatabaseContext from "@/providers/DatabaseContext";

export const ProgressBar: React.FC = () => {
  const colorScheme = useColorScheme();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const {
    databaseService: { replicator },
    isInitialized,
  } = useContext(DatabaseContext)!;

  useEffect(() => {
    if (!isInitialized || !replicator) {
      return;
    }

    let token = "";

    const setupListener = async () => {
      try {
        token = await replicator.addChangeListener((change) => {
          const completed = change.status.getProgress().getCompleted();
          const total = change.status.getProgress().getTotal();

          console.log(`Progress: ${completed}/${total}`);
          if (total === 0) {
            setProgress(0);
            setIsVisible(false);
            return;
          }

          const progressValue = completed / total;
          setProgress((prevProgress) => {
            const newProgress = Math.max(prevProgress, progressValue);
            return Math.min(newProgress, 1);
          });
          setIsVisible(true);

          if (progressValue >= 1) {
            setTimeout(() => setIsVisible(false), 1000);
          }
        });

        await replicator.start(true);
      } catch (error) {
        console.error("Error setting up replicator:", error);
      }
    };

    setupListener();

    return () => {
      if (token) {
        replicator.stop();
        replicator.removeChangeListener(token);
      }
    };
  }, [replicator, isInitialized]);

  if (!isInitialized || !replicator) {
    return null;
  }

  if (!isVisible || progress === 0) {
    return null;
  }

  const isDark = colorScheme === "dark";

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
    >
      <ProgressBarPaper
        progress={progress}
        color={isDark ? "#007AFF" : "#007AFF"}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80, // Adjust based on your tab bar height (typically 80-90)
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
    zIndex: 1000, // Ensure it appears above other components
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    opacity: 0.8,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressBar: {
    height: 4,
  },
});
