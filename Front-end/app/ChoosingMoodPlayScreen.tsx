import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    StatusBar,
    Platform,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import styles from "../styles/ChoosingMoodPlayStyles";
import Header from "../Components/Header";
import getAllMoods, { IMood } from "../fetchAPI/getAllMoods";

export default function ChoosingMoodPlayScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [moodList, setMoodList] = useState<IMood[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModEnabled, setIsModEnabled] = useState(false);
    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    useEffect(() => {
        const fetchMoods = async () => {
            try {
                const token = await SecureStore.getItemAsync('accessToken');
                if (token) {
                    const data = await getAllMoods(token);
                    if (data) {
                        setMoodList(data);
                    }
                } else {
                    console.log("Không tìm thấy accessToken");
                }
            } catch (error) {
                console.error("Lỗi khi lấy mood:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMoods();
    }, []);

    const handlePressMood = (item: IMood) => {
        console.log("Selected Mood:", item.displayName);
        const moodNameTarget = item.name || "happy"; 
        router.push({
            pathname: "/CreateMoodPlaylistScreen",
            params: { moodName: moodNameTarget }
        });
    };

    const renderMoodItem = ({ item }: { item: IMood }) => (
        <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.gridItemContainer}
            onPress={() => handlePressMood(item)}
        >
            <View style={[
                styles.moodCircle, 
                { 
                    backgroundColor: item.colorCode || '#FFF',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            ]}>
                <Text style={{ fontSize: 32 }}>{item.icon}</Text>
            </View>
            
            <Text style={styles.moodName} numberOfLines={1}>
                {item.displayName}
            </Text>
        </TouchableOpacity>
    );

    if (!fontsMontserratLoaded) {
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

            <View style={styles.choosingMoodPlayTextContainer}>
                <Text style={styles.choosingMoodPlayTitleStyle}>Choosing Mood Play</Text>
                <Text style={styles.choosingMoodPlayTextStyle}>One click on the mood and make the soundtrack you want</Text>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            ) : (
                <FlatList
                    data={moodList}
                    keyExtractor={(item) => item._id}
                    renderItem={renderMoodItem}
                    numColumns={3}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                            No moods available
                        </Text>
                    }
                />
            )}
        </View>
    );
}