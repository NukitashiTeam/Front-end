import { Stack } from "expo-router";

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import onboarding from "./onboarding";

export default function RootLayout() {
  return <Stack 
    screenOptions={{ headerShown: false, 
    contentStyle: {
      backgroundColor: "#818BFF",
      flex: 1,
    }
  }}
  />;
}
