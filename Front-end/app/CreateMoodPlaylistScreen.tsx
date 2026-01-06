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
    Easing
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
import styles from "../styles/CreateMoodPlaylistScreenStyles";
import Header from "../Components/Header";
import getRandomSongsByMood, { ISongPreview } from "../fetchAPI/getRandomSongsByMood";
import getAllMoods, { IMood } from "../fetchAPI/getAllMoods";
import { usePlayer } from "./PlayerContext";

export default function CreateMoodPlaylistScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { playTrack, miniPlayerRef } = usePlayer();
    
    const params = useLocalSearchParams();
    const moodNameParam = params.moodName as string; 
    
    const [isModEnabled, setIsModEnabled] = useState(false);
    const [songList, setSongList] = useState<ISongPreview[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentMoodInfo, setCurrentMoodInfo] = useState<IMood | null>(null);
    
    const displayMoodName = moodNameParam || "happy";
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        })
        ).start();
    }, [rotateAnim]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const fetchSongsByMood = async (mood: string) => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                console.log(`fetching songs for mood: ${mood}`);
                const responseData = await getRandomSongsByMood(token, mood);
                if (responseData && responseData.success) {
                    setSongList(responseData.data);
                } else {
                    console.log("Không lấy được dữ liệu nhạc mood.");
                }
            } else {
                console.log("Chưa đăng nhập hoặc không có token");
            }
        } catch (error) {
            console.error("Lỗi khi fetch songs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMoodInfo = async () => {
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                const allMoods = await getAllMoods(token);
                const foundMood = allMoods?.find(m => m.name.toLowerCase() === displayMoodName.toLowerCase());
                if (foundMood) {
                    setCurrentMoodInfo(foundMood);
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin mood:", error);
        }
    }

    useEffect(() => {
        const moodToFetch = moodNameParam || "happy";
        fetchSongsByMood(moodToFetch);
        fetchMoodInfo();
    }, [moodNameParam]);

    if (!fontsMontserratLoaded) return null;

    const handlePlaySong = async (songId: string) => {
        await playTrack(songId);
        if (miniPlayerRef.current) {
            miniPlayerRef.current.expand();
        }
    };

    const renderSong = ({ item }: { item: ISongPreview }) => (
        <TouchableOpacity 
            style={styles.songRow} 
            onPress={() => handlePlaySong(item.songId)}
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
                <Text style={styles.sectionTitle}>Created Mood Playlist</Text>

                <View style={styles.playlistNameView}>
                    <View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: currentMoodInfo?.colorCode || '#E0E0E0',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12
                    }}>
                        <Text style={{ fontSize: 24 }}>{currentMoodInfo?.icon || '🎵'}</Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <Text style={styles.ownerName}>{currentMoodInfo?.displayName || displayMoodName.toUpperCase()}</Text> 
                    </View>
                </View>
                
                <View style={styles.playlistHeaderRow}>
                    <View style={styles.playlistHeaderRowColumn1}>
                        <TouchableOpacity style={styles.iconCircle} onPress={() => fetchSongsByMood(displayMoodName)}>
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
                                            defaultTitle: `My ${displayMoodName.toUpperCase()} Mix`
                                        }
                                    });
                                } else {
                                    router.navigate('/CreatePlaylist');
                                }
                            }}
                        >
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

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{alignItems: "center", justifyContent: "center",}}>
                        <Text style={{fontSize:24, fontWeight:600}}>Playlist in progress</Text>
                        <Text style={{fontSize:24, fontWeight:600}}>please wait</Text>
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
                            No songs found for this mood.
                        </Text>
                    }
                />
            )}
        </View>
    );
}
