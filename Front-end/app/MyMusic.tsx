import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  Platform,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "../styles/style";
import Header from "../Components/Header";
import Background from "../Components/MainBackground";

import getAllPlaylist, { IPlaylist } from "../fetchAPI/getAllPlaylist";
import { refreshTokenUse } from "../fetchAPI/loginAPI";

const CACHE_KEY_HISTORY = 'CACHE_PLAYLIST_HISTORY_IDS'; 

export default function MyMusic() {
  const [isModEnabled, setIsModEnabled] = useState(false);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      let token = await SecureStore.getItemAsync("accessToken");
      let needRefreshLogin = false;
      if (!token) {
        needRefreshLogin = true;
      }

      if (!needRefreshLogin && token) {
        const data = await getAllPlaylist(token);
        if (data) {
          if (Array.isArray(data)) {
            setPlaylists(data);
          }
        } else {
          console.log("[MyMusic] Token cũ có thể đã hết hạn, đang thử làm mới...");
          needRefreshLogin = true;
        }
      }

      if (needRefreshLogin) {
        const newToken = await refreshTokenUse();
        if (newToken) {
          token = newToken;
          const dataRetry = await getAllPlaylist(newToken);
          if (dataRetry && Array.isArray(dataRetry)) {
            setPlaylists(dataRetry);
          }
        } else {
            console.log("[MyMusic] Không thể refresh token.");
        }
      }
    } catch (error) {
      console.error("[MyMusic] Lỗi fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handlePressPlaylist = async (item: IPlaylist) => {
    try {
      const historyJson = await AsyncStorage.getItem(CACHE_KEY_HISTORY);
      let historyIds: string[] = historyJson ? JSON.parse(historyJson) : [];
      historyIds = historyIds.filter(id => id !== item._id);
      historyIds.unshift(item._id);
      if (historyIds.length > 10) historyIds.pop();
      await AsyncStorage.setItem(CACHE_KEY_HISTORY, JSON.stringify(historyIds));
      console.log("Saved history from MyMusic:", item.title);
    } catch (e) {
      console.error("Failed to save history", e);
    }
    
    let imageSource = require("../assets/images/song4.jpg");
    if (item.songs && item.songs.length > 0 && item.songs[0].image_url) {
        imageSource = { uri: item.songs[0].image_url };
    }

    router.navigate({
      pathname: "/PlaylistSong",
      params: { 
        id: item._id,
        title: item.title, 
        pic: (imageSource?.uri) ? imageSource.uri : ""
      },
    });
  };

  const renderItem = ({ item }: { item: IPlaylist }) => {
    let imageSource = require("../assets/images/song4.jpg");
    if (item.songs && item.songs.length > 0 && item.songs[0].image_url) {
        imageSource = { uri: item.songs[0].image_url };
    }

    return (
      <TouchableOpacity
        style={styles.playlistItem}
        onPress={() => handlePressPlaylist(item)}
      >
        <Image source={imageSource} style={styles.playlistImage} />
        <Text style={styles.playlistTitle} numberOfLines={1}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Background>
      <View
        style={{
          flex: 1,
          paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
          paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
        }}
      >
        <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
        
        {/* Header */}
        <View style={styles.headerWrap}>
          <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
        </View>

        {/* Title */}
        <Text style={{ ...styles.signintitle, textAlign: "center" }}>My Music</Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Image
            source={require("../assets/images/Search.png")}
            style={{ width: 20, height: 20, marginRight: 8 }}
          />
          <TextInput
            style={{ ...styles.searchInput, height: 40 }}
            placeholder="Playlist's Name"
            placeholderTextColor="#888"
          />
          <Image
            source={require("../assets/images/Voice.png")}
            style={{ width: 20, height: 20, marginLeft: 8 }}
          />
        </View>

        {/* Danh sách playlist */}
        <View style={{ flex: 1, position: "relative" }}>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
          ) : (
            <FlatList
                data={playlists}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{
                paddingBottom: 180,
                }}
                ListEmptyComponent={
                    <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                        No playlists found. Create one!
                    </Text>
                }
            />
          )}

          {/* Gradient mờ dần ở dưới */}
          <LinearGradient
            colors={["transparent", "#3b2a89"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              pointerEvents: 'none'
            }}
          />
        </View>

        {/* Nút dấu cộng luôn hiện ở dưới cùng */}
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 60 + (insets.bottom || 0),
            alignSelf: "center",
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={() => router.navigate("/CreatePlaylist")}
        >
          <Image
            source={require("../assets/images/pepicons-pop_plus-circle-filled.png")}
            style={{ width: 60, height: 60, tintColor: '#FFFFFF' }}
          />
        </TouchableOpacity>
      </View>
    </Background>
  );
}