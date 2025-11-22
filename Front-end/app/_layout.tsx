import { useRouter, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MiniPlayer, { MiniPlayerRef } from "../Components/MiniPlayer";
import BottomBar from "../Components/BottomBar";
import { PlayerProvider } from "./PlayerContext";

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
		: "home";
    const appearBottomBar = (
        pathname.startsWith("/HomeScreen") || 
        pathname.startsWith("/NowPlayingScreen") || 
        pathname.startsWith("/CreateMoodPlaylistScreen") ||
        pathname.startsWith("/SearchScreen") ||
        pathname.startsWith("/ChoosingMoodPlayScreen")
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
                    <Stack.Screen name="ChoosingMoodPlayScreen" />
                </Stack>

                <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                    {appearBottomBar && (
                        <View style={{ position: "absolute", bottom: "2%", left: 0, right: 0, zIndex: 9999, alignItems: 'center' }}>
                            <BottomBar
                                active={activeTab as any}
                                onPress={(k) => {
                                    if (k === "home") {
                                        if (pathname === "/HomeScreen" && isPlayerExpanded) {
                                            playerRef.current?.collapse();
                                        }
                                        router.navigate("/HomeScreen");
                                    } else if (k === "radio") {
                                        playerRef.current?.expand();
                                    } else if (k === "search") {
                                        if (isPlayerExpanded) playerRef.current?.collapse();
                                        router.navigate("/SearchScreen");
                                    }
                                }}
                            />
                        </View>
                    )}
                    
                    <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "100%", zIndex: 8000 }} pointerEvents="box-none">
                        <MiniPlayer 
                            ref={playerRef} 
                            hidden={pathname === "/onboarding" || pathname === "/index"}
                            onStateChange={(expanded) => setIsPlayerExpanded(expanded)}
                        />
                    </View>
                </View>
            </PlayerProvider>
        </GestureHandlerRootView>
    );
}
