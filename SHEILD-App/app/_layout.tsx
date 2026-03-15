import React, { useEffect } from "react";
import { LogBox, Platform, BackHandler } from "react-native";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

import { backgroundMonitoringTask } from "../services/BackgroundTask";

ReactNativeForegroundService.register({
  config: {
    alert: false,
    onServiceErrorCallBack: function () {
      console.warn("Foreground service error");
    },
  },
});

// Register the background task
ReactNativeForegroundService.add_task(backgroundMonitoringTask, {
    delay: 1000,
    onLoop: true,
    taskId: "shield_monitor_task",
    onError: (e) => console.log(`Error in SHIELD task:`, e),
});

LogBox.ignoreLogs(["[expo-av]: Expo AV has been deprecated"]);

const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("Expo AV has been deprecated")) {
    return;
  }
  originalWarn(...args);
};

import { Stack } from "expo-router";
import EmergencyMonitor from "../components/EmergencyMonitor";

export default function Layout() {
  useEffect(() => {
    // Start foreground service
    try {
      ReactNativeForegroundService.start({
        id: 114,
        title: "SHIELD Guardian Active",
        message: "Monitoring for emergencies",
        icon: "ic_launcher",
        button: false,
        button2: false,
        setOnlyAlertOnce: "true",
        color: "#ec1313",
        ServiceType: Platform.OS === 'android' ? "location|microphone|camera|foregroundService" : "microphone",
      } as any);
      console.log("✅ SHIELD Guardian Foreground Service Started");
    } catch (e) {
      console.log("Foreground Service errored: ", e);
    }

    // Prevent back button from closing app during emergency
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return false to allow default behavior (can be customized)
      return false;
    });

    return () => {
      backHandler.remove();
      // NOTE: We do NOT stop the foreground service here 
      // so it continues monitoring even when the app is closed/killed.
    };
  }, []);

  return (
    <>
      <EmergencyMonitor />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
