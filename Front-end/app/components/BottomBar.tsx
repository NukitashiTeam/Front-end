import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles/BottomBarStyles";

type TabKey = "home" | "search" | "radio" | "music";

export default function BottomBar({
    active = "home",
    onPress,
}: {
    active?: TabKey;
    onPress?: (k: TabKey) => void;
}) {
    const dim = (k: TabKey) => active === k ? "#5b4dbb" : "rgba(0,0,0,0.25)";
    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.bottomTabBtn} onPress={() => onPress?.("home")}>
                <Ionicons name="home-outline" size={20} color={dim("home")} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomTabBtn} onPress={() => onPress?.("search")}>
                <Ionicons name="search-outline" size={20} color={dim("search")} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomTabBtn} onPress={() => onPress?.("radio")}>
                <Ionicons name="radio-outline" size={20} color={dim("radio")} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomTabBtn} onPress={() => onPress?.("music")}>
                <Ionicons name="musical-notes-outline" size={20} color={dim("music")} />
            </TouchableOpacity>
        </View>
    );
}
