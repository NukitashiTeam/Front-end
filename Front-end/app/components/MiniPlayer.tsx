import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
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
import { runOnJS } from "react-native-reanimated";
import BottomBar from "./BottomBar";
import styles from "./styles/MiniPlayerStyles";

export default function MiniPlayer() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0.25);

    const goLink = (path: Href) => {
        if(pathname != path) {
            router.replace(path);
        }
    };

    const openNowPlaying = () => {
        router.push("/NowPlayingScreen");
    };

    const panGesture = Gesture.Pan().activeOffsetY(-10).failOffsetY(10).onEnd((e) => {
        if(e.translationY < -50) {
            console.log("Vuốt lên -> Mở NowPlayingScreen");
            runOnJS(openNowPlaying)();
        }
    });

    return (
        <View style={styles.miniPlayerStub}>
            <GestureDetector gesture={panGesture}>
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
                            value={progress}
                            onValueChange={(value) => setProgress(value[0])}
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
            </GestureDetector>
        </View>
    );
}