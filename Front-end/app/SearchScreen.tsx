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
    Dimensions,
} from "react-native";
import Animated, { 
    useAnimatedScrollHandler, 
    useSharedValue, 
    useAnimatedStyle, 
    interpolate, 
    Extrapolation,
    SharedValue 
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../styles/SearchScreenStyles";
import Header from "../Components/Header";
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTEXT_ITEM_WIDTH = SCREEN_WIDTH * 0.3;
const CONTEXT_ITEM_SIZE = CONTEXT_ITEM_WIDTH;
const SPACER = (SCREEN_WIDTH - CONTEXT_ITEM_SIZE) / 2;

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

type ContextItem = {
    id: string;
    title: string;
    bgColor: string;
    imgPath: any;
};

export default function SearchScreen() {
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });
    
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
        { moodName: "Chill", imgPath: require("../assets/images/avatar.png") },
        { moodName: "Travel", imgPath: require("../assets/images/avatar2.png") },
        { moodName: "Exhausted", imgPath: require("../assets/images/avatar3.png") },
        { moodName: "Educational", imgPath: require("../assets/images/avatar4.png") },
        { moodName: "Deadline", imgPath: require("../assets/images/avatar5.png") },
    ];

    const contextData: ContextItem[] = [
        { id: '1', title: 'Studying', bgColor: '#F0E5C3', imgPath: require("../assets/images/book.png")},
        { id: '2', title: 'Studying', bgColor: '#FBA7C0', imgPath: require("../assets/images/book.png")}, 
        { id: '3', title: 'Studying', bgColor: '#72A8FF', imgPath: require("../assets/images/book.png")}, 
        { id: '4', title: 'Studying', bgColor: '#FACA9A', imgPath: require("../assets/images/book.png")}, 
        { id: '5', title: 'Studying', bgColor: '#8CFAC5', imgPath: require("../assets/images/book.png")}, 
    ];

    const infiniteContextData = React.useMemo(() => {
        let data: any[] = [];
        for (let i = 0; i < 100; i++) {
            data = [...data, ...contextData];
        }
        return data.map((item, index) => ({ ...item, uniqueKey: `${item.id}_${index}` }));
    }, []);

    const renderSong = ({ item }: { item: Song }) => (
        <View style={styles.songRow}>
            <Image source={item.cover} style={styles.songCover} />
            <View style={styles.songMeta}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
            </View>
        </View>
    );

    const renderSuggestionMoodItem = ({ item }: {item: SuggestionsMoodItem}) => (
        <View style={styles.quickStartTopRow}>
            <View style={styles.quickStartLeftDown}>
                <View style={styles.moodAvatarCircle}>
                    <Image source={item.imgPath} style={styles.moodAvatarImg} />
                </View>
                <Text style={styles.moodNameText}>{item.moodName}</Text>
            </View>
        </View>
    );

    const AnimatedContextItem = ({ item, index, scrollX }: {
        item: ContextItem,
        index: number,
        scrollX: SharedValue<number>
    }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 2) * CONTEXT_ITEM_SIZE,
                (index - 1) * CONTEXT_ITEM_SIZE,
                index * CONTEXT_ITEM_SIZE,
                (index + 1) * CONTEXT_ITEM_SIZE,
                (index + 2) * CONTEXT_ITEM_SIZE,
            ];
            
            const scale = interpolate(
                scrollX.value,
                inputRange,
                [0.9, 0.95, 1.1, 0.95, 0.9],
                Extrapolation.CLAMP
            );
            
            const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.3, 0.6, 1, 0.6, 0.3], 
                Extrapolation.CLAMP
            );

            return {
                transform: [{ scale }],
                opacity: opacity,
                zIndex: index === Math.round(scrollX.value / CONTEXT_ITEM_SIZE) ? 10 : 1,
            };
        });

        return (
            <Animated.View style={[{
                width: CONTEXT_ITEM_WIDTH,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 10, 
            }, animatedStyle ]}>
                <View style={[styles.contextCard, { 
                    backgroundColor: item.bgColor,
                    width: "100%",
                    aspectRatio: 1, 
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 6,
                }]}>
                    <Image source={item.imgPath} style={styles.contextImage} />
                    <Text style={[styles.contextTitle]}>{item.title}</Text>
                </View>
            </Animated.View>
        );
    };

    const scrollX = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
    });

    if(!fontsMontserratLoaded) {
        return null;
    }

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

                <Text style={styles.sectionTitle}>Context Playlist</Text>

                <View style={styles.contextSection}>
                    <Animated.FlatList
                        data={infiniteContextData}
                        keyExtractor={(item) => item.uniqueKey}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CONTEXT_ITEM_SIZE} 
                        decelerationRate="fast"
                        contentContainerStyle={{
                            paddingHorizontal: SPACER,
                            paddingVertical: 10, 
                            alignItems: 'center'
                        }}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => (
                            <AnimatedContextItem 
                                item={item} 
                                index={index} 
                                scrollX={scrollX} 
                            />
                        )}
                        getItemLayout={(data, index) => ({
                            length: CONTEXT_ITEM_SIZE,
                            offset: CONTEXT_ITEM_SIZE * index,
                            index,
                        })}
                        initialScrollIndex={contextData.length * 50} 
                    />
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
