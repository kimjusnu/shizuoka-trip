import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { CalendarDays, Info, Wallet, BookOpen } from "lucide-react-native";

import CoverScreen from "../screens/CoverScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import InfoScreen from "../screens/InfoScreen";
import BudgetScreen from "../screens/BudgetScreen";
import StoryScreen from "../screens/StoryScreen";
import { theme } from "../constants/theme";
import { TouchableOpacity, Platform, StyleSheet } from "react-native";
import { Home } from "lucide-react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Schedule") {
            return <CalendarDays color={color} size={size} />;
          } else if (route.name === "Info") {
            return <Info color={color} size={size} />;
          } else if (route.name === "Budget") {
            return <Wallet color={color} size={size} />;
          } else if (route.name === "Story") {
            return <BookOpen color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.primaryDeep,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Home color="#fff" size={24} />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ title: "일정표" }}
      />
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{ title: "정보 & 체크" }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{ title: "가계부" }}
      />
      <Tab.Screen
        name="Story"
        component={StoryScreen}
        options={{ title: "장소 이야기" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) =>
          options?.title
            ? `${options.title} | 시즈오카 여행 플래너`
            : "시즈오카 여행 플래너",
      }}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={CoverScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: Platform.OS === "ios" ? 0 : 8,
  },
});
