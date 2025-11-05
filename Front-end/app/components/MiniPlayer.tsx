import React, { useRef, useState, useEffect } from "react";
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
} from "react-native-reanimated";
import styles from "./styles/MiniPlayerStyles";
import { NowPlayingPreview } from "../NowPlayingScreen";

const { height: SCREEN_H } = Dimensions.get("window");
const EXPAND_DISTANCE = SCREEN_H * 0.7;
const VELOCITY_OPEN = 1200;
const DISTANCE_OPEN = 0.35;

export default function MiniPlayer({ hidden = false }: { hidden?: boolean }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPlaying, setIsPlaying] = useState(true);
    const [progressVal, setProgressVal] = useState(0.25);
    
    const progress = useSharedValue(0);
    const miniH = useSharedValue(0);
    const handleY = useSharedValue(0);
    const startTop = useSharedValue(SCREEN_H);

    const hasMiniH   = useSharedValue(0);
    const hasHandleY = useSharedValue(0);
    const layoutReady = useSharedValue(0);

    const naviagtingRef = useRef(false);

    const recalcStartTop = () => {
        if (hasMiniH.value && hasHandleY.value) {
            startTop.value = SCREEN_H - miniH.value + handleY.value;
            layoutReady.value = 1;
        }
    };

    const openFull = () => {
        if (naviagtingRef.current) return;
        naviagtingRef.current = true;
        router.push("/NowPlayingScreen");
    };

    const pan = Gesture.Pan().onChange((e) => {
        if (!layoutReady.value) return;
        const dyUp = -e.translationY;
        progress.value = Math.min(Math.max(dyUp, 0), startTop.value);
    }).onEnd((e) => {
        if (!layoutReady.value) return;
        const flickUp = -e.velocityY > VELOCITY_OPEN;
        const passed = progress.value > startTop.value * 0.35;
        const open = flickUp || passed;
        progress.value = withTiming(open ? startTop.value : 0, { duration: 180 }, (done) => {
            if (open && done) {
                runOnJS(openFull)();
            }
        });
    });

    useEffect(() => {
        const isHome = pathname === "/" || pathname === "/HomeScreen";
        if (isHome) {
            naviagtingRef.current = false;
            progress.value = withTiming(0, { duration: 0 });
        }
    }, [pathname]);

    useEffect(() => {
        if (hidden) {
            progress.value = 0;
        }
    }, [hidden]);

    const miniStyle = useAnimatedStyle(() => {
        const p = startTop.value > 0 ? progress.value / startTop.value : 0;
        return {
            transform: [{ translateY: -progress.value }],
            opacity: 1 - p,
        };
    });

    const scrimStyle = useAnimatedStyle(() => {
        const p = startTop.value > 0 ? progress.value / startTop.value : 0;
        const opacity = interpolate(p, [0, 1], [0, 0.35], Extrapolation.CLAMP);
        return { opacity };
    });

    return (
        <View style={[styles.miniPlayerStub, hidden && { opacity: 0 }]}>
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
                    </LinearGradient>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}
