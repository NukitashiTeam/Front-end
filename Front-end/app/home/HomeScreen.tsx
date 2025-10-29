import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, StatusBar, Switch, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import styles from "./HomeStyles";
import { useFonts as useIrishGrover, IrishGrover_400Regular} from '@expo-google-fonts/irish-grover';
import { useFonts as useMontserrat, Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
    let [fontsIrishGroverLoaded] = useIrishGrover({
        IrishGrover_400Regular,
    });

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const fontsLoaded = fontsIrishGroverLoaded && fontsMontserratLoaded;
    const [isModEnabled, setIsModEnabled] = useState(true);

    useEffect(() => {
        async function prepare() {
            if(fontsIrishGroverLoaded && fontsMontserratLoaded) {
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, [fontsLoaded]);

    if(!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient 
                colors={["#9fb1ff", "#3b2a89"]}
                start={{x: 0.2, y: 0}}
                end={{x: 0.5, y: 1}}
                style={styles.bgGradient}
            />

            <ScrollView 
                style={styles.contentWrapper}
                contentContainerStyle={styles.contentInner}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.headerLeaf}>
                        <Text style={styles.appName}>MoodyBlue</Text>
                    </View>

                    <View style={styles.headerRight}>
                        <Switch 
                            trackColor={{false: '#767577', true: '#7056A1'}}
                            thumbColor={"#FFFFFF"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={setIsModEnabled}
                            value={isModEnabled}
                        />

                        <View style={styles.iconCircle}>
                            <Ionicons name="heart-outline" size={24} color="#1D1B20" /> 
                        </View>

                        <View style={[styles.iconCircle, {backgroundColor: "#EADDFF"}]}>
                            <Ionicons name="person-outline" size={26} color="#4A2F7C" />
                        </View>
                    </View>
                </View>

                {/* QUICK START */}
                <View style={{width: "100%", alignItems: "center"}}>
                    <Text style={styles.sectionTitle}>QUICK START</Text>
                </View>

                <View style={styles.quickStartWrapper}>
                    <LinearGradient
                        colors={["#4F3BDB", "#2E266F"]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.quickStartCard}
                    >
                        <View style={styles.quickStartTopRow}>
                            <Text style={styles.quickStartLabel}>Last Mood</Text>

                            <View style={styles.quickStartLeftDown}>
                                <View style={styles.moodAvatarCircle}>
                                    {/* <Text style={{ color: "#1D1B20", fontWeight: "600" }}>😎</Text> */}
                                    <Image source={require("../../assets/images/avatar.png")} style={styles.moodAvatarImg} />
                                </View>

                                <Text style={styles.moodNameText}>Chill</Text>
                            </View>
                        </View>
                        
                        <View style={styles.quickStartBottomRow}>
                            <View style={styles.playOuterCircle}>
                                <View style={styles.playInnerTriangle}>
                                    <Ionicons name="play" size={24} color="#2E266F" />
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* RECENT PLAYLIST */}
                <View style={{width: "100%", alignItems: "center"}}>
                    <Text style={styles.sectionTitle}>RECENT PLAYLIST</Text>
                </View>

                <View style={styles.placeholderCard}>
                    <Text style={{color: "white"}}>TODO: Playlist Grid</Text>
                </View>
            </ScrollView>

            <View style={styles.miniPlayerStub}>
                <Text style={{color: "white", textAlign: "center"}}>
                    TODO: Mini Player + Bottom Tabs
                </Text>
            </View>
        </View>
    );
}