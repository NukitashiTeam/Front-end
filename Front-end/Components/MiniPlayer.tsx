import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { View, TouchableOpacity, Text, Dimensions, StyleSheet, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GestureHandle from "./GestureHandle"; 
import { Slider } from "@miblanchard/react-native-slider";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import styles from "../styles/MiniPlayerStyles";
import NowPlayingScreen from "../app/NowPlayingScreen";
import { usePlayer } from "../app/PlayerContext";

const { height: SCREEN_H } = Dimensions.get("window");
const MINI_HEIGHT = 80;

export type MiniPlayerRef = {
    expand: () => void;
    collapse: () => void;
};

type MiniPlayerProps = {
    hidden?: boolean;
    onStateChange?: (isExpanded: boolean) => void;
};

const MiniPlayer = forwardRef<MiniPlayerRef, MiniPlayerProps>(({ hidden = false, onStateChange }, ref) => {
    const { isPlaying, setIsPlaying, progressVal, setProgress: setProgressVal } = usePlayer();
    
    const expandProgress = useSharedValue(0); 
    const context = useSharedValue(0);

    const notifyStateChange = (expanded: boolean) => {
        if (onStateChange) {
            onStateChange(expanded);
        }
    };

    useImperativeHandle(ref, () => ({
        expand: () => {
            'worklet';
            expandProgress.value = withSpring(1, { damping: 18, stiffness: 100 });
            runOnJS(notifyStateChange)(true);
        },
        collapse: () => {
            expandProgress.value = withTiming(0, { duration: 250 });
            runOnJS(notifyStateChange)(false);
        }
    }));

    useEffect(() => {
        const backAction = () => {
            if (expandProgress.value > 0.5) {
                expandProgress.value = withSpring(0, { damping: 15 });
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);
    
    const panUp = Gesture.Pan().onStart(() => {
        context.value = expandProgress.value;
    }).onChange((e) => {
        const change = -e.translationY / (SCREEN_H - MINI_HEIGHT);
        expandProgress.value = Math.min(Math.max(context.value + change, 0), 1);
    }).onEnd((e) => {
        if (e.velocityY < -500 || expandProgress.value > 0.3) {
            expandProgress.value = withSpring(1, { damping: 18, stiffness: 100 });
            runOnJS(notifyStateChange)(true);
        } else {
            expandProgress.value = withTiming(0, { duration: 200 });
            runOnJS(notifyStateChange)(false);
        }
    });

    const panDown = Gesture.Pan().onStart(() => {
        context.value = expandProgress.value;
    }).onChange((e) => {
        if (e.translationY > 0) {
            const change = e.translationY / SCREEN_H;
            expandProgress.value = Math.max(context.value - change, 0);
        }
    }).onEnd((e) => {
        if (e.velocityY > 500 || expandProgress.value < 0.8) {
            expandProgress.value = withTiming(0, { duration: 250 });
            runOnJS(notifyStateChange)(false);
        } else {
            expandProgress.value = withSpring(1, { damping: 18, stiffness: 100 });
            runOnJS(notifyStateChange)(true);
        }
    });

    const closePlayer = () => {
        expandProgress.value = withTiming(0, { duration: 250 });
        runOnJS(notifyStateChange)(false);
    };

    const fullPlayerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            expandProgress.value,
            [0, 1],
            [SCREEN_H, 0],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ translateY }],
            opacity: interpolate(expandProgress.value, [0, 0.01], [0, 1], Extrapolation.CLAMP),
            zIndex: 10, 
        };
    });

    const miniPlayerStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(expandProgress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
            transform: [
                { translateY: interpolate(expandProgress.value, [0, 1], [0, -MINI_HEIGHT], Extrapolation.CLAMP) }
            ],
            zIndex: 5,
        };
    });

    const backdropStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(expandProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
            zIndex: 1, 
        };
    });

    if (hidden) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'black' }, backdropStyle]} pointerEvents="none" />

            <Animated.View style={[StyleSheet.absoluteFill, fullPlayerStyle]}>
                <GestureDetector gesture={panDown}>
                    <Animated.View style={{ 
                        height: 60,
                        width: '100%', 
                        position: 'absolute', 
                        top: 0, 
                        zIndex: 100,
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingBottom: 10
                    }}>
                        <GestureHandle /> 
                    </Animated.View>
                </GestureDetector>

                <NowPlayingScreen onClose={closePlayer} />
            </Animated.View>

            <GestureDetector gesture={panUp}>
                <Animated.View style={[styles.miniPlayerStub, miniPlayerStyle]}>
                    <LinearGradient
                        colors={["#580499E3", "#580499E3"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.miniBg}
                    >
                        <GestureHandle
                            onLayout={(e: any) => {
                                // handleY.value = e.nativeEvent.layout.y;
                                // hasHandleY.value = 1;
                                // recalcStartTop();
                            }}
                        />

                        <View style={{display: "flex", flexDirection: 'column', alignItems: 'center', flex: 1}}>
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
});

export default MiniPlayer;