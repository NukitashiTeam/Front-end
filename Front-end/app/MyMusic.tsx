import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import styles from "../styles/style";
import Header from "../Components/Header";
import Background from "../Components/MainBackground";

type Playlist = {
  id: string;
  title: string;
  pic: any;
};

export default function MyMusic() {
  const [isModEnabled, setIsModEnabled] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const playlists: Playlist[] = [
    { id: "1", title: "Kenshi Yonezu", pic: require("../assets/images/artNowPlayingMusic.jpg") },
    { id: "2", title: "Inazuma", pic: require("../assets/images/song6.jpg") },
    { id: "3", title: "Prois Prois", pic: require("../assets/images/allegoryOfTheCaveSong.jpg") },
    { id: "4", title: "Sad Song", pic: require("../assets/images/weebooSong.jpg") },
    { id: "5", title: "Livue", pic: require("../assets/images/song7.jpg") },
    { id: "6", title: "Gav Song", pic: require("../assets/images/song5.jpg") },
  ];

  const renderItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() =>
        router.navigate({
          pathname: "/PlaylistSong",
          params: { title: item.title, pic: item.pic },
        })
      }
    >
      <Image source={item.pic} style={styles.playlistImage} />
      <Text style={styles.playlistTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <Background>
      <View
        style={{
          flex: 1,
          paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
          paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,
        }}
      >
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

        {/* Danh sách playlist + hiệu ứng mờ dần */}
        <View style={{ flex: 1, position: "relative" }}>
          <FlatList
            data={playlists}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{
              paddingBottom: 180, // Đủ chỗ cho nút + và gradient
            }}
          />

          {/* Gradient mờ dần ở dưới */}
          <LinearGradient
            colors={["transparent", "#3b2a89"]} // Bạn có thể đổi màu nền nếu muốn
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 300,
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
          }}
          onPress={() => router.navigate("/CreatePlaylist")}
        >
          <Image
            source={require("../assets/images/pepicons-pop_plus-circle-filled.png")}
            style={{ width: 40, height: 40, tintColor: '#FFFFFF' }}
          />
        </TouchableOpacity>
      </View>
    </Background>
  );
}