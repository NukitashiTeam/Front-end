import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    FlatList,
    ScrollView as RNScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../Components/Header";
import styles from "../styles/ContextConfigScreenStyles";

type Mode = "config" | "create";

type Mood = {
    id: string;
    label: string;
    icon: any;
};

const MOODS: Mood[] = [
    { id: "chill", label: "Chill", icon: require("../assets/images/avatar.png") },
    { id: "travel", label: "Travel", icon: require("../assets/images/avatar2.png") },
    { id: "exhausted", label: "Exhausted", icon: require("../assets/images/avatar3.png") },
    { id: "educational", label: "Educational", icon: require("../assets/images/avatar4.png") },
    { id: "deadline", label: "Deadline", icon: require("../assets/images/avatar5.png") },

    { id: "chill1", label: "Chill", icon: require("../assets/images/avatar.png") },
    { id: "travel1", label: "Travel", icon: require("../assets/images/avatar2.png") },
    { id: "exhausted1", label: "Exhausted", icon: require("../assets/images/avatar3.png") },
    { id: "educational1", label: "Educational", icon: require("../assets/images/avatar4.png") },
    { id: "deadline1", label: "Deadline", icon: require("../assets/images/avatar5.png") },

    { id: "chill2", label: "Chill", icon: require("../assets/images/avatar.png") },
    { id: "travel2", label: "Travel", icon: require("../assets/images/avatar2.png") },
    { id: "exhausted2", label: "Exhausted", icon: require("../assets/images/avatar3.png") },
    { id: "educational2", label: "Educational", icon: require("../assets/images/avatar4.png") },
    { id: "deadline2", label: "Deadline", icon: require("../assets/images/avatar5.png") },
];

const ALL_IONICONS = Object.keys(Ionicons.glyphMap);

const ICON_OPTIONS = [
    { id: "book", name: "book-outline" as const, label: "Study" },
    { id: "music", name: "musical-notes-outline" as const, label: "Music" },
    { id: "walk", name: "walk-outline" as const, label: "Walk" },
    { id: "briefcase", name: "briefcase-outline" as const, label: "Work" },
    { id: "planet", name: "planet-outline" as const, label: "Focus" },
    { id: "bed", name: "bed-outline" as const, label: "Chill" },
];

const COLOR_OPTIONS = [
    "#FF9F9F",
    "#FFCE6B",
    "#7BDFA6",
    "#7EC8FF",
    "#C79EFF",
    "#FF8FCD",
];

export default function ContextConfigScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ mode?: string; contextType?: string }>();

    const initialMode: Mode = params.mode === "create" ? "create" : "config";
    const [mode, setMode] = useState<Mode>(initialMode);

    useEffect(() => {
        setMode(params.mode === "create" ? "create" : "config");
    }, [params.mode]);

    const [isModEnabled, setIsModEnabled] = useState(true);
    const [contextType, setContextType] = useState<string>((params.contextType as string) || "Studying");
    const [contextIcon, setContextIcon] = useState<string>("book-outline");
    const [contextColor, setContextColor] = useState<string>("#9fb1ff");
    const [contextName, setContextName] = useState<string>("");
    const [selectedIcon, setSelectedIcon] = useState<string>("book-outline");
    const [selectedColor, setSelectedColor] = useState<string>("#9fb1ff");
    const [selectedMoodIds, setSelectedMoodIds] = useState<string[]>(["chill", "travel", "exhausted",]);
    const selectedMoods = useMemo(() => MOODS.filter((m) => selectedMoodIds.includes(m.id)), [selectedMoodIds]);
    const toggleMood = (id: string) => {
        setSelectedMoodIds((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            return [...prev, id];
        });
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
                    {mode === "config" ? "Context Config Page" : "Context Create"}
                </Text>

                {mode === "config" && (<>
                    <Text style={styles.sectionLabel}>Context Type: {contextType}</Text>
                    <View style={styles.rowCard}>
                        <View style={styles.typeCard}>
                            <View
                                style={[styles.typeIconWrap, {
                                    backgroundColor: contextColor || "#9fb1ff"
                                }]}
                            >
                                <Ionicons name={contextIcon as any} size={32} color="#FFFFFF" />
                            </View>
                            
                            <Text style={styles.typeText}>{contextType}</Text>
                        </View>
                        
                        <View style={{ flex: 1, gap: 10 }}>
                            <Pressable style={styles.pillBtn} onPress={() => setMode("create")}>
                                <Text style={styles.pillBtnText}>Add more</Text>
                            </Pressable>
                            
                            <Pressable
                                style={[styles.pillBtn, {
                                    opacity: selectedMoodIds.length ? 1 : 0.6,
                                    backgroundColor: "#4C38CA",
                                }]}
                                onPress={() => {
                                    router.push({
                                        pathname: "/CreateMoodPlaylistScreen",
                                        params: { moodIds: selectedMoodIds.join(",") },
                                    });
                                }}
                            >
                                <Text style={styles.pillBtnText}>Create Playlist</Text>
                            </Pressable>
                        </View>
                    </View>
                </>)}

                {mode === "create" && (<>
                    <View style={styles.createHeaderCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.formLabel}>Your Context Name</Text>
                            <TextInput
                                value={contextName}
                                onChangeText={setContextName}
                                placeholder="Context Name"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.logoCard}>
                            <Text style={styles.formLabel}>Context Logo</Text>
                            <View style={[styles.logoBox, {
                                backgroundColor: selectedColor || "#9fb1ff"
                            }]}>
                                <Ionicons name={selectedIcon as any} size={40} color="#FFFFFF" />
                            </View>
                        </View>
                    </View>

                    <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Choose Context Icon</Text>
                    <RNScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.iconPickerRow}
                    >
                        {ICON_OPTIONS.map((icon) => {
                            const active = selectedIcon === icon.name;
                            return (
                                <Pressable
                                    key={icon.id}
                                    style={[styles.iconOption, active && styles.iconOptionActive]}
                                    onPress={() => setSelectedIcon(icon.name)}
                                >
                                    <View style={styles.iconOptionIconWrap}>
                                        <Ionicons
                                            name={icon.name}
                                            size={24}
                                            color="#FFFFFF"
                                        />
                                    </View>
                                    <Text style={styles.iconOptionLabel}>{icon.label}</Text>
                                </Pressable>
                            );
                        })}
                    </RNScrollView>

                    <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Choose Background Color</Text>
                    <View style={styles.colorPickerRow}>
                        {COLOR_OPTIONS.map((c) => {
                            const active = selectedColor === c;
                            return (
                                <Pressable
                                    key={c}
                                    style={[styles.colorDot, { backgroundColor: c }]}
                                    onPress={() => setSelectedColor(c)}
                                >
                                    {active && <View style={styles.colorDotActive} />}
                                </Pressable>
                            );
                        })}
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
                    {selectedMoods.map((m) => (
                        <View key={m.id} style={styles.selectedItem}>
                            <Image source={m.icon} style={styles.selectedAvatar} />
                            <Text style={styles.selectedText}>{m.label}</Text>
                        </View>
                    ))}
                </LinearGradient>

                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Choose Context's Mood</Text>
                <LinearGradient
                    colors={["#4C38CA", "#392997", "#261B64"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.5577, 1]}
                    style={styles.gridCard}
                >
                <FlatList
                    data={MOODS}
                    keyExtractor={(it) => it.id}
                    numColumns={5}
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => {
                        const active = selectedMoodIds.includes(item.id);
                        return (
                            <Pressable
                                onPress={() => toggleMood(item.id)}
                                style={[styles.moodCell, active && styles.moodCellActive]}
                            >
                                <Image source={item.icon} style={styles.moodAvatar} />
                                <Text style={styles.moodLabel} numberOfLines={1}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
                </LinearGradient>

                {mode === "create" && (
                    <Pressable
                        style={[styles.createBtn, { opacity: contextName.trim() ? 1 : 0.6 }]}
                        onPress={() => {
                            if (!contextName.trim()) return;
                            setContextType(contextName.trim());
                            setContextIcon(selectedIcon);
                            setContextColor(selectedColor);
                            setContextName("");
                            setMode("config");
                        }}
                    >
                        <Text style={styles.createBtnText}>Create</Text>
                    </Pressable>
                )}
            </ScrollView>
        </View>
    );
}