import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Platform,
    Animated,
    Easing,
    Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from 'expo-secure-store';
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import styles from "@/styles/CreateMoodPlaylistScreenStyles"; 
import Header from "@/Components/Header";
import getRandomSongsByContext, { ISongContextItem } from "@/fetchAPI/getRandomSongsByContext";
import { IMusicDetail } from "@/fetchAPI/getMusicById";
import { usePlayer } from "./PlayerContext";
import { addToHistory } from "@/app/src/historyHelper"; 

export default function CreateContextPlaylistScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { playTrack, playList, miniPlayerRef } = usePlayer();
    
    const params = useLocalSearchParams();
    const contextNameParam = params.contextName as string || "Context";
    const contextIconParam = params.contextIcon as string || "📚";
    const contextColorParam = params.contextColor as string || "#9fb1ff";
    const initialSongsJson = params.songsData as string;

    const [isModEnabled, setIsModEnabled] = useState(false);
    const [songList, setSongList] = useState<ISongContextItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotateAnim.setValue(0);
        }
    }, [isLoading, rotateAnim]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    useEffect(() => {
        if (initialSongsJson) {
            try {
                const parsedSongs = JSON.parse(initialSongsJson);
                if (Array.isArray(parsedSongs)) {
                    setSongList(parsedSongs);
                }
            } catch (e) {
                console.error("Lỗi parse songsData:", e);
            }
        }
    }, [initialSongsJson]);

    const handleRefreshSongs = async () => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                console.log(`Refreshing songs for context: ${contextNameParam}`);
                const responseData = await getRandomSongsByContext(token, contextNameParam);
                if (responseData && responseData.success) {
                    setSongList(responseData.data);
                } else {
                    Alert.alert("Thông báo", "Không lấy được dữ liệu mới.");
                }
            } else {
                Alert.alert("Lỗi", "Phiên đăng nhập hết hạn.");
            }
        } catch (error) {
            console.error("Lỗi khi refresh songs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!fontsMontserratLoaded) return null;

    const convertToPlayerQueue = (songs: ISongContextItem[]): IMusicDetail[] => {
        return songs.map(song => ({
            _id: song.songId,
            track_id: song.songId,
            title: song.title,
            artist: song.artist,
            image_url: song.image_url || "",
            mp3_url: (song as any).mp3_url || "",
            release_date: "",
            album: "",
            genre: "",
            mood: ""
        }));
    };

    const handlePlaySong = async (item: ISongContextItem) => {
        if (miniPlayerRef.current) {
            miniPlayerRef.current.expand();
        }
        
        const songData = {
            ...item,
            track_id: item.songId,
            _id: item.songId,
            image_url: item.image_url || "", 
            mp3_url: (item as any).mp3_url || "",
            album: "",
            genre: "",
            release_date: "",
            mood: ""
        };

        addToHistory(songData);
        const fullQueue = convertToPlayerQueue(songList);
        const selectedIndex = songList.findIndex(s => s.songId === item.songId);
        if (selectedIndex !== -1) {
            await playList(fullQueue, selectedIndex);
        } else {
            await playTrack(songData as any);
        }
    };

    const handlePlayAll = async () => {
        if (songList.length > 0) {
            if (miniPlayerRef.current) miniPlayerRef.current.expand();
            const fullQueue = convertToPlayerQueue(songList);
            await playList(fullQueue, 0);
        }
    };

    const renderSong = ({ item }: { item: ISongContextItem }) => (
        <TouchableOpacity 
            style={styles.songRow} 
            onPress={() => handlePlaySong(item)}
        >
            <Image 
                source={item.image_url ? { uri: item.image_url } : require("../assets/images/song4.jpg")} 
                style={styles.songCover} 
            />
            <View style={styles.songMeta}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
            </View>
            
            <Ionicons name="play-circle-outline" size={24} color="#ccc" style={{marginLeft: 'auto'}}/>
        </TouchableOpacity>
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
                <Text style={styles.sectionTitle}>Create Context Playlist</Text>

                <View style={styles.playlistNameView}>
                    <View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: contextColorParam,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12
                    }}>
                        <Text style={{ fontSize: 24 }}>
                            {contextIconParam.length < 5 ? contextIconParam : '🎧'} 
                        </Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <Text style={styles.ownerName}>{contextNameParam}</Text> 
                    </View>
                </View>
                
                <View style={styles.playlistHeaderRow}>
                    <View style={styles.playlistHeaderRowColumn1}>
                        <TouchableOpacity style={styles.iconCircle} onPress={handleRefreshSongs}>
                            <Ionicons name="refresh" size={18} color="#fff" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.iconCircle, { marginLeft: 10 }]}
                            onPress={() => {
                                if (songList.length > 0) {
                                    router.push({
                                        pathname: '/CreatePlaylist',
                                        params: { 
                                            songsData: JSON.stringify(songList),
                                            defaultTitle: `${contextNameParam} Mix`
                                        }
                                    });
                                } else {
                                    Alert.alert("Lỗi", "Danh sách trống");
                                }
                            }}
                        >
                            <Ionicons name="add-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.playlistHeaderRowColumn2}>
                        <TouchableOpacity style={styles.playCircle} onPress={handlePlayAll}>
                            <Ionicons name="play" size={22} color="#4A2F7C" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{alignItems: "center", justifyContent: "center", marginBottom: 20}}>
                        <Text style={{fontSize: 20, fontWeight: '600', color: 'white'}}>Generating Playlist...</Text>
                    </View>
                    
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <View style={styles.spinner}>
                            <View style={[styles.segment, { opacity: 1 }]} />
                            <View style={[styles.segment, { opacity: 0.9, transform: [{ rotate: '45deg' }] }]} />
                            <View style={[styles.segment, { opacity: 0.8, transform: [{ rotate: '90deg' }] }]} />
                            <View style={[styles.segment, { opacity: 0.7, transform: [{ rotate: '135deg' }] }]} />
                            <View style={[styles.segment, { opacity: 0.5, transform: [{ rotate: '180deg' }] }]} />
                            <View style={[styles.segment, { opacity: 0.3, transform: [{ rotate: '225deg' }] }]} />
                            <View style={[styles.segment, { opacity: 0.2, transform: [{ rotate: '270deg' }] }]} />
                            <View style={[styles.segment, { opacity: 0.1, transform: [{ rotate: '315deg' }] }]} />
                        </View>
                    </Animated.View>
                </View>
            ) : (
                <FlatList
                    data={songList}
                    keyExtractor={(it) => it.songId}
                    renderItem={renderSong}
                    contentContainerStyle={{ paddingBottom: 96 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                            No songs found for this context.
                        </Text>
                    }
                />
            )}
        </View>
    );
}