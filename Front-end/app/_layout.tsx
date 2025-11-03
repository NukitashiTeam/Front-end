import { Stack } from "expo-router";
import 'react-native-gesture-handler';

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

	return (
		<Stack 
			screenOptions={{
				headerShown: false,
				presentation: "modal",
				animation: "fade",
				animationDuration: 500,
				gestureEnabled: true,
				contentStyle: {
					backgroundColor: "transparent"
				},
			}}
		>
            <Stack.Screen 
				name="index" 
				options={{
					presentation: "modal",
					// animation: "fade",
					animationDuration: 100,
				}}
			/>
            <Stack.Screen 
                name="NowPlayingScreen" 
                options={{
                    presentation: "modal",
					animation: "fade",
					gestureEnabled: true,
                }}
            />
			<Stack.Screen 
				name="CreateMoodPlaylistScreen"
				options={{}}
			/>
		</Stack>
	);
}
}
