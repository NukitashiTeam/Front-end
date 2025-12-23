import React, {
    useEffect,
    useState
} from "react";
import { 
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Pressable
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import styles from "../styles/HomeStyles";
import {
    useFonts as useIrishGrover,
    IrishGrover_400Regular
} from '@expo-google-fonts/irish-grover';
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from 'expo-splash-screen';
import Header from "../Components/Header";
import loginAPI from "../fetchAPI/loginAPI";
import getAllPlaylist, { IPlaylist } from "../fetchAPI/getAllPlaylist";

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
    const router = useRouter();
    
    // const RECENT_PLAYLISTS = [
    //     {id: "1", title: "Wibu Songs", cover: require("../assets/images/weebooSong.jpg")},
    //     {id: "2", title: "Sad Songs", cover: require("../assets/images/sadSong.jpg")},
    //     {id: "3", title: "Lonely Songs", cover: require("../assets/images/lonelySong.jpg")},
    //     {id: "4", title: "Allegory of the cave Songs", cover: require("../assets/images/allegoryOfTheCaveSong.jpg")},
    // ];

    const [recentPlaylists, setRecentPlaylists] = useState<IPlaylist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const NUM_COLS = 2;
    const H_PADDING = 20;
    const GAP = 16;
    const ITEM_W = Math.floor((Dimensions.get("window").width - H_PADDING * 2 - GAP) / NUM_COLS);

    useEffect(() => {
        if (!fontsLoaded) return;
        (async () => {
            await SplashScreen.hideAsync();
        })();
    }, [fontsLoaded]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = await loginAPI('kieto', '123456');
                if (token) {
                    const data = await getAllPlaylist(token);

                    if (data && Array.isArray(data)) {
                        const top4 = data.slice(0, 4);
                        setRecentPlaylists(top4);
                    }
                }
            } catch (error) {
                console.error("Lỗi fetch data HomeScreen:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if(!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient 
                colors={["#9fb1ff", "#3b2a89"]}
                start={{x: 0.2, y: 0}}
                end={{x: 0.5, y: 1}}
                style={styles.bgGradient}
            />

            <FlatList
                data={recentPlaylists}
                keyExtractor={(item) => item._id}
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
                        <Pressable
                            onPress={() => router.push("/CreateMoodPlaylistScreen")}
                            style={({ pressed }) => [{
                                opacity: pressed ? 0.96 : 1
                            }]}
                        >
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
                                    <Pressable
                                        onPress={() => {
                                            console.log("Play!");
                                        }}
                                        accessibilityRole="button"
                                        accessibilityLabel="Play"
                                        hitSlop={8}
                                    >
                                        <View style={styles.playOuterCircle}>
                                            <View style={styles.playInnerTriangle}>
                                                <Ionicons name="play" size={24} color="#2E266F" />
                                            </View>
                                        </View>
                                    </Pressable>
                                </View>
                            </LinearGradient>
                        </Pressable>
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
                        onPress={() => {
                            console.log("Open playlist:", item.title);
                            router.navigate({
                                pathname: "/PlaylistSong",
                                params: { 
                                    id: item._id, 
                                    title: item.title,
                                    pic: item.thumbnail
                                }
                            });
                        }}
                    >
                        <View style={{ borderRadius: 16, overflow: "hidden" }}>
                            <Image source={
                                (item.thumbnail && item.thumbnail !== "") 
                                ? { uri: item.thumbnail } 
                                : require("../assets/images/MoodyBlue.png")
                            } resizeMode="cover" style={{ width: "100%", height: ITEM_W }} />
                        </View>
                        <Text numberOfLines={1} style={styles.playlistTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={!isLoading ? <Text style={{color:'white', textAlign:'center'}}>No playlists found</Text> : null}
                ListFooterComponent={<View style={{ height: 12 }} />}
            />

            {/* <MiniPlayer /> */}
        </View>
    );
}