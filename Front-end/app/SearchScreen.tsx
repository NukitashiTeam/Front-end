import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    StatusBar,
    Platform,
    Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../styles/SearchScreenStyles";
import Header from "../Components/Header";
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";

type Song = {
    id: string;
    cover: any;
    title: string;
    artist: string;
};

type SuggestionsMoodItem = {
    moodName: string;
    imgPath: any;
};

export default function SearchScreen() {
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

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

    const suggestionsMoodPlaylist: SuggestionsMoodItem[] = [
        {
            moodName: "Chill",
            imgPath: require("../assets/images/avatar.png")
        },
        {
            moodName: "Travel",
            imgPath: require("../assets/images/avatar2.png")
        },
        {
            moodName: "Exhausted",
            imgPath: require("../assets/images/avatar3.png")
        },
        {
            moodName: "Educational",
            imgPath: require("../assets/images/avatar4.png")
        },
        {
            moodName: "Deadline",
            imgPath: require("../assets/images/avatar5.png")
        },
    ];

    const renderSong = ({ item }: { item: Song }) => (
        <View style={styles.songRow}>
            <Image source={item.cover} style={styles.songCover} />
            <View style={styles.songMeta}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
            </View>
        </View>
    );

    const renderSuggestionMoodItem = (({ item }: {item: SuggestionsMoodItem}) => (
        <View style={styles.quickStartTopRow}>
            <View style={styles.quickStartLeftDown}>
                <View style={styles.moodAvatarCircle}>
                    <Image source={item.imgPath} style={styles.moodAvatarImg} />
                </View>
                <Text style={styles.moodNameText}>{item.moodName}</Text>
            </View>
        </View>
    ));

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
            
            <View style={styles.headerBlock}>
                <View style={styles.suggestionsMoodPlaylistTextBlock}>
                    <Text style={styles.sectionTitle}>Suggestions Mood Playlist</Text>
                    <Text style={styles.showMoreText}>Show more</Text>
                </View>

                <View style={styles.quickStartWrapper}>
                    <Pressable
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
                            <FlatList 
                                data={suggestionsMoodPlaylist}
                                keyExtractor={(it) => it.moodName}
                                renderItem={renderSuggestionMoodItem}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.suggestionsMoodPlaylistFlatList}
                            />
                        </LinearGradient>
                    </Pressable>
                </View>

                <Text style={styles.ownerName}>Recent Playlist&apos;s Song</Text>
            </View>

            <FlatList
                data={data}
                keyExtractor={(it) => it.id}
                renderItem={renderSong}
                contentContainerStyle={{ paddingBottom: 96 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
   
}
