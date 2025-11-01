import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles/CreateMoodPlaylistScreen";
import Header from "./components/Header";
import BottomBar from "./components/BottomBar";

const WIDTH = Dimensions.get("window");

type Song = {
    id: string;
    cover: string;
    title: string;
    artist: string;
};

export default function CreateMoodPlaylistScreen() {
    const router = useRouter();
    const pathname = usePathname();
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();
    
    const data = useMemo<Song[]>(() =>
        Array.from({ length: 16 }).map((_, i) => ({
            id: `song-${i + 1}`,
            cover:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=256&q=80&auto=format&fit=crop",
            title: "Name of the song",
            artist: "Artist Name",
        })), []
    );

    const goLink = (k: "home" | "search" | "radio" | "music") => {
        if (k === "home") router.push("/");
        if (k === "radio") router.push("/NowPlayingScreen");
    };

    const renderSong = ({ item }: { item: Song }) => (
        <View style={styles.songRow}>
            <Image source={{ uri: item.cover }} style={styles.songCover} />
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
                <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerBlock}>
                <Text style={styles.sectionTitle}>Created Mood Playlist</Text>
                
                <View style={styles.playlistHeaderRow}>
                    <Image
                        source={require("../assets/images/avatar.png")}
                        style={styles.ownerAvatar}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.ownerName}>Chill</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.iconCircle}>
                        <Ionicons name="shuffle-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.iconCircle, { marginLeft: 10 }]}>
                        <Ionicons name="add-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.playCircle}>
                        <Ionicons name="play" size={22} color="#4A2F7C" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={data}
                keyExtractor={(it) => it.id}
                renderItem={renderSong}
                contentContainerStyle={{ paddingBottom: 96 }}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.bottomWrap}>
                <BottomBar
                    active="home"
                    onPress={(k) => {
                        console.log("press:", k);
                        goLink(k);
                    }}
                />
            </View>
        </View>
    );
}