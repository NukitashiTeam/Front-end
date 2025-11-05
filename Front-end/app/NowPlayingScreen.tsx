console.log("✅ NowPlayingScreen loaded");
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    Animated as RNAnimated,
    Dimensions,
    StyleSheet,
    BackHandler,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Extrapolation,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Slider } from "@miblanchard/react-native-slider";
import { useRouter, usePathname, Href } from "expo-router";
import styles from "./styles/NowPlayingScreenStyles";
import Header from "./components/Header";

const { height: SCREEN_H } = Dimensions.get("window");

export type NowPlayingPreviewProps = {
    progressSV: any;
    startTopSV: any;
    pointerEvents?: "none" | "auto";
    onSeek?: (v: number) => void;
};

export function NowPlayingPreview({
    progressSV,
    startTopSV,
    pointerEvents = "none",
    onSeek,
}: NowPlayingPreviewProps) {
    const insets = useSafeAreaInsets();

    const containerStyle = useAnimatedStyle(() => {
        const dy = progressSV.value;
        const start = startTopSV.value;
        const top = -dy;
        const p = start > 0 ? dy / start : 0;

        return {
            position: "absolute",
            left: 0, right: 0, 
            top: top,
            transform: [{ scale: 0.96 + 0.04 * p }],
            opacity: 0.03 + 0.97 * p,
        };
    });

    const [isPlaying, setIsPlaying] = useState(true);
    const [isModEnabled, setIsModEnabled] = useState(true);
    const [progress, setProgress] = useState(0.25);
    const [volume, setVolume] = useState(0.8);
    const muteAnim = useRef(new RNAnimated.Value(volume > 0 ? 0 : 1)).current;
    const oldVolume = useRef(volume);
    const normalize = (v: number | number[]) => (Array.isArray(v) ? v[0] : v);

    useEffect(() => {
        RNAnimated.timing(muteAnim, {
            toValue: volume === 0 ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [volume]);

    return (
        <Animated.View
            pointerEvents={pointerEvents}
            style={containerStyle}
        >
            <View style={[styles.container, {
                paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
                paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
            }]}>
                <View style={{ height: "91%" }}>
                    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

                    <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />

                    {/* Album Art */}
                    <View style={styles.artWrapper}>
                        <Image
                            source={require("../assets/images/artNowPlayingMusic.jpg")}
                            style={styles.artImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Title + share row */}
                    <View style={styles.titleRow}>
                        <TouchableOpacity accessibilityLabel="Notifications">
                            <Ionicons name="notifications-outline" size={20} color="#EADDFF" />
                        </TouchableOpacity>

                        <View style={styles.titleCenter}>
                            <Text style={styles.songTitle}>Shape of You</Text>
                            <Text style={styles.songSubtitle}>Ed Sheeran - Happy Playlist</Text>
                        </View>

                        <TouchableOpacity accessibilityLabel="Share">
                            <Ionicons name="share-social-outline" size={20} color="#EADDFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Action row */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.smallIconBtn} accessibilityLabel="Add">
                            <Ionicons name="add" size={20} color="#EADDFF" />
                        </TouchableOpacity>

                        <View style={styles.transportRow}>
                            <TouchableOpacity accessibilityLabel="Prev">
                                <Ionicons name="play-skip-back" size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setIsPlaying((v) => !v)}
                                style={styles.playBtn}
                                accessibilityLabel="Play/Pause"
                            >
                                <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#4A2F7C" />
                            </TouchableOpacity>

                            <TouchableOpacity accessibilityLabel="Next">
                                <Ionicons name="play-skip-forward" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.smallIconBtn}
                            accessibilityLabel="More options"
                        >
                            <Ionicons name="ellipsis-horizontal" size={20} color="#EADDFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Progress + Volume bars */}
                    <View style={styles.slidersBlock}>
                        <View style={styles.progressSliderContainer}>
                            <Text style={[styles.timeText, { textAlign: "left" }]}>1:02</Text>
                            <Slider
                                containerStyle={styles.sliderContainer}
                                trackStyle={styles.sliderTrack}
                                minimumTrackStyle={styles.sliderMinTrack}
                                thumbStyle={styles.sliderThumb}
                                value={progress}
                                onValueChange={(value) => {
                                    const v = normalize(value);
                                    setProgress(v);
                                    onSeek?.(v);
                                }}
                                minimumValue={0}
                                maximumValue={1}
                            />
                            <Text style={[styles.timeText, { textAlign: "right" }]}>4:08</Text>
                        </View>

                        <View style={styles.volumeSliderContainer}>
                            <TouchableOpacity
                                style={styles.volumeIconContainer}
                                onPress={() => {
                                    if (volume > 0) {
                                        oldVolume.current = volume;
                                        setVolume(0);
                                    } else {
                                        setVolume(oldVolume.current);
                                    }
                                }}
                            >
                                <Ionicons name="volume-low-outline" size={20} color="#EADDFF" />
                                <RNAnimated.View
                                    style={[
                                        styles.muteSlash,
                                        {
                                            transform: [{ rotate: "-45deg" }, { scaleX: muteAnim }],
                                        },
                                    ]}
                                />
                            </TouchableOpacity>

                            <Slider
                                containerStyle={styles.slider}
                                trackStyle={styles.sliderTrack}
                                minimumTrackStyle={styles.sliderMinTrack}
                                thumbStyle={styles.sliderThumb}
                                value={volume}
                                onValueChange={(value) => setVolume(normalize(value))}
                                minimumValue={0}
                                maximumValue={1}
                            />
                            <Ionicons name="volume-high-outline" size={20} color="#EADDFF" />
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}

export default function NowPlayingScreen() {
    const insets = useSafeAreaInsets();
    const [isPlaying, setIsPlaying] = useState(true);
    const [isModEnabled, setIsModEnabled] = useState(true);
    const [progress, setProgress] = useState(0.25);
    const [volume, setVolume] = useState(0.8);
    const muteAnim = useRef(new RNAnimated.Value(volume > 0 ? 0 : 1)).current;
    const oldVolume = useRef(volume);
    const router = useRouter();
    const pathname = usePathname();
    const normalize = (v: number | number[]) => (Array.isArray(v) ? v[0] : v);

    const dragY = useSharedValue(0);

    const backdropStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                dragY.value,
                [0, SCREEN_H],
                [0.5, 0],
                Extrapolation.CLAMP
            ),
        };
    });

    const sheetStyle = useAnimatedStyle(() => {
        const p = interpolate(dragY.value, [0, 300], [0, 1], Extrapolation.CLAMP);
        return {
            transform: [
                { translateY: dragY.value },
                { scale: interpolate(p, [0, 1], [1, 0.96], Extrapolation.CLAMP) },
            ],
            borderTopLeftRadius: 24 * p,
            borderTopRightRadius: 24 * p,
            overflow: "hidden",
        };
        });

    const safeBack = () => {
        if (router.canGoBack?.()) {
            router.back();
        } else {
            router.replace("/Homepage");
        }
    };

    const pan = Gesture.Pan().onChange((e) => {
        const y = Math.max(0, e.translationY);
        dragY.value = y;
    }).onEnd((e) => {
        const shouldClose = e.velocityY > 1200 || dragY.value > Math.min(0.35 * SCREEN_H, 320);
        if (shouldClose) {
            dragY.value = withTiming(SCREEN_H, { duration: 220 }, (done) => {
                if (done) runOnJS(safeBack)();
            });
        } else {
            dragY.value = withTiming(0, { duration: 180 });
        }
    });

    useEffect(() => {
        RNAnimated.timing(muteAnim, {
            toValue: volume === 0 ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [volume]);

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            safeBack();
            return true;
        });
        return () => sub.remove();
    }, []);

    return (
        <GestureDetector gesture={pan}>
            <View style={{ flex: 1 }} pointerEvents="box-none">
                <Animated.View
                    pointerEvents="none"
                    style={[
                        StyleSheet.absoluteFill,
                        { backgroundColor: "black" },
                        backdropStyle,
                    ]}
                />

                <Animated.View
                    style={[
                        styles.container,
                        {
                            paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
                            paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
                        },
                        sheetStyle,
                    ]}
                >
                    <View style={{ height: "91%" }}>
                        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

                        <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />

                        <View style={styles.artWrapper}>
                            <Image
                                source={require("../assets/images/artNowPlayingMusic.jpg")}
                                style={styles.artImage}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Title + share row */}
                        <View style={styles.titleRow}>
                            <TouchableOpacity accessibilityLabel="Notifications">
                                <Ionicons name="notifications-outline" size={20} color="#EADDFF" />
                            </TouchableOpacity>

                            <View style={styles.titleCenter}>
                                <Text style={styles.songTitle}>Shape of You</Text>
                                <Text style={styles.songSubtitle}>Ed Sheeran - Happy Playlist</Text>
                            </View>

                            <TouchableOpacity accessibilityLabel="Share">
                                <Ionicons name="share-social-outline" size={20} color="#EADDFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Action row */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.smallIconBtn} accessibilityLabel="Add">
                                <Ionicons name="add" size={20} color="#EADDFF" />
                            </TouchableOpacity>

                            <View style={styles.transportRow}>
                                <TouchableOpacity accessibilityLabel="Prev">
                                    <Ionicons name="play-skip-back" size={24} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setIsPlaying((v) => !v)}
                                    style={styles.playBtn}
                                    accessibilityLabel="Play/Pause"
                                >
                                    <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#4A2F7C" />
                                </TouchableOpacity>

                                <TouchableOpacity accessibilityLabel="Next">
                                    <Ionicons name="play-skip-forward" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.smallIconBtn}
                                accessibilityLabel="More options"
                            >
                                <Ionicons name="ellipsis-horizontal" size={20} color="#EADDFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Progress + Volume bars */}
                        <View style={styles.slidersBlock}>
                            <View style={styles.progressSliderContainer}>
                                <Text style={[styles.timeText, { textAlign: "left" }]}>1:02</Text>
                                <Slider
                                    containerStyle={styles.sliderContainer}
                                    trackStyle={styles.sliderTrack}
                                    minimumTrackStyle={styles.sliderMinTrack}
                                    thumbStyle={styles.sliderThumb}
                                    value={progress}
                                    onValueChange={(value) => setProgress(normalize(value))}
                                    minimumValue={0}
                                    maximumValue={1}
                                />
                                <Text style={[styles.timeText, { textAlign: "right" }]}>4:08</Text>
                            </View>

                            <View style={styles.volumeSliderContainer}>
                                <TouchableOpacity
                                    style={styles.volumeIconContainer}
                                    onPress={() => {
                                        if (volume > 0) {
                                            oldVolume.current = volume;
                                            setVolume(0);
                                        } else {
                                            setVolume(oldVolume.current);
                                        }
                                    }}
                                >
                                    <Ionicons name="volume-low-outline" size={20} color="#EADDFF" />
                                    <RNAnimated.View
                                        style={[
                                            styles.muteSlash,
                                            {
                                                transform: [{ rotate: "-45deg" }, { scaleX: muteAnim }],
                                            },
                                        ]}
                                    />
                                </TouchableOpacity>

                                <Slider
                                    containerStyle={styles.slider}
                                    trackStyle={styles.sliderTrack}
                                    minimumTrackStyle={styles.sliderMinTrack}
                                    thumbStyle={styles.sliderThumb}
                                    value={volume}
                                    onValueChange={(value) => setVolume(normalize(value))}
                                    minimumValue={0}
                                    maximumValue={1}
                                />
                                <Ionicons name="volume-high-outline" size={20} color="#EADDFF" />
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </GestureDetector>
    );
}
