import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GestureHandle from "./GestureHandle";
import { Slider } from "@miblanchard/react-native-slider";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useRouter, usePathname } from "expo-router";
import Animated, {
    runOnJS,
    Extrapolation,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Easing,
} from "react-native-reanimated";
import styles from "../styles/MiniPlayerStyles";
import { NowPlayingPreview } from "../app/NowPlayingScreen";
import { usePlayer } from "../app/PlayerContext";

const { height: SCREEN_H } = Dimensions.get("window");
const VELOCITY_OPEN = 600;

export default function MiniPlayer({ hidden = false }: { hidden?: boolean }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isPlaying, setIsPlaying, progressVal, setProgress: setProgressVal } = usePlayer();
    
    const progress = useSharedValue(0);
    const miniH = useSharedValue(0);
    const handleY = useSharedValue(0);
    const startTop = useSharedValue(SCREEN_H);
    const savedOffset = useSharedValue(0); 

    const hasMiniH   = useSharedValue(0);
    const hasHandleY = useSharedValue(0);
    const layoutReady = useSharedValue(0);

    const naviagtingRef = useRef(false);
    const isNowPlaying = pathname === "/NowPlayingScreen";

    const recalcStartTop = () => {
        if (hasMiniH.value && hasHandleY.value) {
            startTop.value = SCREEN_H - miniH.value + handleY.value;
            layoutReady.value = 1;
        }
    };

    const openFull = () => {
        if (naviagtingRef.current) return;
        naviagtingRef.current = true;
        router.navigate("/NowPlayingScreen");
        savedOffset.value = 0; 
    };

    const pan = Gesture.Pan().onStart(() => {}).onChange((e) => {
        if(!layoutReady.value || naviagtingRef.current) return;
        const newProgress = savedOffset.value - e.translationY;
        const maxDown = -(miniH.value - 50);
        progress.value = Math.min(Math.max(newProgress, maxDown), startTop.value);
    }).onEnd((e) => {
        if (!layoutReady.value) return;
        const flickUp = -e.velocityY > VELOCITY_OPEN;
        const passedUpThreshold = progress.value > startTop.value * 0.35;
        if (progress.value > 0 && (flickUp || passedUpThreshold)) {
            progress.value = withTiming(startTop.value, { duration: 250, easing: Easing.out(Easing.cubic) }, (done) => {
                if (done) runOnJS(openFull)();
            });
            return;
        }

        const flickDown = e.velocityY > VELOCITY_OPEN;
        const passedDownThreshold = progress.value < -10; 
        const minimizedVal = -(miniH.value - 90);
        if (progress.value < 0 && (flickDown || passedDownThreshold) && !flickUp) { 
            progress.value = withTiming(minimizedVal, { 
                duration: 300, 
                easing: Easing.out(Easing.cubic) 
            });
            savedOffset.value = minimizedVal; 
        } else {
            progress.value = withTiming(0, { 
                duration: 300, 
                easing: Easing.out(Easing.cubic) 
            });
            savedOffset.value = 0;
        }
    });

    useEffect(() => {
        const isHome = pathname === "/" || pathname === "/HomeScreen";
        if (isHome) {
            naviagtingRef.current = false;
            progress.value = withTiming(0, { duration: 300 });
            savedOffset.value = 0;
        }
    }, [pathname]);

    useEffect(() => {
        if (hidden) {
            naviagtingRef.current = false;
            progress.value = 0;
            savedOffset.value = 0;
        }
    }, [hidden]);

    const miniStyle = useAnimatedStyle(() => {
        const p = startTop.value > 0 ? progress.value / startTop.value : 0;
        return {
            transform: [{ translateY: -progress.value }],
            opacity: 1 - p,
        };
    });

    const contentOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [-50, 0], [0, 1], Extrapolation.CLAMP),
        };
    });

    const scrimStyle = useAnimatedStyle(() => {
        const p = startTop.value > 0 ? progress.value / startTop.value : 0;
        const opacity = interpolate(p, [0, 1], [0, 0.35], Extrapolation.CLAMP);
        return { opacity };
    });

    return (
        <View style={[styles.miniPlayerStub, hidden && { display: "none" }]}>
            <Animated.View
                pointerEvents={hidden ? "none" : "auto"}
                style={[{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: "#000",
                }, scrimStyle]}
            />

            <NowPlayingPreview progressSV={progress} startTopSV={startTop} pointerEvents="none" />

            <GestureDetector gesture={pan}>
                <Animated.View
                    style={miniStyle}
                    onLayout={(e) => {
                        miniH.value = e.nativeEvent.layout.height;
                        hasMiniH.value = 1;
                        recalcStartTop();
                    }}
                >
                    <LinearGradient
                        colors={["#580499E3", "#580499E3"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.miniBg}
                    >
                        <GestureHandle
                            onLayout={(e: any) => {
                                handleY.value = e.nativeEvent.layout.y;
                                hasHandleY.value = 1;
                                recalcStartTop();
                            }}
                        />

                        <Animated.View style={contentOpacityStyle}>
                            <View style={styles.miniHeaderRow}>
                                <Ionicons name="notifications-outline" size={34} color="white" />
                                <View>
                                    <Text style={styles.miniTitle}>Shape of You</Text>
                                    <Text style={styles.miniSubtitle}>Ed Sherran - Happy Playlist</Text>
                                </View>
                                <Ionicons name="share-social-outline" size={34} color="white" />
                            </View>

                            <View style={styles.miniControlRow}>
                                <TouchableOpacity style={styles.miniIconBtn}>
                                    <Ionicons name="play-skip-back" size={26} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.miniIconBtn, { marginHorizontal: 24 }]}
                                    onPress={() => setIsPlaying((p) => !p)}
                                    accessibilityRole="button"
                                    accessibilityLabel={isPlaying ? "Pause" : "play"}
                                >
                                    <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.miniIconBtn}>
                                    <Ionicons name="play-skip-forward" size={26} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.miniProgressRow}>
                                <Text style={styles.miniTimeText}>1:02</Text>
                                <Slider
                                    containerStyle={styles.miniSliderContainer}
                                    trackStyle={styles.miniSliderTrack}
                                    minimumTrackStyle={styles.miniSliderMinTrack}
                                    thumbStyle={styles.miniSliderThumb}
                                    value={progressVal}
                                    onValueChange={(v) => setProgressVal(Array.isArray(v) ? v[0] : v)}
                                    minimumValue={0}
                                    maximumValue={1}
                                />
                                <Text style={styles.miniTimeText}>4:08</Text>
                            </View>
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}