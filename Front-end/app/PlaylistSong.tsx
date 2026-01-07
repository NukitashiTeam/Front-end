import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    StatusBar,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import styles from "../styles/style";
import Header from "../Components/Header";
import Background from "../Components/MainBackground";
import getPlaylistDetail, { IPlaylistDetail, ISong } from "../fetchAPI/getPlaylistDetail";
import { IMusicDetail } from "../fetchAPI/getMusicById";
import deletePlaylist from "../fetchAPI/deletePlaylist";
import removeSongFromPlaylist from "../fetchAPI/removeSongFromPlaylist";
import * as SecureStore from 'expo-secure-store';
import { usePlayer } from "./PlayerContext";
import { addToHistory } from "@/app/src/historyHelper";

export default function PlaylistSong() {
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { playTrack, playList, miniPlayerRef } = usePlayer();
    const params = useLocalSearchParams();
    const playlistId = params.id as string;
    const playlistTitle = params.title as string || "Unknown Playlist";
    const playlistPic = params.pic ? { uri: params.pic as string } : require('../assets/images/MoodyBlue.png');

    const [playlistData, setPlaylistData] = useState<IPlaylistDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await SecureStore.getItemAsync("accessToken");
                if (token && playlistId) {
                    const data = await getPlaylistDetail(token, playlistId);
                    if (data) {
                        setPlaylistData(data);
                    }
                } else {
                    console.log("Thiếu Token hoặc Playlist ID");
                }
            } catch (error) {
                console.error("Lỗi fetch playlist detail:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [playlistId]);

    const convertToPlayerQueue = (songs: ISong[]): IMusicDetail[] => {
        return songs.map(song => ({
            _id: song.songId,
            track_id: song.songId,
            title: song.title,
            artist: song.artist,
            image_url: song.image_url || "",
            mp3_url: (song as any).mp3_url || (song as any).url || "", 
            release_date: "",
            album: "",
            genre: "",
            mood: ""
        }));
    };

    const handlePlaySong = async (item: ISong) => {
        if (!playlistData?.songs) return;

        if (miniPlayerRef.current) {
            miniPlayerRef.current.expand();
        }

        addToHistory(item).catch(err => console.error("History Error:", err));
        const fullQueue = convertToPlayerQueue(playlistData.songs);
        const selectedIndex = playlistData.songs.findIndex(s => s.songId === item.songId);
        if (selectedIndex !== -1) {
            console.log(`Playing playlist from index ${selectedIndex}: ${item.title}`);
            await playList(fullQueue, selectedIndex);
        } else {
            await playTrack(item.songId);
        }
    };

    const handleRemoveSong = (songId: string) => {
        Alert.alert(
            "Xóa bài hát",
            "Bạn có chắc chắn muốn xóa bài hát này khỏi playlist?", [{
                text: "Hủy",
                style: "cancel"
            }, {
                text: "Xóa", 
                style: "destructive", 
                onPress: async () => {
                    setIsLoading(true);
                    const token = await SecureStore.getItemAsync("accessToken");
                    if (token && playlistId) {
                        const updatedPlaylist = await removeSongFromPlaylist(token, playlistId, songId);
                        if (updatedPlaylist) {
                            setPlaylistData(updatedPlaylist); 
                            Alert.alert("Thành công", "Đã xóa bài hát khỏi playlist.");
                        } else {
                            Alert.alert("Lỗi", "Không thể xóa bài hát. Có thể bạn không phải chủ sở hữu.");
                        }
                    } else {
                        Alert.alert("Lỗi", "Phiên đăng nhập không hợp lệ.");
                    }
                    setIsLoading(false);
                }
            }]
        );
    };

    const renderSongItem = ({ item }: { item: ISong }) => (
        <TouchableOpacity 
            style={[styles.songItem, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => handlePlaySong(item)}
        >
            <Image 
                source={(item.image_url && item.image_url !== "") ? { uri: item.image_url } : require('../assets/images/song5.jpg')}
                style={styles.songImage} 
            />
            
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text numberOfLines={1} style={styles.songTitle}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.songArtist}>{item.artist}</Text>
            </View>

            <TouchableOpacity 
                onPress={() => handleRemoveSong(item.songId)}
                style={{ padding: 10 }}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const shuffleArray = (array: ISong[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleShufflePress = async () => {
        if (playlistData?.songs && playlistData.songs.length > 0) {
            const shuffledSongs = shuffleArray(playlistData.songs);
            setPlaylistData(prev => prev ? { ...prev, songs: shuffledSongs } : null);
            if (miniPlayerRef.current) miniPlayerRef.current.expand();
            const fullQueue = convertToPlayerQueue(shuffledSongs);
            await playList(fullQueue, 0);
            console.log("Playlist shuffled and playing first song:", shuffledSongs[0].title);
        } else {
            Alert.alert("Thông báo", "Playlist này chưa có bài hát nào để trộn.");
        }
    };

    const handleDeletePress = async () => {
        Alert.alert(
            "Xóa Playlist",
            "Bạn có chắc chắn muốn xóa vĩnh viễn playlist này không?",
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Xóa", 
                    style: "destructive", 
                    onPress: async () => {
                        setIsLoading(true);
                        const token = await SecureStore.getItemAsync("accessToken");
                        if (token && playlistId) {
                            const success = await deletePlaylist(token, playlistId);
                            if (success) {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace("/MyMusic");
                                }
                            } else {
                                alert("Xóa thất bại. Có thể bạn không phải chủ sở hữu.");
                            }
                        }
                        setIsLoading(false);
                    }
                }
            ]
        );
    };

    const handlePlayPress = async () => {
        if (playlistData?.songs && playlistData.songs.length > 0) {
            if (miniPlayerRef.current) miniPlayerRef.current.expand();
            const fullQueue = convertToPlayerQueue(playlistData.songs);
            await playList(fullQueue, 0);
        } else {
            Alert.alert("Thông báo", "Playlist này chưa có bài hát nào.");
        }
    };

    return (
        <Background>
            <View style={{
                        flex: 1,
                        paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
                        paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
                      }}>
                <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

                <View style={styles.headerWrap}>
                    <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
                </View>

                <TouchableOpacity style={styles.backbutton} onPress={() => {
                    if (router.canGoBack()) router.back();
                    else router.replace("/MyMusic");
                }}>
                    <Image source={require('../assets/images/material-symbols-light_arrow-back-ios.png')} style={{width: 24, height: 24, tintColor: '#FFFFFF'}} />
                </TouchableOpacity>

                <View style={styles.artistHeader}>
                    <Image source={playlistPic} style={styles.artistImage} />
                    <Text style={styles.artistName}>{playlistTitle}</Text>
                    {playlistData?.mood && (
                        <Text style={{color: '#ddd', fontSize: 14, marginTop: 5}}>
                            Mood: {playlistData.mood}
                        </Text>
                    )}
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10, justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
                        <TouchableOpacity onPress={handleShufflePress}>
                            <Ionicons name="shuffle" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeletePress}>
                            <Ionicons name="close" size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handlePlayPress}>
                        <Image source={require('../assets/images/carbon_play-filled.png')} style={{ width: 50, height: 50, tintColor: '#FFFFFF' }} />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={{color: 'white', marginTop: 10}}>Loading songs...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={playlistData?.songs || []}
                        renderItem={renderSongItem}
                        keyExtractor={(item) => item.songId}
                        contentContainerStyle={{ paddingTop: 5, marginBottom: "5%", paddingHorizontal: 20, paddingBottom: "30%" }}
                        ListEmptyComponent={
                            <Text style={{color: 'white', textAlign: 'center', marginTop: 20}}>
                                No songs in this playlist
                            </Text>
                        }
                    />
                )}
            </View>
        </Background>
    );
}