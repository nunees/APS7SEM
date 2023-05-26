import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Chart from "../pages/Chart";
import Settings from "../pages/Settings";

const { Navigator, Screen } = createStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Chart} />
      <Screen name="settings" component={Settings} />
    </Navigator>
  );
}
