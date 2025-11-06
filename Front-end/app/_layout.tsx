import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    
    // giả sử bạn có font, hoặc animation, ... thì khi xong mới hide
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Stack 
    screenOptions={{ headerShown: false, 
    contentStyle: {
      backgroundColor: "#818BFF",
      flex: 1,
    }
  }}
  >
    <Stack.Screen name="index" />
  <Stack.Screen name="onboarding" />
  <Stack.Screen name="Homepage" />
  <Stack.Screen name="CreateMoodPlaylistScreen" />
  <Stack.Screen name="NowPlayingScreen" />
</Stack>
);
}

// import {
// 	StyleSheet,
// 	View,
// } from "react-native";
// import {
// 	Stack,
// 	useRouter,
// 	usePathname,
// } from "expo-router";
// import 'react-native-gesture-handler';
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import BottomBar from "./components/BottomBar";
// import MiniPlayer from "./components/MiniPlayer";

// export default function RootLayout() {
// 	const router = useRouter();
// 	const pathname = usePathname();

// 	const activeTab = pathname === "/" || pathname.startsWith("/HomeScreen")
// 		? "home"
// 		: pathname.startsWith("/NowPlayingScreen")
// 		? "radio"
// 		: "home";
// 	const isNowPlaying = pathname.startsWith("/NowPlayingScreen");

// 	return (
// 		<GestureHandlerRootView style={{ flex: 1 }}>
// 			<Stack 
// 				screenOptions={{
// 					headerShown: false,
// 					contentStyle: {
// 						backgroundColor: "transparent"
// 					},
// 				}}
// 			>
// 				<Stack.Screen name="HomeScreen" />

// 				<Stack.Screen 
// 					name="NowPlayingScreen" 
// 					options={{
// 						presentation: "transparentModal",
// 						gestureEnabled: true,
// 						animation: "fade_from_bottom",
// 					}}
// 				/>

// 				<Stack.Screen name="CreateMoodPlaylistScreen" />
// 			</Stack>

// 			<View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
// 				<View
// 					pointerEvents="box-none"
// 					style={{
// 						position: "absolute",
// 						left: 0,
// 						right: 0,
// 						bottom: 0,
// 						zIndex: 8000,
// 						elevation: 8000
// 					}}
// 				>
// 					<MiniPlayer hidden={isNowPlaying} />
// 				</View>

// 				<View
// 					pointerEvents="box-none"
// 					style={{
// 						position: "absolute",
// 						left: 0,
// 						right: 0,
// 						bottom: "2%",
// 						zIndex: 9999,
// 						elevation: 9999,
// 						alignItems: "center",
// 					}}
// 				>
// 					<BottomBar
// 						active={activeTab as any}
// 						onPress={(k) => {
// 							if (k === "home") router.replace("/HomeScreen");
// 							else if (k === "radio") router.replace("/NowPlayingScreen");
// 						}}
// 					/>
// 				</View>
// 			</View>
// 		</GestureHandlerRootView>
// 	);
// }