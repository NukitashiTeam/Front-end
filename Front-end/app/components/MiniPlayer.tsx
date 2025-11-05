import React, {
    useRef,
    useState,
    useEffect,
} from "react";
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import GestureHandle from "./GestureHandle";
import { Slider } from "@miblanchard/react-native-slider";
import {
    Gesture,
    GestureDetector,
} from "react-native-gesture-handler";
import {
    useRouter,
    usePathname,
    Href
} from "expo-router";
import Animated, {
    runOnJS,
    Extrapolation,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import BottomBar from "./BottomBar";
import styles from "./styles/MiniPlayerStyles";

const { height: SCREEN_H } = Dimensions.get("window");
const EXPAND_DISTANCE = SCREEN_H * 0.7;
const VELOCITY_OPEN = 1200;
const DISTANCE_OPEN = 0.35;

export default function MiniPlayer() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPlaying, setIsPlaying] = useState(true);
    const [progressVal, setProgressVal] = useState(0.25);
    const progress = useSharedValue(0);
    const startProgress = useSharedValue(0);
    const naviagtingRef = useRef(false);

    const goLink = (path: Href) => {
        if(pathname != path) {
            router.replace(path);
        }
    };

    const openFull = () => {
        if(naviagtingRef.current) return;
        naviagtingRef.current = true;
        router.push("/NowPlayingScreen");
    };

    const pan = Gesture.Pan().onChange((e) => {
        const dy = -e.translationY;
        const p = Math.min(Math.max(dy / EXPAND_DISTANCE, 0), 1);
        progress.value = p;
    }).onEnd((e) => {
        const flickUp = -e.velocityY > VELOCITY_OPEN;
        const passedDistance = progress.value > DISTANCE_OPEN;
        const shouldOpen = flickUp || passedDistance;
        progress.value = withTiming(shouldOpen ? 1 : 0, { duration: 180 }, (finished) => {
            if (shouldOpen && finished) {
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

    const miniStyle = useAnimatedStyle(() => {
        const translateY = -interpolate(
            progress.value,
            [0, 1],
            [0, EXPAND_DISTANCE],
            Extrapolation.CLAMP,
        );

        const opacity = interpolate(progress.value, [0, 1], [1, 0]);
        return {
            transform: [{
                translateY
            }],
            opacity,
        }
    });

    const fullPreviewStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            progress.value, 
            [0, 1],
            [SCREEN_H * 0.35, 0],
            Extrapolation.CLAMP,
        );

        const opacity = interpolate(progress.value, [0, 1], [1, 0]);
        return {
            transform: [{
                translateY
            }],
            opacity,
        }
    });

    return (
        <View style={styles.miniPlayerStub}>
            {/* <Animated.View 
                pointerEvents="none"
                style={[{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }, fullPreviewStyle]}
            >
                <LinearGradient
                    colors={["#4A2F7C", "#1C1340"]}
                    start={{ x: 0, y: 0}}
                    end={{ x: 1, y: 1}}
                    style={{
                        flex: 1,
                        paddingTop: 32,
                        paddingHorizontal: 20,
                    }}
                >
                    <Text
                        style={{
                            color: "#EADDFF",
                            fontSize: 18,
                            marginBottom: 14,
                        }}
                    >
                        Now Playing
                    </Text>

                    <View style={{ flexDirection: "row", gap: 24, alignItems: "center" }}>
                        <Ionicons name="play-skip-back" size={24} color="#fff" />
                        <View
                        style={{
                            width: 64,
                            height: 64,
                            backgroundColor: "white",
                            borderRadius: 32,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        >
                        <Ionicons name="pause" size={28} color="#4A2F7C" />
                        </View>
                        <Ionicons name="play-skip-forward" size={24} color="#fff" />
                    </View>
                </LinearGradient>
            </Animated.View> */}

            <GestureDetector gesture={pan}>
                <Animated.View style={miniStyle}>
                    <LinearGradient
                        colors={["#580499E3", "#580499E3"]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.miniBg}
                    >
                        <GestureHandle />

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
                                onPress={() => setIsPlaying(p => !p)}
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
                        
                        <BottomBar
                            active="home"
                            onPress={(k) => {
                                console.log("press:", k);
                                if(k === "home") goLink("/");
                                else if(k === "radio") goLink("/NowPlayingScreen");
                            }}
                        />
                    </LinearGradient>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}