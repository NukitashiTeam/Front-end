import React, { useEffect, useMemo, useRef } from "react";
import {
    View,
    Text, 
    StyleSheet,
    Animated,
    Easing, 
    Pressable,
    useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/UserOptionsSheetStyles";

type Props = {
    visible: boolean;
    onClose: () => void;
    name?: string;
    email?: string;
};

function MenuItem({ icon, label, last }: {icon: any; label: string; last?: boolean }) {
    return (
        <View style={[styles.item, last && {
            marginTop: 16,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: "#FFFFFF22",
            paddingTop: 12,
        }]}>
            <Ionicons name={icon} size={20} color="#FFF" style={{ marginRight: 12 }} />
            <Text style={styles.itemText}>{label}</Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-forward" size={18} color="#FFF" />
        </View>
    );
}

export default function UserOptionsSheet({ visible, onClose, name="Name", email="email id"}: Props) {
    const { width, height } = useWindowDimensions();
    const panelW = Math.min(300, Math.round(width * 0.8));
    const tx = useRef(new Animated.Value(panelW)).current;
    const fade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if(visible) {
            Animated.parallel([
                Animated.timing(tx, {
                    toValue: 0,
                    duration: 280,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(fade, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(tx, {
                    toValue: panelW,
                    duration: 220,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(fade, {
                    toValue: 0,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, panelW, tx, fade]);

    const pointerEvents = useMemo(() => (visible ? "auto" : "none"), [visible]);

    return (
        <View pointerEvents={pointerEvents as any} style={[StyleSheet.absoluteFill]}>
            <Pressable style={[StyleSheet.absoluteFill]} onPress={onClose}>
                <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "transparent", opacity: fade }]} />
            </Pressable>

            <Animated.View style={[styles.panel, {width: panelW, height: "100%", transform: [{translateX: tx}], right: 0}]}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: "10%"}}>
                    <View style={[styles.iconCircle, { backgroundColor: "#EADDFF" }]}>
                        <Ionicons name="person-outline" size={30} color="#4A2F7C" />
                    </View>

                    <View style={{display: "flex", flexDirection: "column"}}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.email}>{email}</Text>
                    </View>
                </View>

                <View style={styles.menu}>
                    <MenuItem icon="cloud-download-outline" label="Download" />
                    <MenuItem icon="musical-notes-outline" label="Playlist" />
                    <MenuItem icon="time-outline" label="History" />
                    <MenuItem icon="log-out-outline" label="Log Out" />
                </View>
            </Animated.View>
        </View>
    );
}