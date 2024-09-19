import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { Constants } from "expo-constants";
import LottieView from "lottie-react-native";

const CALORIES_PER_STEP = 0.05;

export default function App() {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  const animationRefRunning = useRef(null);
  const animationRefSitting = useRef(null);

  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1;
          const timestamp = new Date().getTime();

          if (
            Math.abs(y - lastY) > threshold &&
            !isCounting &&
            timestamp - lastTimestamp > 800
          ) {
            setIsCounting(true);
            setLastY(y);
            setLastTimestamp(timestamp);
            setSteps((prev) => prev + 1);

            setTimeout(() => {
              setIsCounting(false);
            }, 700);
          }
        });
      } else {
        console.log("Accelerometer is not available on this device");
      }
    });
    return () => {
      if (subscription) subscription.remove();
    };
  }, [isCounting, lastY, lastTimestamp]);

  const resetSteps = () => {
    setSteps(0);
  };
  const estimatedCaloriesBurned = steps * CALORIES_PER_STEP;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Adım Sayacı</Text>
      <View style={styles.infoContainer}>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>{steps}</Text>
          <Text style={styles.stepsLabel}>Adım</Text>
        </View>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesLabel}>Yakılan Tahmini Kalori: </Text>
          <Text style={styles.caloriesText}>
            {estimatedCaloriesBurned.toFixed(2)} Kalori
          </Text>
        </View>
      </View>
      <View style={styles.animationContainer}>
        {isCounting ? (
          <LottieView
            ref={animationRefRunning}
            autoPlay
            source={require("./assets/running.json")}
            loop
            style={{ width: 200, height: 200 }}
          />
        ) : (
          <LottieView
            ref={animationRefSitting}
            autoPlay
            source={require("./assets/sitting.json")}
            loop
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
      <TouchableOpacity onPress={resetSteps} style={styles.button}>
        <Text style={styles.buttonText}>Sıfırla</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  stepsText: {
    fontSize: 48,
    color: "#3498db",
    fontWeight: "bold",
    marginRight: 8,
  },
  stepsLabel: {
    fontSize: 24,
    color: "#555",
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  caloriesLabel: {
    fontSize: 18,
    color: "#555",
    marginRight: 6,
  },
  caloriesText: {
    fontSize: 18,
    color: "#e74c3c",
    fontWeight: "bold",
  },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "e0e0e0",
    borderRadius: 15,
    padding: 35,
    marginBottom: 20,
    elevation: 5,
  },
  animation: {
    width: 400,
    height: 400,
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
