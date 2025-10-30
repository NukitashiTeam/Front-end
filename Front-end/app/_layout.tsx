import { Stack } from "expo-router";
import NowPlayingScreen from "./NowPlayingScreen";

export default function RootLayout() {
	return (
		// <Stack 
		// 	screenOptions={{
		// 		headerShown: false,
		// 	}}
		// />
		<NowPlayingScreen />
	);
}
