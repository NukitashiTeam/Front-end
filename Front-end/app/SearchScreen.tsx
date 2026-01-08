import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    StatusBar,
    Platform,
    Pressable,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import Animated, { 
    useAnimatedScrollHandler, 
    useSharedValue, 
    useAnimatedStyle, 
    interpolate, 
    Extrapolation,
    SharedValue 
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from 'expo-secure-store';
import styles from "../styles/SearchScreenStyles";
import Header from "../Components/Header";
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import AsyncStorage from '@react-native-async-storage/async-storage';
import searchSongsByKeyword, { SongPreview } from "@/fetchAPI/SearchMusic";
import getAllMoods, { IMood } from "@/fetchAPI/getAllMoods";
import getContextUser, { IContextData } from "@/fetchAPI/getContextUserHome"; 
import { refreshTokenUse } from '@/fetchAPI/loginAPI';
import { IMusicDetail } from "@/fetchAPI/getMusicById";
import { usePlayer } from "./PlayerContext";

const RECENT_SONGS_KEY = 'RECENT_PLAYED_SONGS_HISTORY';
const CACHE_KEY_LAST_MOOD = 'CACHE_LAST_MOOD';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTEXT_ITEM_WIDTH = SCREEN_WIDTH * 0.3;
const CONTEXT_ITEM_SIZE = CONTEXT_ITEM_WIDTH;
const SPACER = (SCREEN_WIDTH - CONTEXT_ITEM_SIZE) / 2;

type ContextItem = {
    id: string;
    title: string;
    bgColor: string;
    icon: string;
    uniqueKey?: string;
};

export default function SearchScreen() {
    const router = useRouter();
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();
    const { playTrack, playList, miniPlayerRef } = usePlayer();

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });
    
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResult, setSearchResults] = useState<SongPreview[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchedKeyword, setSearchedKeyword] = useState<string>("");
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [moods, setMoods] = useState<IMood[]>([]);
    
    const [contexts, setContexts] = useState<IContextData[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [recentSongs, setRecentSongs] = useState<SongPreview[]>([]);

    const infiniteContextData = useMemo(() => {
        if (contexts.length === 0) return [];
        const mappedContexts: ContextItem[] = contexts.map(c => ({
            id: c._id,
            title: c.name,
            bgColor: c.color || '#F0E5C3',
            icon: c.icon || '🔥'
        }));

        let data: ContextItem[] = [];
        for (let i = 0; i < 20; i++) {
            data = [...data, ...mappedContexts];
        }
        return data.map((item, index) => ({ ...item, uniqueKey: `${item.id}_${index}` }));
    }, [contexts]);

    const scrollX = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
    });
    
    const loadRecentSongs = async () => {
        try {
            const savedSongs = await AsyncStorage.getItem(RECENT_SONGS_KEY);
            if (savedSongs) {
                setRecentSongs(JSON.parse(savedSongs));
            }
        } catch (error) {
            console.error("Failed to load recent songs", error);
        }
    };

    const addToHistory = async (song: SongPreview) => {
        try {
            let currentList = [...recentSongs];
            currentList = currentList.filter(item => 
                (item.track_id && item.track_id !== song.track_id) || 
                (item._id && item._id !== song._id)
            );

            currentList.unshift(song);
            if (currentList.length > 10) {
                currentList = currentList.slice(0, 10);
            }

            setRecentSongs(currentList);
            await AsyncStorage.setItem(RECENT_SONGS_KEY, JSON.stringify(currentList));
        } catch (error) {
            console.error("Failed to save history", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                await loadRecentSongs();

                let token = await SecureStore.getItemAsync("accessToken");
                const fetchAll = async (currentToken: string) => {
                    const [moodsData, contextsData] = await Promise.all([
                        getAllMoods(currentToken),
                        getContextUser(currentToken)
                    ]);
                    return { moodsData, contextsData };
                };

                let results = null;
                if (token) {
                    results = await fetchAll(token);
                }
                
                if (!results || !results.moodsData || !results.contextsData) {
                    const newToken = await refreshTokenUse();
                    if (newToken) {
                        results = await fetchAll(newToken);
                    }
                }
                
                if (results) {
                    if (results.moodsData && Array.isArray(results.moodsData)) {
                        setMoods(results.moodsData);
                    }
                    if (results.contextsData && Array.isArray(results.contextsData)) {
                        setContexts(results.contextsData);
                    }
                }
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = async()=>{
        const keyword = searchKeyword.trim();
        if(!keyword) return;
        setIsSearching(true);
        setIsSearchMode(true);
        setSearchedKeyword(keyword);
        try {
            const results = await searchSongsByKeyword(keyword, 10);
            setSearchResults(results);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }

    const handleBack = () => {
        setIsSearchMode(false);
        setSearchKeyword("");
        setSearchResults([]);
        setSearchedKeyword("");
        setIsSearching(false);
    };

    const renderSongItem = ({ item, index }: { item: SongPreview, index: number }) => (
        <TouchableOpacity 
            style={styles.songRow}
            onPress={() => {
                if (miniPlayerRef.current) {
                    miniPlayerRef.current.expand();
                }
                addToHistory(item); 
                const sourceList = isSearchMode ? searchResult : recentSongs;
                const fullQueue: IMusicDetail[] = sourceList.map(song => ({
                    _id: song._id,
                    track_id: song.track_id,
                    title: song.title,
                    artist: song.artist,
                    album: song.album,
                    genre: song.genre,
                    mp3_url: song.mp3_url,
                    image_url: song.image_url,
                    release_date: song.release_date,
                    mood: song.moods && song.moods.length > 0 ? song.moods[0].name : ""
                }));
                playList(fullQueue, index);
            }}
        >
            <Image source={{ uri: item.image_url }} style={styles.songCover} resizeMode="cover"/>
            <View style={styles.songMeta}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title || "Unknown Title"}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist || "Unknown Artist"}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderMoodItem = ({ item }: { item: IMood }) => (
        <TouchableOpacity 
            style={styles.moodItemWrapper}
            onPress={async () => {
                try {
                    await AsyncStorage.setItem(CACHE_KEY_LAST_MOOD, JSON.stringify(item));
                } catch (error) {
                    console.error("Failed to save last mood:", error);
                }

                router.push({
                    pathname: "/CreateMoodPlaylistScreen",
                    params: {moodName: item.name}
                });
            }}
        >
            <View style={[styles.moodAvatarCircle, { backgroundColor: item.colorCode || '#E0E0E0' }]}>
                <Text style={styles.moodEmojiText}>{item.icon}</Text>
            </View>
            <Text style={styles.moodNameText} numberOfLines={2}>{item.displayName}</Text>
        </TouchableOpacity>
    );

    const AnimatedContextItem = ({ item, index, scrollX }: { item: ContextItem, index: number, scrollX: SharedValue<number> }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 2) * CONTEXT_ITEM_SIZE,
                (index - 1) * CONTEXT_ITEM_SIZE,
                index * CONTEXT_ITEM_SIZE,
                (index + 1) * CONTEXT_ITEM_SIZE,
                (index + 2) * CONTEXT_ITEM_SIZE,
            ];
            const scale = interpolate(scrollX.value, inputRange, [0.9, 0.95, 1.1, 0.95, 0.9], Extrapolation.CLAMP);
            const opacity = interpolate(scrollX.value, inputRange, [0.3, 0.6, 1, 0.6, 0.3], Extrapolation.CLAMP);
            return {
                transform: [{ scale }],
                opacity: opacity,
                zIndex: index === Math.round(scrollX.value / CONTEXT_ITEM_SIZE) ? 10 : 1,
            };
        });

        return (
            <Animated.View style={[{ width: CONTEXT_ITEM_WIDTH, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }, animatedStyle]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        router.push({
                            pathname: "/ContextConfigScreen",
                            params: {
                                mode: "config",
                                contextId: item.id, 
                            }
                        });
                    }}
                >
                    <View style={[styles.contextCard, { backgroundColor: item.bgColor }]}>
                        <Text style={{ fontSize: 40, marginBottom: 8 }}>{item.icon}</Text>
                        <Text style={[styles.contextTitle]}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, {
            paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
            paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
            paddingHorizontal: (Platform.OS === "android" ? 12 : 8),
        }]}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={["#8C84FF", "#6E5ED1"]}
                start={{ x: 0.2, y: 0.0 }}
                end={{ x: 0.8, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            
            <FlatList<SongPreview>
                data={isSearchMode ? searchResult : recentSongs}
                keyExtractor={(item) => item.track_id || item._id}
                ListHeaderComponent={
                    <View style={styles.headerBlock}>
                        {!isSearchMode && (
                            <View style={{ marginBottom: 10, marginHorizontal: -10 }}>
                                <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
                            </View>
                        )}

                        <View style={styles.searchContainer}>
                            <Ionicons name="search-outline" size={22} color="#8E8E93" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Find By Name, Artists or Mood"
                                placeholderTextColor="#8E8E93"
                                style={styles.searchInput}
                                value={searchKeyword}
                                onChangeText={setSearchKeyword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="search"
                                onSubmitEditing={handleSearch}
                            />
                            {searchKeyword === "" ? (
                                <Ionicons name="mic-outline" size={22} color="#555555" />
                            ) : (
                                <TouchableOpacity onPress={handleSearch}>
                                    <Ionicons name="arrow-forward" size={24} color="transparent" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {isSearchMode ? (<>
                            <View style={styles.resultHeaderContainer}>
                                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                                </TouchableOpacity>

                                <Text style={styles.resultTitleText} numberOfLines={1}>
                                    Kết quả cho "{searchedKeyword}"
                                </Text>
                                
                                <View style={styles.spacer} />
                            </View>

                            {isSearching && (
                                <ActivityIndicator size="small" color="#FFF" style={{marginBottom: 10}} />
                            )}
                        </>) : (<>
                            <View style={styles.suggestionsMoodPlaylistTextBlock}>
                                <Text style={styles.sectionTitle}>All Mood Playlist</Text>
                                <TouchableOpacity onPress={() => router.navigate("/ChoosingMoodPlayScreen")}>
                                    <Text style={styles.showMoreText}>Show more</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.moodListContainer}>
                                {loadingData ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <FlatList<IMood>
                                        data={moods}
                                        keyExtractor={(item) => item._id}
                                        renderItem={renderMoodItem}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 10 }}
                                    />
                                )}
                            </View>

                            <View style={styles.suggestionsMoodPlaylistTextBlock}>
                                <Text style={styles.sectionTitle}>Context Playlist</Text>
                                <TouchableOpacity onPress={() => router.navigate("/ContextUserListScreen")}>
                                    <Text style={styles.showMoreText}>See all context</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.contextSection}>
                                {loadingData ? (
                                     <ActivityIndicator size="small" color="#FFF" />
                                ) : contexts.length > 0 ? (
                                    <Animated.FlatList
                                        data={infiniteContextData}
                                        keyExtractor={(item) => item.uniqueKey!}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        snapToInterval={CONTEXT_ITEM_SIZE}
                                        decelerationRate="fast"
                                        contentContainerStyle={{ paddingHorizontal: SPACER, paddingVertical: 10, alignItems: 'center' }}
                                        onScroll={onScroll}
                                        scrollEventThrottle={16}
                                        renderItem={({ item, index }) => (
                                            <AnimatedContextItem item={item} index={index} scrollX={scrollX} />
                                        )}
                                        getItemLayout={(data, index) => ({
                                            length: CONTEXT_ITEM_SIZE, offset: CONTEXT_ITEM_SIZE * index, index,
                                        })}
                                        initialScrollIndex={contexts.length * 2} 
                                    />
                                ) : (
                                    <Text style={{color: '#FFF', textAlign: 'center'}}>No contexts found</Text>
                                )}
                            </View>

                            <Text style={styles.ownerName}>Recent Playlist&apos;s Song</Text>
                        </>)}
                    </View>
                }
                
                renderItem={renderSongItem}
                contentContainerStyle={{ paddingBottom: 96 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    isSearchMode && !isSearching && searchResult.length === 0 ? (
                        <View style={{ alignItems: "center", marginTop: 40 }}>
                            <Ionicons name="musical-notes-outline" size={60} color="#DDD" />
                            <Text style={{ color: "#FFF", marginTop: 10 }}>Không tìm thấy kết quả</Text>
                        </View>
                    ) : (!isSearchMode && recentSongs.length === 0 ? (
                         <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: "#EEE", fontStyle: 'italic' }}>Bạn chưa nghe bài nào gần đây</Text>
                        </View>
                    ) : null)
                }
            />
        </View>
    );
}