import { Stack } from "expo-router";
import 'react-native-gesture-handler';
import NowPlayingScreen from "./NowPlayingScreen";

export default function RootLayout() {
	return (
		// <NowPlayingScreen />
		<Stack 
			screenOptions={{
				headerShown: false,
			}}
		>
            <Stack.Screen name="index" />
            <Stack.Screen 
                name="now-playing" 
                options={{
                    presentation: 'modal',
                }}
            />
		</Stack>
	);
}