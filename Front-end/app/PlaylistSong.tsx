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
import deletePlaylist from "../fetchAPI/deletePlaylist";
import removeSongFromPlaylist from "../fetchAPI/removeSongFromPlaylist";
import * as SecureStore from 'expo-secure-store';
import { usePlayer } from "./PlayerContext";

export default function PlaylistSong() {
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { playTrack, miniPlayerRef } = usePlayer();
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

    const handlePlaySong = async (songId: string) => {
        await playTrack(songId);
        console.log(`Playing Song ID: ${songId}`);
        if (miniPlayerRef.current) {
            miniPlayerRef.current.expand();
        }
    };

    const handleRemoveSong = (songId: string) => {
        Alert.alert(
            "Xóa bài hát",
            "Bạn có chắc chắn muốn xóa bài hát này khỏi playlist?",
            [
                { text: "Hủy", style: "cancel" },
                { 
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
                }
            ]
        );
    };

    const renderSongItem = ({ item }: { item: ISong }) => (
        <TouchableOpacity 
            style={[styles.songItem, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => handlePlaySong(item.songId)}
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

    const handleVectorPress = () => console.log('Vector icon pressed');
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

    const handlePlayPress = () => {
        if (playlistData?.songs && playlistData.songs.length > 0) {
            handlePlaySong(playlistData.songs[0].songId);
        } else {
            Alert.alert("Thông báo", "Playlist này chưa có bài hát nào.");
        }
    };

    return (
        <Background>
            <View style={{
                flex: 1, 
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, 
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
                        <TouchableOpacity onPress={handleVectorPress}>
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