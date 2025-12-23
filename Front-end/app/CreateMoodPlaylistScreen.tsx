import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Platform,
    ActivityIndicator,
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

export default function CreateMoodPlaylistScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const params = useLocalSearchParams();
    const moodNameParam = params.moodName as string; 
    
    const [isModEnabled, setIsModEnabled] = useState(false);
    const [songList, setSongList] = useState<ISongPreview[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const displayMoodName = moodNameParam || "happy";

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const fetchSongsByMood = async (mood: string) => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                const data = await getRandomSongsByMood(token, mood);
                if (data && data.success) {
                    setSongList(data.songs);
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

    useEffect(() => {
        if (moodNameParam) {
            fetchSongsByMood(moodNameParam);
        } else {}
    }, [moodNameParam]);

    if (!fontsMontserratLoaded) return null;

    const renderSong = ({ item }: { item: ISongPreview }) => (
        <View style={styles.songRow}>
            <Image 
                source={item.image_url ? { uri: item.image_url } : require("../assets/images/song4.jpg")} 
                style={styles.songCover} 
            />
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
                        <Text style={styles.ownerName}>{displayMoodName}</Text>
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

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={{ color: 'white', marginTop: 10 }}>Creating playlist for {displayMoodName}...</Text>
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