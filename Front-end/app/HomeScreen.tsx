import React, {
    useEffect,
    useState,
    useCallback,
    memo,
    useMemo 
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
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
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
import { refreshTokenUse } from '../fetchAPI/loginAPI';
import getAllPlaylist, { IPlaylist } from "../fetchAPI/getAllPlaylist";
import getAllMoods, { IMood } from "../fetchAPI/getAllMoods";

const CACHE_KEY_PLAYLIST = 'CACHE_HOME_PLAYLIST';
const CACHE_KEY_HISTORY = 'CACHE_PLAYLIST_HISTORY_IDS';
const CACHE_KEY_LAST_MOOD = 'CACHE_LAST_MOOD';
const NUM_COLS = 2;
const H_PADDING = 20;
const GAP = 16;
const ITEM_W = Math.floor((Dimensions.get("window").width - H_PADDING * 2 - GAP) / NUM_COLS);

const PlaylistItem = memo(({ item, onPress }: { item: IPlaylist, onPress: (item: IPlaylist) => void }) => {
    const imageSource = useMemo(() => {
        return (item.songs && item.songs.length > 0 && item.songs[0].image_url) ? { uri: item.songs[0].image_url } : require("../assets/images/song4.jpg");
    }, [item.thumbnail, item.songs]);

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={{ width: ITEM_W }}
            onPress={() => onPress(item)}
        >
            <View style={{ borderRadius: 16, overflow: "hidden" }}>
                <Image 
                    source={imageSource} 
                    resizeMode="cover" 
                    style={{ width: "100%", height: ITEM_W }} 
                />
            </View>
            <Text numberOfLines={1} style={styles.playlistTitle}>{item.title}</Text>
        </TouchableOpacity>
    );
});
PlaylistItem.displayName = 'PlaylistItem';

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
    const [quickStartMood, setQuickStartMood] = useState<IMood | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const mergeHistoryWithData = async (apiData: IPlaylist[]) => {
        try {
            const historyJson = await AsyncStorage.getItem(CACHE_KEY_HISTORY);
            const historyIds: string[] = historyJson ? JSON.parse(historyJson) : [];
            const historyItems = historyIds.map(id => apiData.find(p => p._id === id)).filter((item): item is IPlaylist => !!item);
            const otherItems = apiData.filter(p => !historyIds.includes(p._id));
            const finalRecentList = [...historyItems, ...otherItems].slice(0, 4);
            return finalRecentList;
        } catch (e) {
            console.error("Error merging history:", e);
            return apiData.slice(0, 4);
        }
    };

    const loadLastMood = useCallback(async (token: string | null) => {
        try {
            const lastMoodJson = await AsyncStorage.getItem(CACHE_KEY_LAST_MOOD);
            if (lastMoodJson) {
                const parsedMood: IMood = JSON.parse(lastMoodJson);
                setQuickStartMood(parsedMood);
                return;
            }

            if (token) {
                const moods = await getAllMoods(token);
                if (moods && moods.length > 0) {
                    const randomIndex = Math.floor(Math.random() * moods.length);
                    const randomMood = moods[randomIndex];
                    setQuickStartMood(randomMood);
                    await AsyncStorage.setItem(CACHE_KEY_LAST_MOOD, JSON.stringify(randomMood));
                }
            }
        } catch (error) {
            console.error("Error loading mood:", error);
        }
    }, []);

    const loadData = useCallback(async () => {
        try {
            const cachedData = await AsyncStorage.getItem(CACHE_KEY_PLAYLIST);
            if (cachedData) {
                setRecentPlaylists(JSON.parse(cachedData));
                setIsLoading(false); 
            }

            let token = await SecureStore.getItemAsync("accessToken")
            let needRefreshLogin = false;
            if (!token) {
                needRefreshLogin = true;
            }

            if (!needRefreshLogin && token) {
                const data = await getAllPlaylist(token);
                if (data && Array.isArray(data)) {
                    const sortedData = await mergeHistoryWithData(data);
                    if (JSON.stringify(sortedData) !== cachedData) {
                        setRecentPlaylists(sortedData);
                        await AsyncStorage.setItem(CACHE_KEY_PLAYLIST, JSON.stringify(sortedData));
                    }
                } else {
                    needRefreshLogin = true; 
                }

                if (!needRefreshLogin) {
                    const moods = await getAllMoods(token);
                    if (moods && moods.length > 0) {
                        const randomIndex = Math.floor(Math.random() * moods.length);
                        setQuickStartMood(moods[randomIndex]);
                        console.log("Random Mood selected:", moods[randomIndex].name);
                    }
                }

                await loadLastMood(token);
            }

            if (needRefreshLogin) {
                const newToken = await refreshTokenUse();
                if (newToken) {
                    token = newToken;
                    const dataRetry = await getAllPlaylist(newToken);
                    if (dataRetry && Array.isArray(dataRetry)) {
                        const sortedDataRetry = await mergeHistoryWithData(dataRetry);
                        setRecentPlaylists(sortedDataRetry);
                        await AsyncStorage.setItem(CACHE_KEY_PLAYLIST, JSON.stringify(sortedDataRetry));
                    }

                    const moodsRetry = await getAllMoods(newToken);
                    if (moodsRetry && moodsRetry.length > 0) {
                        const randomIndex = Math.floor(Math.random() * moodsRetry.length);
                        setQuickStartMood(moodsRetry[randomIndex]);
                        console.log("Random Mood selected (retry):", moodsRetry[randomIndex].name);
                    }

                    await loadLastMood(newToken);
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

    const handlePressItem = useCallback(async (item: IPlaylist) => {
        try {
            const historyJson = await AsyncStorage.getItem(CACHE_KEY_HISTORY);
            let historyIds: string[] = historyJson ? JSON.parse(historyJson) : [];
            historyIds = historyIds.filter(id => id !== item._id);
            historyIds.unshift(item._id);
            if (historyIds.length > 10) historyIds.pop();
            await AsyncStorage.setItem(CACHE_KEY_HISTORY, JSON.stringify(historyIds));
        } catch (e) {
            console.error("Failed to save history", e);
        }

        let validPic = "";
        if (item.songs && item.songs.length > 0 && item.songs[0].image_url) {
            validPic = item.songs[0].image_url;
        }

        router.navigate({
            pathname: "/PlaylistSong",
            params: { 
                id: item._id, 
                title: item.title,
                pic: validPic
            }
        });
    }, [router]);

    const handleQuickStartPress = () => {
        const moodToPlay = quickStartMood?.name || "happy";
        router.push({
            pathname: "/CreateMoodPlaylistScreen",
            params: { moodName: moodToPlay }
        });
    };

    useFocusEffect(
        useCallback(() => {
            const checkMoodUpdate = async () => {
                const lastMoodJson = await AsyncStorage.getItem(CACHE_KEY_LAST_MOOD);
                if (lastMoodJson) {
                    const parsedMood = JSON.parse(lastMoodJson);
                    setQuickStartMood(prev => {
                        if (prev?._id !== parsedMood._id) return parsedMood;
                        return prev;
                    });
                }
            };
            
            checkMoodUpdate();
            loadData();
        }, [loadData])
    );

    if(!fontsLoaded) return null;

    const moodDisplayName = quickStartMood?.name ? quickStartMood.name.charAt(0).toUpperCase() + quickStartMood.name.slice(1) : "Happy";
    const moodIcon = quickStartMood?.icon || "🎵"; 

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

                    <View style={{ width: "100%", alignItems: "center" }}>
                        <Text style={styles.sectionTitle}>QUICK START</Text>
                    </View>
                    
                    <View style={styles.quickStartWrapper}>
                        <Pressable
                            onPress={handleQuickStartPress}
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
                                            <Text style={styles.moodEmojiText}>{moodIcon}</Text>
                                        </View>
                                        <Text style={styles.moodNameText}>{moodDisplayName}</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.quickStartBottomRow}>
                                    <Pressable
                                        onPress={handleQuickStartPress}
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