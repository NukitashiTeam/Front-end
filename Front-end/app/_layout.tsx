import { useRouter, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MiniPlayer, { MiniPlayerRef } from "../Components/MiniPlayer";
import BottomBar from "../Components/BottomBar";
import  PlayerProvider  from "./PlayerContext";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

    const playerRef = useRef<MiniPlayerRef>(null);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            SplashScreen.hideAsync();
        }, 1200);
        return () => clearTimeout(timeout);
    }, []);

	const activeTab = isPlayerExpanded
        ? "radio"
        : pathname.startsWith("/HomeScreen")
        ? "home"
        : (pathname.startsWith("/SearchScreen") || pathname.startsWith("/ChoosingMoodPlayScreen"))
        ? "search"
		: pathname.startsWith("/MyMusic")
        ? "music"
        : "home";
	const isNowPlaying = pathname.startsWith("/NowPlayingScreen")||pathname.startsWith("/MyMusic")||pathname.startsWith("/CreatePlaylist")||pathname.startsWith("/PlaylistSong");
    const appearBottomBar = (
        pathname.startsWith("/HomeScreen") || 
        pathname.startsWith("/NowPlayingScreen") || 
        pathname.startsWith("/CreateMoodPlaylistScreen") ||
        pathname.startsWith("/SearchScreen")||
        pathname.startsWith("/MyMusic")||
        pathname.startsWith("/CreatePlaylist")||
        pathname.startsWith("/PlaylistSong")
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PlayerProvider>
            <Stack 
                screenOptions={{
                    headerShown: false, 
                    contentStyle: {
                        backgroundColor: "#818BFF",
                        flex: 1,
                    }
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="HomeScreen" />
                <Stack.Screen name="CreateMoodPlaylistScreen" />
                <Stack.Screen name="SearchScreen" />
                <Stack.Screen name="MyMusic" />
                <Stack.Screen 
                    name="NowPlayingScreen" 
                    options={{
                        presentation: "transparentModal",  // Overlay lên screen trước, không replace
                        gestureEnabled: true,              // Cho phép gesture swipe down để back (đã có pan gesture trong NowPlayingScreen)
                        animation: "none",                 // Bỏ animation default để seamless với gesture của MiniPlayer
                        contentStyle: { backgroundColor: 'transparent' },
                    }}
                />
            </Stack>

                <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                    <View
                        pointerEvents="box-none"
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 8000,
                            elevation: 8000,
                        }}
                    >
                        <MiniPlayer hidden={isNowPlaying} />
                    </View>

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
                            active={activeTab as any}
                            onPress={(k) => {
                                if (k === "home") router.navigate("/HomeScreen");
                                else if (k === "radio") router.navigate("/NowPlayingScreen");
                                else if (k === "search") router.navigate("/SearchScreen");
                                else if (k === "music") router.navigate("/MyMusic");
                            }}
                        />
                    </View>
                </View>
            </PlayerProvider>
        </GestureHandlerRootView>
    );
}
