import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { Platform } from "react-native";

if (Platform.OS === "web") {
  const customFontStyles = `
    @font-face {
      font-family: 'SchoolSafetyPictureDiary';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-5@1.0/HakgyoansimGeurimilgiTTF-R.woff2') format('woff2');
      font-weight: normal;
      font-display: swap;
    }
    * {
      font-family: 'SchoolSafetyPictureDiary', 'Noto Sans KR', sans-serif !important;
    }
  `;
  const style = document.createElement("style");
  style.type = "text/css";
  if (style.styleSheet) {
    style.styleSheet.cssText = customFontStyles;
  } else {
    style.appendChild(document.createTextNode(customFontStyles));
  }
  document.head.appendChild(style);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
