import React, { useEffect, useState } from "react";
import { 
    View,
    StyleSheet,
    Text,
    ScrollView,
    StatusBar,
    Switch,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Pressable
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { Slider } from "@miblanchard/react-native-slider";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter, usePathname, Href } from "expo-router";
import styles from "./styles/HomeStyles";
import { useFonts as useIrishGrover, IrishGrover_400Regular} from '@expo-google-fonts/irish-grover';
import { useFonts as useMontserrat, Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import * as SplashScreen from 'expo-splash-screen';
import Header from "./components/Header";
import BottomBar from "./components/BottomBar";
import GestureHandle from "./components/GestureHandle";

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
    let [fontsIrishGroverLoaded] = useIrishGrover({
        IrishGrover_400Regular,
    });

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const fontsLoaded = fontsIrishGroverLoaded && fontsMontserratLoaded;
    const [isModEnabled, setIsModEnabled] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0.25);
    const router = useRouter();
    const pathname = usePathname();
    
    const panGesture = Gesture.Pan().onEnd((e) => {
        if(e.translationY < -50) {
            console.log("Vuốt lên -> Mở NowPlayingScreen");
            router.push('/NowPlayingScreen');
        }
    });

    const tapGesture = Gesture.Tap().onEnd(() => {
        console.log("Nhấn -> Mở NowPlayingScreen");
        router.push("/NowPlayingScreen");
    });

    const combinedGesture = Gesture.Race(panGesture, tapGesture);
    
    const RECENT_PLAYLISTS = [
        {id: "1", title: "Wibu Songs", cover: require("../assets/images/weebooSong.jpg")},
        {id: "2", title: "Sad Songs", cover: require("../assets/images/sadSong.jpg")},
        {id: "3", title: "Lonely Songs", cover: require("../assets/images/lonelySong.jpg")},
        {id: "4", title: "Allegory of the cave Songs", cover: require("../assets/images/allegoryOfTheCaveSong.jpg")},
    ];

    const goLink = (path: Href) => {
        if(pathname != path) {
            router.replace(path);
        }
    };

    const NUM_COLS = 2;
    const H_PADDING = 20;
    const GAP = 16;
    const ITEM_W = Math.floor((Dimensions.get("window").width - H_PADDING * 2 - GAP) / NUM_COLS);

    useEffect(() => {
        async function prepare() {
            if(fontsIrishGroverLoaded && fontsMontserratLoaded) {
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, [fontsLoaded]);

    if(!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />

                <LinearGradient 
                    colors={["#9fb1ff", "#3b2a89"]}
                    start={{x: 0.2, y: 0}}
                    end={{x: 0.5, y: 1}}
                    style={styles.bgGradient}
                />

                <FlatList
                    data={RECENT_PLAYLISTS}
                    keyExtractor={(it) => it.id}
                    numColumns={2}
                    contentContainerStyle={[styles.contentInner, { paddingBottom: 250 }]}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<>
                        <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />

                        {/* QUICK START */}
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <Text style={styles.sectionTitle}>QUICK START</Text>
                        </View>
                        
                        <View style={styles.quickStartWrapper}>
                            <LinearGradient
                                colors={["#4F3BDB", "#2E266F"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.quickStartCard}
                            >
                                <View style={styles.quickStartTopRow}>
                                    <Text style={styles.quickStartLabel}>Last Mood</Text>
                                    <View style={styles.quickStartLeftDown}>
                                        <View style={styles.moodAvatarCircle}>
                                            <Image source={require("../assets/images/avatar.png")} style={styles.moodAvatarImg} />
                                        </View>
                                        <Text style={styles.moodNameText}>Chill</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.quickStartBottomRow}>
                                    <View style={styles.playOuterCircle}>
                                        <View style={styles.playInnerTriangle}>
                                            <Ionicons name="play" size={24} color="#2E266F" />
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>

                        {/* RECENT PLAYLIST title */}
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <Text style={styles.sectionTitle}>RECENT PLAYLIST</Text>
                        </View>
                    </>}

                    columnWrapperStyle={{
                        justifyContent: "space-between",
                        marginBottom: GAP,
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={{ width: ITEM_W }}
                            onPress={() => console.log("Open playlist:", item.title)}
                        >
                            <View style={{ borderRadius: 16, overflow: "hidden" }}>
                                <Image source={item.cover} resizeMode="cover" style={{ width: "100%", height: ITEM_W }} />
                            </View>
                            <Text numberOfLines={1} style={styles.playlistTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={<View style={{ height: 12 }} />}
                />

                <View style={styles.miniPlayerStub}>
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
                </View>
            </View>
        </GestureHandlerRootView>
    );
}