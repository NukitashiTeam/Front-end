import React, { useState, useEffect } from "react";
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
    Modal,
    ActivityIndicator,
    Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';

import styles from "../styles/style";
import Header from "../Components/Header";
import Background from "../Components/MainBackground";

import createManualPlaylist from "../fetchAPI/createManualPlaylist";
import saveRandomMoodPlaylist, { ISongInput } from "../fetchAPI/saveRandomMoodPlaylist";
import { refreshTokenUse } from "../fetchAPI/loginAPI";
import addSongToPlaylist from "../fetchAPI/addSongToPlaylist";

export default function CreatePlaylist(){
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const params = useLocalSearchParams();
    const { songsData, defaultTitle, initialSongId } = params;

    const [playlistName, setPlaylistName] = useState('');
    const [isModEnabled, setIsModEnabled] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (defaultTitle) {
            setPlaylistName(defaultTitle as string);
        }
    }, [defaultTitle]);

    const handleCreatePlaylist = async () => {
        if (!playlistName.trim()) return;

        setIsLoading(true);
        try {
            let songsToSave: ISongInput[] = [];
            if (songsData) {
                try {
                    songsToSave = JSON.parse(songsData as string);
                } catch (e) {
                    console.error("Lỗi parse songsData:", e);
                }
            }

            let token = await SecureStore.getItemAsync("accessToken");
            let isSuccess = false;
            let createdPlaylistId = ""; 

            if (token) {
                if (songsToSave.length > 0) {
                    const result = await saveRandomMoodPlaylist(token, playlistName, songsToSave);
                    if (result && result.success) {
                        isSuccess = true;
                    }
                } else {
                    const result = await createManualPlaylist(token, playlistName);
                    if (result) {
                        isSuccess = true;
                        createdPlaylistId = result._id || (result as any).data?._id;
                    }
                }
            }

            if (!isSuccess && songsToSave.length === 0) { 
                console.log("[CreatePlaylist] Đang thử refresh token cho manual playlist...");
                const newToken = await refreshTokenUse();
                if (newToken) {
                    const retryResult = await createManualPlaylist(newToken, playlistName);
                    if (retryResult) {
                        isSuccess = true;
                        createdPlaylistId = retryResult._id || (retryResult as any).data?._id;
                    }
                }
            }

            if (isSuccess) {
                if (initialSongId && createdPlaylistId) {
                    console.log(`Đang thêm bài hát ${initialSongId} vào playlist mới ${createdPlaylistId}...`);
                    const tokenForAdd = await SecureStore.getItemAsync("accessToken");
                    if (tokenForAdd) {
                        await addSongToPlaylist(tokenForAdd, createdPlaylistId, initialSongId as string);
                    }
                }

                setShowConfirm(false);
                setPlaylistName('');
                router.navigate('/MyMusic'); 
            } else {
                Alert.alert("Failed", "Could not create playlist. Please try again.");
            }
        } catch (error) {
            console.error("[CreatePlaylist] Error:", error);
            Alert.alert("Error", "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <Background>
             <View style={{
                flex:1, paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
                paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
            }}>
                <View style={styles.headerWrap}>
                    <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
                </View>
                
                <TouchableOpacity style={styles.backbutton} onPress={() => router.navigate('/MyMusic')}>
                    <Image source={require('../assets/images/material-symbols-light_arrow-back-ios.png')} style={{width: 24, height: 24, tintColor: '#FFFFFF'}} />
                </TouchableOpacity>
                
                <Text style={{...styles.signintitle,color: "white", textAlign: "center"}}>Name Your Playlist</Text>
                
                <TextInput
                    style={styles.playlistinput}
                    value={playlistName}
                    placeholder="Enter playlist name"
                    onChangeText={setPlaylistName}
                    placeholderTextColor={"white"}
                    editable={!isLoading}
                />
                
                <TouchableOpacity
                    style={[styles.otpbutton, {
                        backgroundColor: playlistName ? 'white' : '#AAA',
                        alignSelf: 'center'
                    }]}
                    disabled={!playlistName || isLoading}
                    onPress={() => setShowConfirm(true)}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>Create</Text>
                    )}
                </TouchableOpacity>

                <Modal
                    visible={showConfirm}
                    transparent
                    animationType="fade"
                    onRequestClose={() => {
                        if (!isLoading) setShowConfirm(false);
                    }}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.popup}>
                            <Image source={require('../assets/images/tabler_bell-filled.png')} style={{width: 50, height: 50}} />
                            
                            <Text style={styles.popupText}>Are you sure to create this new playlist?</Text>
                            
                            <TouchableOpacity
                                style={[styles.popupButton, { opacity: isLoading ? 0.7 : 1 }]}
                                onPress={handleCreatePlaylist}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 20 }} />
                                ) : (
                                    <Text style={{...styles.popupButtonText, marginBottom:20}}>Agree</Text>
                                )}
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.popupButton}
                                onPress={() => setShowConfirm(false)}
                                disabled={isLoading}
                            >
                                <Text style={{...styles.popupButtonText, marginBottom:5}}>Not Agree</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </Background>
    )
}