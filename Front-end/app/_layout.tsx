import { useRouter, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MiniPlayer, { MiniPlayerRef } from "../Components/MiniPlayer";
import BottomBar from "../Components/BottomBar";
import { PlayerProvider, usePlayer } from "./PlayerContext";
import * as Sentry from '@sentry/react-native';
import { useNavigationContainerRef } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';

import {
    SafeAreaProvider,
    initialWindowMetrics,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

// 1. Khai báo integration
export const navigationIntegration = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: 'https://ff33da7f27044f642b735cc7f2ec6d9c@o4510503566049280.ingest.us.sentry.io/4510503622541312',
  
  // 2. QUAN TRỌNG: Phải thêm integration vào đây
  integrations: [
    navigationIntegration,
  ],

  tracePropagationTargets: ["https://myproject.org", /^\/api\//],
  debug: !true,

  // Performance Monitoring
  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 5000,

  // User Interaction Tracking
  enableUserInteractionTracing: true,

  // Privacy
  sendDefaultPii: false,
  maxBreadcrumbs: 150,

  // Enable native crash handling
  enableNative: true,
  enableNativeCrashHandling: true,
  enableAutoPerformanceTracing: true,
});

SplashScreen.preventAutoHideAsync();

const AppNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const { miniPlayerRef } = usePlayer(); 
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
    const [bottomBarHeight, setBottomBarHeight] = useState(0);
    const BOTTOM_GAP = 8;
    const ref = useNavigationContainerRef();

    useEffect(() => {
        if (ref) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ref]);

    const activeTab = isPlayerExpanded || pathname.startsWith("/NowPlayingScreen")
        ? "radio"
        : pathname.startsWith("/HomeScreen")
            ? "home"
            : (pathname.startsWith("/SearchScreen") || pathname.startsWith("/ChoosingMoodPlayScreen"))
                ? "search"
                : pathname.startsWith("/MyMusic") || pathname.startsWith("/CreatePlaylist") || pathname.startsWith("/PlaylistSong")
                    ? "music"
                    : "home";
                    
    const isNowPlaying = pathname.startsWith("/NowPlayingScreen") || pathname.startsWith("/CreatePlaylist");
    
    const appearBottomBar = (
        pathname.startsWith("/HomeScreen") ||
        pathname.startsWith("/NowPlayingScreen") ||
        pathname.startsWith("/CreateMoodPlaylistScreen") ||
        pathname.startsWith("/CreateContextPlaylistScreen") ||
        pathname.startsWith("/SearchScreen") ||
        pathname.startsWith("/MyMusic") ||
        pathname.startsWith("/CreatePlaylist") ||
        pathname.startsWith("/PlaylistSong") ||
        pathname.startsWith("/ChoosingMoodPlayScreen")
    );

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#818BFF", flex: 1 }
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="HomeScreen" />
                <Stack.Screen name="CreateMoodPlaylistScreen" />
                <Stack.Screen name="CreateContextPlaylistScreen" />
                <Stack.Screen name="SearchScreen" />
                <Stack.Screen name="MyMusic" />
                <Stack.Screen name="ChoosingMoodPlayScreen" />
                <Stack.Screen name="ContextConfigScreen" />
            </Stack>

            {appearBottomBar && (
                <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                    <View style={{ position: "absolute", bottom: "0%", left: 0, right: 0, zIndex: 9999, alignItems: 'center', paddingBottom: insets.bottom}}>
                        <BottomBar
                            active={activeTab as any}
                            onPress={(k) => {
                                if (k === "home") {
                                    if (pathname === "/HomeScreen" && isPlayerExpanded) {
                                        miniPlayerRef.current?.collapse();
                                    }
                                    router.navigate("/HomeScreen");
                                } else if (k === "radio") {
                                    if (pathname.startsWith("/CreatePlaylist")) {
                                        router.navigate("/NowPlayingScreen");
                                    } else {
                                        miniPlayerRef.current?.expand();
                                    }
                                } else if (k === "search") {
                                    if (isPlayerExpanded) miniPlayerRef.current?.collapse();
                                    router.navigate("/SearchScreen");
                                } else if (k === "music") {
                                    if (isPlayerExpanded) miniPlayerRef.current?.collapse();
                                    router.navigate("/MyMusic");
                                }
                            }}
                        />
                    </View>

                    {!isNowPlaying && (
                        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "100%", zIndex: 8000 }} pointerEvents="box-none">
                            <MiniPlayer
                                ref={miniPlayerRef}
                                hidden={pathname === "/onboarding" || pathname === "/index"}
                                onStateChange={(expanded) => setIsPlayerExpanded(expanded)}
                                bottomBarHeight={bottomBarHeight}
                                bottomInset={insets.bottom}
                                bottomGap={BOTTOM_GAP}
                            />
                        </View>
                    )}
                </View>
            )}
        </>
    );
};

export default Sentry.wrap(function RootLayout() {
    useEffect(() => {
        const timeout = setTimeout(() => {
            SplashScreen.hideAsync();
        }, 1200);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setPositionAsync("absolute");
            NavigationBar.setBackgroundColorAsync("#00000000");
            NavigationBar.setButtonStyleAsync("light"); 
        }
    }, []);

    useEffect(() => {
        Sentry.setUser({
            id: "nukitashiteam",
            email: "lekhanh98777@gmail.com",
            username: "khanhPear",
        });
        Sentry.setTag("group", "nukitashiteam");
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PlayerProvider>
                <AppNavigation />
            </PlayerProvider>
        </GestureHandlerRootView>
    );
});