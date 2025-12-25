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
    Modal,
    ActivityIndicator,
    Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';

import styles from "../styles/style";
import Header from "../Components/Header";
import Background from "../Components/MainBackground";

import createManualPlaylist from "../fetchAPI/createManualPlaylist";
import { refreshTokenUse } from "../fetchAPI/loginAPI";

export default function CreatePlaylist(){
    const [playlistName, setPlaylistName] = useState('');
    const [isModEnabled, setIsModEnabled] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleCreatePlaylist = async () => {
        if (!playlistName.trim()) return;

        setIsLoading(true);
        try {
            let token = await SecureStore.getItemAsync("accessToken");
            let isSuccess = false;
            if (token) {
                const result = await createManualPlaylist(token, playlistName);
                if (result) {
                    isSuccess = true;
                }
            }

            if (!isSuccess) {
                console.log("[CreatePlaylist] Token có thể hết hạn, đang thử refresh...");
                const newToken = await refreshTokenUse();
                
                if (newToken) {
                    const retryResult = await createManualPlaylist(newToken, playlistName);
                    if (retryResult) {
                        isSuccess = true;
                    }
                }
            }

            if (isSuccess) {
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
             <View style={{flex:1, paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
                         paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,}}>
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
                                style={[
                                styles.otpbutton,
                                { backgroundColor: playlistName ? 'white' : '#AAA', alignSelf: 'center' }
                                ]}
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
                                    
                                    {/* Nút Agree */}
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
                                    
                                    {/* Nút Not Agree */}
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