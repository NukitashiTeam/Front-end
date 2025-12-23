import React, {
    useEffect,
    useState,
    useCallback,
    memo
} from "react";
import { 
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import {
    useFonts as useIrishGrover,
    IrishGrover_400Regular
} from '@expo-google-fonts/irish-grover';
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";

import styles from "../styles/HomeStyles";
import Header from "../Components/Header";
import loginAPI from "../fetchAPI/loginAPI";
import getAllPlaylist, { IPlaylist } from "../fetchAPI/getAllPlaylist";

const CACHE_KEY_PLAYLIST = 'CACHE_HOME_PLAYLIST';
const CACHE_KEY_TOKEN = 'CACHE_USER_TOKEN';
const NUM_COLS = 2;
const H_PADDING = 20;
const GAP = 16;
const ITEM_W = Math.floor((Dimensions.get("window").width - H_PADDING * 2 - GAP) / NUM_COLS);

const PlaylistItem = memo(({ item, onPress }: { item: IPlaylist, onPress: (item: IPlaylist) => void }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={{ width: ITEM_W }}
            onPress={() => onPress(item)}
        >
            <View style={{ borderRadius: 16, overflow: "hidden" }}>
                <Image 
                    source={
                        (item.thumbnail && item.thumbnail !== "") 
                        ? { uri: item.thumbnail } 
                        : require("../assets/images/MoodyBlue.png")
                    } 
                    resizeMode="cover" 
                    style={{ width: "100%", height: ITEM_W }} 
                />
            </View>
            <Text numberOfLines={1} style={styles.playlistTitle}>{item.title}</Text>
        </TouchableOpacity>
    );
});

export default function HomeScreen() {
    let [fontsIrishGroverLoaded] = useIrishGrover({
        IrishGrover_400Regular,
    });

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const fontsLoaded = fontsIrishGroverLoaded && fontsMontserratLoaded;
    const router = useRouter();

    const [isModEnabled, setIsModEnabled] = useState(true);
    const [recentPlaylists, setRecentPlaylists] = useState<IPlaylist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const cachedData = await AsyncStorage.getItem(CACHE_KEY_PLAYLIST);
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setRecentPlaylists(parsedData);
                setIsLoading(false); 
            }

            let token = await AsyncStorage.getItem(CACHE_KEY_TOKEN);
            if (!token) {
                token = await loginAPI('kieto', '123456');
                if (token) {
                    await AsyncStorage.setItem(CACHE_KEY_TOKEN, token);
                }
            }

            if (token) {
                const data = await getAllPlaylist(token);
                if (data && Array.isArray(data)) {
                    const top4 = data.slice(0, 4);
                    if (JSON.stringify(top4) !== cachedData) {
                        setRecentPlaylists(top4);
                        await AsyncStorage.setItem(CACHE_KEY_PLAYLIST, JSON.stringify(top4));
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi fetch data HomeScreen:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handlePressItem = useCallback((item: IPlaylist) => {
        console.log("Open playlist:", item.title);
        router.navigate({
            pathname: "/PlaylistSong",
            params: { 
                id: item._id, 
                title: item.title,
                pic: item.thumbnail
            }
        });
    }, [router]);

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
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={5}
                removeClippedSubviews={true} 
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
                                        onPress={() => console.log("Play!")}
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
                    <PlaylistItem item={item} onPress={handlePressItem} />
                )}
                
                ListEmptyComponent={!isLoading ? <Text style={{color:'white', textAlign:'center'}}>No playlists found</Text> : null}
                ListFooterComponent={<View style={{ height: 12 }} />}
            />
        </View>
    );
}