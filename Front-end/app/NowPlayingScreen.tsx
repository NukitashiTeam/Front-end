import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    Animated as RNAnimated,
} from "react-native";
import Animated, {
    type SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Slider } from "@miblanchard/react-native-slider";
import { useRouter, usePathname, Href } from "expo-router";
import styles from "./styles/NowPlayingScreenStyles";
import Header from "./components/Header";

export type NowPlayingPreviewProps = {
    progressSV: SharedValue<number>;
    startTopSV: SharedValue<number>;
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
    const router = useRouter();
    const pathname = usePathname();
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
    const [isBoost, setIsBoost] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isModEnabled, setIsModEnabled] = useState(true);
    const [progress, setProgress] = useState(0.25);
    const [volume, setVolume] = useState(0.8);
    const muteAnim = useRef(new RNAnimated.Value(volume > 0 ? 0 : 1)).current;
    const oldVolume = useRef(volume);
    const router = useRouter();
    const pathname = usePathname();
    const normalize = (v: number | number[]) => (Array.isArray(v) ? v[0] : v);

    const goLink = (path: Href) => {
        if(pathname != path) {
            router.replace(path);
        }
    };

    useEffect(() => {
        RNAnimated.timing(muteAnim, {
            toValue: volume === 0 ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [volume]);

    return (
        <View style={[styles.container, {
            paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
            paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
        }]}>
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
        </View>
    );
}
