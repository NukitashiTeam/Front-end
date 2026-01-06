import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    FlatList,
    ScrollView as RNScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from 'expo-secure-store';
import Header from "../Components/Header";
import styles from "../styles/ContextConfigScreenStyles";
import getAllMoods, { IMood } from "../fetchAPI/getAllMoods";
import { refreshTokenUse } from "../fetchAPI/loginAPI";
import getDetailContext from "../fetchAPI/getDetailContext";
import getRandomSongsByContext from "../fetchAPI/getRandomSongsByContext";
import createContext, { ICreateContextInput } from "../fetchAPI/createContext";

type Mode = "config" | "create";

const ICON_OPTIONS = [
    { id: "book", name: "book-outline" as const, label: "Study" },
    { id: "music", name: "musical-notes-outline" as const, label: "Music" },
    { id: "walk", name: "walk-outline" as const, label: "Walk" },
    { id: "briefcase", name: "briefcase-outline" as const, label: "Work" },
    { id: "planet", name: "planet-outline" as const, label: "Focus" },
    { id: "bed", name: "bed-outline" as const, label: "Chill" },
    { id: "fitness", name: "fitness-outline" as const, label: "Gym" },
    { id: "airplane", name: "airplane-outline" as const, label: "Travel" },
];

const COLOR_OPTIONS = [
    "#FF9F9F", "#FFCE6B", "#7BDFA6", "#7EC8FF", "#C79EFF", "#FF8FCD",
    "#FF4500", "#CD853F", "#4169E1", "#FF1493", "#9370DB", "#87CEEB", "#B22222"
];

export default function ContextConfigScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const params = useLocalSearchParams<{ 
        mode?: string; 
        isEdit?: string;
        contextId?: string;
    }>();

    const { mode: paramMode, isEdit, contextId } = params;

    const [mode, setMode] = useState<Mode>("config");
    const [isModEnabled, setIsModEnabled] = useState(true);
    
    const [allMoods, setAllMoods] = useState<IMood[]>([]);
    const [loadingMoods, setLoadingMoods] = useState(true);
    
    const [fetchingDetail, setFetchingDetail] = useState(false);
    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [contextName, setContextName] = useState<string>("");
    const [selectedIcon, setSelectedIcon] = useState<string>("book-outline");
    const [selectedColor, setSelectedColor] = useState<string>("#9fb1ff");
    const [selectedMoodIds, setSelectedMoodIds] = useState<string[]>([]);

    const [displayContextName, setDisplayContextName] = useState("Loading...");
    const [displayContextIcon, setDisplayContextIcon] = useState("⏳");
    const [displayContextColor, setDisplayContextColor] = useState("#9fb1ff");

    useEffect(() => {
        const fetchMoods = async () => {
            setLoadingMoods(true);
            try {
                let token = await SecureStore.getItemAsync("accessToken");
                let fetchedData = null;
                if (token) fetchedData = await getAllMoods(token);
                
                if (!fetchedData) {
                    const newToken = await refreshTokenUse();
                    if (newToken) fetchedData = await getAllMoods(newToken);
                }
                
                if (fetchedData && Array.isArray(fetchedData)) {
                    setAllMoods(fetchedData);
                }
            } catch (e) {
                console.error("Error fetching moods:", e);
            } finally {
                setLoadingMoods(false);
            }
        };
        fetchMoods();
    }, []);

    useEffect(() => {
        const loadContextDetail = async () => {
            if (contextId) {
                setFetchingDetail(true);
                try {
                    let token = await SecureStore.getItemAsync("accessToken");
                    if (token) {
                        const data = await getDetailContext(token, contextId);
                        if (data) {
                            setDisplayContextName(data.name);
                            setDisplayContextIcon(data.icon);
                            setDisplayContextColor(data.color);
                            setContextName(data.name);
                            setSelectedIcon(data.icon);
                            setSelectedColor(data.color);
                            if (data.moods && Array.isArray(data.moods)) {
                                const ids = data.moods.map(m => m._id);
                                setSelectedMoodIds(ids);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Lỗi lấy chi tiết context:", error);
                } finally {
                    setFetchingDetail(false);
                }
            }
        };

        const targetMode = paramMode === "create" ? "create" : "config";
        setMode(targetMode);
        if (targetMode === "create" && isEdit !== "true") {
            setContextName("");
            setSelectedIcon("book-outline");
            setSelectedColor("#9fb1ff");
            setSelectedMoodIds([]);
        } else if (contextId) {
            loadContextDetail();
        }

    }, [contextId, paramMode, isEdit]);

    const handleCreateContextPlaylist = async () => {
        if (isCreatingPlaylist) return;
        setIsCreatingPlaylist(true);

        try {
            const token = await SecureStore.getItemAsync("accessToken");
            if (!token) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập để thực hiện chức năng này.");
                return;
            }

            const result = await getRandomSongsByContext(token, displayContextName);
            if (result && result.success && result.data && result.data.length > 0) {
                router.push({
                    pathname: "/CreatePlaylist",
                    params: {
                        songsData: JSON.stringify(result.data),
                        defaultTitle: `Context: ${displayContextName}`
                    }
                });
            } else {
                Alert.alert("Thông báo", "Không tìm thấy bài hát phù hợp cho ngữ cảnh này.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo playlist context:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo playlist.");
        } finally {
            setIsCreatingPlaylist(false);
        }
    };

    const handleSaveContext = async () => {
        if (!contextName.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập tên cho Context.");
            return;
        }

        if (selectedMoodIds.length === 0) {
            Alert.alert("Thiếu thông tin", "Vui lòng chọn ít nhất một Mood.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = await SecureStore.getItemAsync("accessToken");
            if (!token) {
                Alert.alert("Lỗi", "Vui lòng đăng nhập lại.");
                return;
            }

            const inputData: ICreateContextInput = {
                name: contextName.trim(),
                icon: selectedIcon,
                color: selectedColor,
                moods: selectedMoodIds
            };

            const newContext = await createContext(token, inputData);
            if (newContext) {
                Alert.alert("Thành công", "Đã tạo Context mới!", [
                    {
                        text: "OK",
                        onPress: () => {
                            setDisplayContextName(newContext.name);
                            setDisplayContextIcon(newContext.icon);
                            setDisplayContextColor(newContext.color);
                            setMode("config");
                        }
                    }
                ]);
                router.navigate('/ContextUserListScreen');
            } else {
                Alert.alert("Thất bại", "Không thể tạo Context. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi lưu context:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi hệ thống.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedMoodsList = useMemo(() => 
        allMoods.filter((m) => selectedMoodIds.includes(m._id)), 
    [selectedMoodIds, allMoods]);

    const toggleMood = (id: string) => {
        setSelectedMoodIds((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            return [...prev, id];
        });
    };

    const isUrlOrEmoji = (iconStr: string) => {
        return !ICON_OPTIONS.some(opt => opt.name === iconStr);
    };

    const topPad = Math.max(insets.top, 12);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <LinearGradient
                colors={["#8C84FF", "#6E5ED1"]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView
                contentContainerStyle={{
                    paddingTop: topPad + 8,
                    paddingBottom: 140,
                    paddingHorizontal: 18,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: "3%", paddingTop: 8 }}>
                    <Header isModEnabled={isModEnabled} onToggleMod={setIsModEnabled} />
                </View>

                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => (router.canGoBack() ? router.back() : router.replace("/HomeScreen"))}
                    hitSlop={10}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text style={styles.pageTitle}>
                    {mode === "config" ? "Context Config Page" : (contextId ? "Edit Context" : "Create Context")}
                </Text>

                {mode === "config" && (
                    <>
                    {fetchingDetail ? (
                        <ActivityIndicator size="large" color="#FFF" style={{marginVertical: 20}} />
                    ) : (
                        <>
                            <Text style={styles.sectionLabel}>Context Type: {displayContextName}</Text>
                            <View style={styles.rowCard}>
                                <View style={[styles.typeCard, {
                                    backgroundColor: displayContextColor
                                }]}>
                                    <View style={styles.typeIconWrap}>
                                        {isUrlOrEmoji(displayContextIcon) ? (
                                            <Text style={{fontSize: 40}}>{displayContextIcon}</Text>
                                        ) : (
                                            <Ionicons name={displayContextIcon as any} size={32} color="#FFFFFF" />
                                        )}
                                    </View>
                                    <Text style={styles.typeText}>{displayContextName}</Text>
                                </View>
                                
                                <View style={{ flex: 1, gap: 10 }}>
                                    <Pressable
                                        onPress={() => {
                                            setMode("create");
                                        }}
                                        style={({ pressed }) => [
                                            styles.pillBtn,
                                            { opacity: pressed ? 0.7 : 1 }
                                        ]}
                                    >
                                        <Text style={styles.pillBtnText}>Edit / Add more</Text>
                                    </Pressable>
                                    
                                    <Pressable
                                        onPress={handleCreateContextPlaylist}
                                        disabled={isCreatingPlaylist}
                                        style={({ pressed }) => [
                                            styles.pillBtn,
                                            { backgroundColor: "#4C38CA" },
                                            { opacity: pressed ? 0.7 : 1 }
                                        ]}
                                    >
                                        {isCreatingPlaylist ? (
                                            <ActivityIndicator size="small" color="#FFF" />
                                        ) : (
                                            <Text style={styles.pillBtnText}>Create Playlist</Text>
                                        )}
                                    </Pressable>

                                    <Pressable
                                        onPress={() => {
                                            Alert.alert("Coming Soon", "Chức năng xóa sẽ sớm được cập nhật!");
                                        }}
                                        style={({ pressed }) => [
                                            styles.pillBtn,
                                            { opacity: pressed ? 0.7 : 1 }
                                        ]}
                                    >
                                        <Text style={styles.pillBtnText}>Delete Context</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </>
                    )}
                    </>
                )}

                {mode === "create" && (<>
                    <View style={styles.createHeaderCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.formLabel}>Your Context Name</Text>
                            <TextInput
                                value={contextName}
                                onChangeText={setContextName}
                                placeholder="Studying"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.logoCard}>
                            <Text style={styles.formLabel}>Context Logo</Text>
                            <View style={[styles.logoBox, { backgroundColor: selectedColor || "#9fb1ff" }]}>
                                {isUrlOrEmoji(selectedIcon) ? (
                                    <Text style={{fontSize: 40}}>{selectedIcon}</Text>
                                ) : (
                                    <Ionicons name={selectedIcon as any} size={40} color="#FFFFFF" />
                                )}
                            </View>
                        </View>
                    </View>

                    <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Choose Context Icon</Text>
                    <RNScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconPickerRow}>
                        {ICON_OPTIONS.map((icon) => {
                            const active = selectedIcon === icon.name;
                            return (
                                <Pressable key={icon.id} style={[styles.iconOption, active && styles.iconOptionActive]} onPress={() => setSelectedIcon(icon.name)}>
                                    <View style={styles.iconOptionIconWrap}>
                                        <Ionicons name={icon.name} size={24} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.iconOptionLabel}>{icon.label}</Text>
                                </Pressable>
                            );
                        })}
                    </RNScrollView>

                    <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Choose Background Color</Text>
                    <View style={styles.colorPickerRow}>
                        {COLOR_OPTIONS.map((c) => (
                            <Pressable key={c} style={[styles.colorDot, { backgroundColor: c }]} onPress={() => setSelectedColor(c)}>
                                {selectedColor === c && <View style={styles.colorDotActive} />}
                            </Pressable>
                        ))}
                    </View>
                </>)}

                <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Consist Of:</Text>
                <LinearGradient
                    colors={["rgba(48, 7, 181, 0.66)", "rgba(21, 3, 79, 0.66)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0.5048, 1]}
                    style={styles.selectedBar}
                >
                    {selectedMoodsList.length > 0 ? selectedMoodsList.map((m) => (
                        <View key={m._id} style={styles.selectedItem}>
                            <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                            <Text style={styles.selectedText}>{m.displayName}</Text>
                        </View>
                    )) : (
                        <Text style={{color: 'rgba(255,255,255,0.5)', padding: 10, fontStyle: 'italic'}}>
                            {fetchingDetail ? "Loading moods..." : "No moods selected"}
                        </Text>
                    )}
                </LinearGradient>

                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Choose Context's Mood</Text>
                <LinearGradient
                    colors={["#4C38CA", "#392997", "#261B64"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.5577, 1]}
                    style={styles.gridCard}
                >
                    {loadingMoods ? (
                        <ActivityIndicator color="#FFF" style={{ padding: 20 }} />
                    ) : (
                        <FlatList
                            data={allMoods}
                            keyExtractor={(it) => it._id}
                            numColumns={5}
                            scrollEnabled={false}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            renderItem={({ item }) => {
                                const active = selectedMoodIds.includes(item._id);
                                return (
                                    <Pressable
                                        onPress={() => toggleMood(item._id)}
                                        style={[styles.moodCell, active && styles.moodCellActive]}
                                    >
                                        <Text style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</Text>
                                        <Text style={styles.moodLabel} numberOfLines={1}>
                                            {item.displayName}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />
                    )}
                </LinearGradient>

                {mode === "create" && (
                    <Pressable
                        style={[styles.createBtn, { opacity: (contextName.trim() && !isSubmitting) ? 1 : 0.6 }]}
                        onPress={handleSaveContext}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.createBtnText}>
                                {contextId ? "Save Changes" : "Create"}
                            </Text>
                        )}
                    </Pressable>
                )}
            </ScrollView>
        </View>
    );
}