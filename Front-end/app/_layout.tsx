import {
	Dimensions,
	StyleSheet,
	View,
	useWindowDimensions,
} from "react-native";
import {
	Stack,
	useRouter,
} from "expo-router";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomBar from "./components/BottomBar";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function RootLayout() {
	const router = useRouter();

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

			<View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
				<View
					pointerEvents="box-none"
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						bottom: "2%",
						zIndex: 9999,
						elevation: 9999,
						alignItems: "center",
					}}
				>
					<BottomBar
						active="radio"
						onPress={(k) => {
							if (k === "home") router.replace("/HomeScreen");
							else if (k === "radio") router.replace("/NowPlayingScreen");
						}}
					/>
				</View>
			</View>
		</GestureHandlerRootView>
	);
}