import React, { useState,  } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../styles/style";
import Header from "../Components/Header";
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import Background from "../Components/MainBackground";
import { useRouter } from "expo-router";

type Song = {
    id: string;
    title: string;
    pic: any
};

export default function MyMusic(){
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();
    const playlists = [
        { id: '1', title: 'Kenshi Yonezu', pic: require('../assets/images/artNowPlayingMusic.jpg') },
        { id: '2', title: 'Inazuma', pic: require('../assets/images/song6.jpg') },
        { id: '3', title: 'Prois Prois', pic: require('../assets/images/allegoryOfTheCaveSong.jpg') },
        { id: '4', title: 'Sad Song', pic: require('../assets/images/weebooSong.jpg') },
        { id: '5', title: 'Livue', pic: require('../assets/images/song7.jpg') },
        { id: '6', title: 'Gav Song', pic: require('../assets/images/song5.jpg') },
    ]
    const router = useRouter();
        const renderItem = ({ item }: { item: Song }) => (
            <TouchableOpacity style={styles.playlistItem} onPress={()=>router.navigate({
                pathname: '/PlaylistSong',
                params: { title: item.title, pic: item.pic }})}>
            <Image source={item.pic} style={styles.playlistImage} />
            <Text style={styles.playlistTitle}>{item.title}</Text>
            </TouchableOpacity>
        );
    return(
        <Background>
            <View style={{flex:1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,}}>
                <View style={styles.headerWrap}>
                <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
                </View>
                <Text style={{...styles.signintitle, textAlign: "center"}}>My Music</Text>
                <View style={styles.searchContainer}>
                {/* <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} /> */}
                <Image source={require('../assets/images/Search.png')} style={{width: 20, height: 20, borderColor: 'rgba(0, 0, 0, 0.40)', marginRight: 8}} />
                <TextInput
                style={styles.searchInput}
                placeholder="Playlist's Name"
                placeholderTextColor="#888"
                />
                {/* <Ionicons name="mic" size={20} color="#888" style={styles.micIcon} /> */}
                <Image source={require('../assets/images/Voice.png')} style={{width: 20, height: 20, borderColor: 'rgba(0, 0, 0, 0.40)', marginLeft: 8}} />
                </View>
                <FlatList
                    data={playlists}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={{...styles.listContent, paddingBottom: 80 + (insets.bottom || 0)}}
                />
                <TouchableOpacity style={{...styles.addButton, bottom: 55 + (insets.bottom || 5)}} onPress={()=> router.navigate('/CreatePlaylist')}>
                    <Image source={require('../assets/images/pepicons-pop_plus-circle-filled.png')} style={{width: 40, height: 40,}} />
                </TouchableOpacity>
            </View>
            
            
        </Background>
    )
}