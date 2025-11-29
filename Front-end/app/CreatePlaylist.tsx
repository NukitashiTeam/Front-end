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
import { useRouter } from "expo-router";
import Background from "../Components/MainBackground";
export default function CreatePlaylist(){
    const [playlistName, setPlaylistName] = useState('');
    const [isModEnabled, setIsModEnabled] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    return(
        <Background>
             <View style={{flex:1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,}}>
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
                            />
                            <TouchableOpacity
                                style={[
                                styles.otpbutton,
                                { backgroundColor: playlistName ? 'white' : '#AAA', alignSelf: 'center' }
                                ]}
                                disabled={!playlistName}
                                onPress={() => setShowConfirm(true)}
                            >
                                <Text style={styles.buttonText}>Create</Text>
                            </TouchableOpacity>
                            <Modal
                                visible={showConfirm}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setShowConfirm(false)}
                            >
                                <View style={styles.modalBackground}>
                                <View style={styles.popup}>
                                    <Image source={require('../assets/images/tabler_bell-filled.png')} style={{width: 50, height: 50}} />
                                    <Text style={styles.popupText}>Are you sure to create this new playlist?</Text>
                                    <TouchableOpacity
                                    style={styles.popupButton}
                                    onPress={() => {
                                        setShowConfirm(false);
                                        // Xử lý tạo playlist ở đây
                                    }}
                                    >
                                    <Text style={{...styles.popupButtonText, marginBottom:20}}>Agree</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                    style={styles.popupButton}
                                    onPress={() => setShowConfirm(false)}
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