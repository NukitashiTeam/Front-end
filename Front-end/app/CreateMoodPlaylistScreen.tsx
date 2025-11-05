import React, {
    useMemo,
    useState,
    useEffect,
} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
    useRouter,
    Href,
    usePathname
} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles/CreateMoodPlaylistScreen";
import Header from "./components/Header";
import BottomBar from "./components/BottomBar";
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const WIDTH = Dimensions.get("window");

type Song = {
    id: string;
    cover: any;
    title: string;
    artist: string;
};

export default function CreateMoodPlaylistScreen() {
    const router = useRouter();
    const pathname = usePathname();
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    useEffect(() => {
        async function prepare() {
            if(fontsMontserratLoaded) {
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, [fontsMontserratLoaded]);

    if(!fontsMontserratLoaded) {
        return null;
    }
    
    const data: Song[] = [
        {
            id: `song-1`,
            cover: require("../assets/images/weebooSong.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
        {
            id: `song-2`,
            cover: require("../assets/images/lonelySong.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
        {
            id: `song-3`,
            cover: require("../assets/images/allegoryOfTheCaveSong.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
        {
            id: `song-4`,
            cover: require("../assets/images/song4.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
        {
            id: `song-5`,
            cover: require("../assets/images/song5.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
        {
            id: `song-6`,
            cover: require("../assets/images/song6.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
        {
            id: `song-7`,
            cover: require("../assets/images/sadSong.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
        {
            id: `song-8`,
            cover: require("../assets/images/song7.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
        {
            id: `song-9`,
            cover: require("../assets/images/artNowPlayingMusic.jpg"),
            title: "Name of the song",
            artist: "Artist Name",
        },
    ];

    const goLink = (k: "home" | "search" | "radio" | "music") => {
        if (k === "home") router.push("/HomeScreen");
        if (k === "radio") router.push("/NowPlayingScreen");
    };

    const renderSong = ({ item }: { item: Song }) => (
        <View style={styles.songRow}>
            <Image source={item.cover} style={styles.songCover} />
            <View style={styles.songMeta}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, {
            paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
            paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
        }]}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={["#8C84FF", "#6E5ED1"]}
                start={{ x: 0.2, y: 0.0 }}
                end={{ x: 0.8, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            
            <View style={styles.headerWrap}>
                <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
            </View>
            
            <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.back()}
                style={styles.backBtn}
            >
                <Ionicons name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerBlock}>
                <Text style={styles.sectionTitle}>Created Mood Playlist</Text>

                <View style={styles.playlistNameView}>
                    <Image source={require("../assets/images/avatar.png")} style={styles.ownerAvatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.ownerName}>Chill</Text>
                    </View>
                </View>
                
                <View style={styles.playlistHeaderRow}>
                    <View style={styles.playlistHeaderRowColumn1}>
                        <TouchableOpacity style={styles.iconCircle}>
                            <Ionicons name="shuffle-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.iconCircle, { marginLeft: 10 }]}>
                            <Ionicons name="add-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.playlistHeaderRowColumn2}>
                        <TouchableOpacity style={styles.playCircle}>
                            <Ionicons name="play" size={22} color="#4A2F7C" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <FlatList
                data={data}
                keyExtractor={(it) => it.id}
                renderItem={renderSong}
                contentContainerStyle={{ paddingBottom: 96 }}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.bottomWrap}>
                <BottomBar
                    active="home"
                    onPress={(k) => {
                        console.log("press:", k);
                        goLink(k);
                    }}
                />
            </View>
        </View>
    );
}