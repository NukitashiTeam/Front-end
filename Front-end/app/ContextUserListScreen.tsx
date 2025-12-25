import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StatusBar,
    Platform,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";

import styles from "../styles/ContextUserListStyles";
import Header from "../Components/Header";
import getUserContexts, { IContext } from "../fetchAPI/getUserContexts";

export default function ContextUserListScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const [contextList, setContextList] = useState<IContext[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isModEnabled, setIsModEnabled] = useState(false);

    let [fontsLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const fetchContexts = async () => {
        try {
            setIsLoading(true);
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                const data = await getUserContexts(token);
                if (data) {
                    setContextList(data);
                }
            } else {
                console.log("Không tìm thấy accessToken, vui lòng đăng nhập lại.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy context:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchContexts();
        }, [])
    );

    if (!fontsLoaded) return null;

    const renderItem = ({ item }: { item: IContext }) => {
        const isUrlIcon = item.icon && (item.icon.startsWith('http') || item.icon.startsWith('file'));

        return (
            <TouchableOpacity 
                style={styles.cardContainer}
                activeOpacity={0.8}
                onPress={() => {
                    router.push({
                        pathname: "/ContextConfigScreen",
                        params: {
                            mode: "config",
                            contextId: item._id,
                        }
                    });
                }}
            >
                <View style={[styles.cardBox, { backgroundColor: item.color || '#82B1FF' }]}>
                    {isUrlIcon ? (
                        <Image 
                            source={{ uri: item.icon }} 
                            style={{ width: 32, height: 32, resizeMode: 'contain', marginBottom: 4 }} 
                        />
                    ) : (
                        <Text style={styles.cardIcon}>{item.icon}</Text>
                    )}
                </View>
                
                <Text style={styles.cardLabelOutside} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, {
            paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + insets.top,
        }]}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

            <LinearGradient
                colors={["#8C84FF", "#6E5ED1"]}
                start={{ x: 0.2, y: 0.0 }}
                end={{ x: 0.8, y: 1 }}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />

            <View style={styles.headerTopWrap}>
                <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
            </View>

            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={[styles.screenTitle, { color: '#FFF' }]}>My Context</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Context 's Name"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            ) : (
                <FlatList
                    data={contextList}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={3}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={[
                        styles.flatListContent, 
                        { paddingBottom: insets.bottom + 80 }
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                            You don't have any context yet. Create one!
                        </Text>
                    }
                />
            )}

            <View style={[styles.createButtonContainer, { bottom: insets.bottom + 20 }]}>
                <TouchableOpacity 
                    style={styles.createButton}
                    onPress={() => {
                        router.push({
                            pathname: "/ContextConfigScreen",
                            params: {
                                mode: "create",
                                isEdit: "false",
                            }
                        }); 
                    }}
                >
                    <Text style={styles.createButtonText}>Create Your Own</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}