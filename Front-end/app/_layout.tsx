import { Stack } from "expo-router";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Stack 
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="HomeScreen" />

				<Stack.Screen 
					name="NowPlayingScreen" 
					options={{
						presentation: "modal",
						gestureEnabled: true,
						animation: "fade_from_bottom",
					}}
				/>

				<Stack.Screen name="CreateMoodPlaylistScreen" />
			</Stack>
		</GestureHandlerRootView>
	);
}