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
    TextInput,
    TouchableOpacity,
    Modal
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../styles/style";
import Header from "../Components/Header";
import { useRouter, useLocalSearchParams } from "expo-router";
import Background from "../Components/MainBackground";
type Song = {
id: string;
title: string;
artist: string;
pic: any;
};
export default function PlaylistSong(){
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();
    const artistTitle = params.title as string || "Unknown Artist";
    const artistPic = params.pic as any;
    const songs: Song[] = [
        { id: '1', title: 'Name of the song', artist: 'Artist Name', pic: require('../assets/images/lonelySong.jpg') },
        { id: '2', title: 'Name of the song', artist: 'Artist Name', pic: require('../assets/images/sadSong.jpg') },
        { id: '3', title: 'Name of the song', artist: 'Artist Name', pic: require('../assets/images/song.png') },
        { id: '4', title: 'Name of the song', artist: 'Artist Name', pic: require('../assets/images/song4.jpg') },
        { id: '5', title: 'Name of the song', artist: 'Artist Name', pic: require('../assets/images/song5.jpg') },
        { id: '6', title: 'Name of the song', artist: 'Artist Name', pic: require('../assets/images/song6.jpg') },
        { id: '7', title: 'Name of the song', artist: 'Artist Name', pic: require('../assets/images/song7.jpg') },
        ];
    const renderSongItem = ({ item }: { item: Song }) => (
        <View style={styles.songItem}>
            <Image source={item.pic} style={styles.songImage} />
            <View >
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.songArtist}>{item.artist}</Text>
            </View>
        </View>
    );
    const handleVectorPress = () => {
        console.log('Vector icon pressed');
    };

    const handleAddPress = () => {
        console.log('Add icon pressed');
    };

    const handlePlayPress = () => {
        console.log('Play icon pressed');
    };
    return(
        <Background>
                <View style={{flex:1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,}}>
                    <View style={styles.headerWrap}>
                        <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
                    </View>
                    <TouchableOpacity style={styles.backbutton} onPress={() => router.navigate('/MyMusic')}>
                        <Image source={require('../assets/images/material-symbols-light_arrow-back-ios.png')} style={{width: 24, height: 24, tintColor: '#FFFFFF'}} />
                    </TouchableOpacity>
                    <View style={styles.artistHeader}>
                    <Image source={artistPic} style={styles.artistImage} />
                    <Text style={styles.artistName}>{artistTitle}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10,gap:100}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap:20}}>
                            <TouchableOpacity onPress={handleVectorPress}>
                                <Image source={require('../assets/images/Vector (1).png')} style={{ width: 24, height: 24, tintColor: '#FFFFFF' }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddPress}>
                                <Image source={require('../assets/images/add.png')} style={{ width: 24, height: 24, tintColor: '#FFFFFF' }} />
                            </TouchableOpacity>
                        </View>

                            <TouchableOpacity onPress={handlePlayPress}>
                                <Image source={require('../assets/images/carbon_play-filled.png')} style={{ width: 50, height: 50, tintColor: '#FFFFFF' }} />
                            </TouchableOpacity>
                    </View>
                    <FlatList
                        data={songs}
                        renderItem={renderSongItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingVertical: 5 , marginBottom:"5%"}}
                    />
                </View>
        </Background>
    );
}