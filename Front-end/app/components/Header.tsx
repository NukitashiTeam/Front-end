import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./HeaderStyles";
import UserOptionsSheet from "./UserOptionsSheet";

type HeaderProps = {
    appName?: string;
    isModEnabled: boolean;
    onToggleMod: (value: boolean) => void;
};

export default function Header({
    appName = "MoodyBlue",
    isModEnabled,
    onToggleMod,
}: HeaderProps) {
    const [showSheet, setShowSheet] = useState(false);
    const [mountSheet, setMountSheet] = useState(false);

    const openSheet = () => {
        setMountSheet(true);
        requestAnimationFrame(() => setShowSheet(true));
    };

    const closeSheet = () => {
        setShowSheet(false);
        setTimeout(() => {
            setMountSheet(false);
        }, 280);
    };

    return (
        <View style={styles.headerRow}>
            <View style={styles.headerLeaf}>
                <Text style={styles.appName}>{appName}</Text>
            </View>
            
            <View style={styles.headerRight}>
                <Switch
                    trackColor={{ false: "#767577", true: "#7056A1" }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onToggleMod}
                    value={isModEnabled}
                />
                
                <TouchableOpacity
                    style={styles.iconCircle}
                    onPress={() => {}}
                    accessibilityRole="button"
                    accessibilityLabel="Favorites"
                >
                    <Ionicons name="heart-outline" size={24} color="#1D1B20" />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.iconCircle, { backgroundColor: "#EADDFF" }]}
                    onPress={openSheet}
                    accessibilityRole="button"
                    accessibilityLabel="Profile"
                >
                    <Ionicons name="person-outline" size={26} color="#4A2F7C" />
                </TouchableOpacity>
            </View>

            {mountSheet && (
                <Modal
                    transparent
                    visible
                    animationType="none"
                    onRequestClose={closeSheet}
                    statusBarTranslucent
                >
                    <UserOptionsSheet visible={showSheet} onClose={closeSheet} name="Name" email="email id" />
                </Modal>
            )}
        </View>
    );
}