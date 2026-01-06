import React, { useState, useCallback, useEffect } from "react";
import {
	View,
	Text,
	Image,
	FlatList,
	StatusBar,
	Platform,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import styles from "../styles/style";
import localStyles from "@/styles/AddMusicToPlaylistStyles";
import Header from "../Components/Header";
import Background from "../Components/MainBackground";
import getAllPlaylist, { IPlaylist } from "../fetchAPI/getAllPlaylist";
import { refreshTokenUse } from "../fetchAPI/loginAPI";
import getMusicById, { IMusicDetail } from "../fetchAPI/getMusicById";
import addSongToPlaylist from "../fetchAPI/addSongToPlaylist";

export default function AddMusicToPlaylistScreen() {
	const [isModEnabled, setIsModEnabled] = useState(false);
	const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	
	const [selectedSong, setSelectedSong] = useState<IMusicDetail | null>(null);
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { songId } = useLocalSearchParams();

	useEffect(() => {
		const fetchSongDetails = async () => {
			if (songId) {
				try {
					const token = await SecureStore.getItemAsync("accessToken");
					if (token) {
						const songData = await getMusicById(songId as string, token);
						if (songData) {
							setSelectedSong(songData);
						}
					}
				} catch (error) {
					console.error("Lỗi lấy thông tin bài hát:", error);
				}
			}
		};
		fetchSongDetails();
	}, [songId]);

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			let token = await SecureStore.getItemAsync("accessToken");
			let needRefreshLogin = false;
			if (!token) needRefreshLogin = true;

			if (!needRefreshLogin && token) {
				const data = await getAllPlaylist(token);
				if (data && Array.isArray(data)) {
					setPlaylists(data);
				} else {
					needRefreshLogin = true;
				}
			}

			if (needRefreshLogin) {
				const newToken = await refreshTokenUse();
				if (newToken) {
					const dataRetry = await getAllPlaylist(newToken);
					if (dataRetry && Array.isArray(dataRetry)) {
						setPlaylists(dataRetry);
					}
				}
			}
		} catch (error) {
			console.error("Lỗi fetch playlist:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [loadData])
	);

	const handleAddToPlaylist = async (playlist: IPlaylist) => {
		if (!songId) {
			Alert.alert("Lỗi", "Không tìm thấy thông tin bài hát để thêm.");
			return;
		}

		try {
			const token = await SecureStore.getItemAsync("accessToken");
			if (!token) {
				Alert.alert("Lỗi", "Bạn cần đăng nhập lại.");
				return;
			}

			const result = await addSongToPlaylist(token, playlist._id, songId as string);
			if (result) {
				Alert.alert(
					"Thành công",
					`Đã thêm bài hát vào playlist "${playlist.title}"`, [{
						text: "OK", 
						onPress: () => {
							router.back(); 
						}
					}]
				);
			} else {
				Alert.alert("Thất bại", "Không thể thêm bài hát vào playlist này. Có thể bài hát đã tồn tại.");
			}
		} catch (error) {
			console.error("Lỗi khi thêm bài hát:", error);
			Alert.alert("Lỗi", "Đã xảy ra lỗi hệ thống.");
		}
	};

	const renderItem = ({ item }: { item: IPlaylist }) => {
		let imageSource = require("../assets/images/song4.jpg");
		if (item.songs && item.songs.length > 0 && item.songs[0].image_url) {
			imageSource = { uri: item.songs[0].image_url };
		}

		return (
			<TouchableOpacity
				style={styles.playlistItem}
				onPress={() => handleAddToPlaylist(item)}
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
				
				<View style={styles.headerWrap}>
					<Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
				</View>

				<Text style={{ ...styles.signintitle, textAlign: "center", marginBottom: 10 }}>
					Choose your playlist to Add
				</Text>

				{selectedSong && (
					<View style={localStyles.songCard}>
						<Image 
							source={selectedSong.image_url ? { uri: selectedSong.image_url } : require("../assets/images/song5.jpg")} 
							style={localStyles.songImage} 
						/>
						<View style={localStyles.songInfo}>
							<Text style={localStyles.songTitle} numberOfLines={1}>
								{selectedSong.title}
							</Text>
							<Text style={localStyles.songArtist} numberOfLines={1}>
								{selectedSong.artist}
							</Text>
						</View>
					</View>
				)}

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
							contentContainerStyle={{ paddingBottom: 180 }}
							ListEmptyComponent={
								<Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
									No playlists found. Create one!
								</Text>
							}
						/>
					)}

					<LinearGradient
						colors={["transparent", "#3b2a89"]}
						style={{
							position: "absolute", bottom: 0, left: 0, right: 0, height: 100, pointerEvents: 'none'
						}}
					/>
				</View>

				<TouchableOpacity
					style={{
						position: "absolute",
						bottom: 60 + (insets.bottom || 0),
						alignSelf: "center",
						width: 60, height: 60, borderRadius: 30,
						justifyContent: "center", alignItems: "center",
						shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
					}}
					onPress={() => {
						router.push({
							pathname: "/CreatePlaylist",
							params: { initialSongId: songId }
						});
					}}
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