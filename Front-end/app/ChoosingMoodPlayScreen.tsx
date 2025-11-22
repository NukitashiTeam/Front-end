import React, { useState } from "react";
import {
    View,
    StyleSheet,
    StatusBar,
    Platform,
    Text,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../styles/ChoosingMoodPlayStyles";
import Header from "../Components/Header";
import {
    useFonts as useMontserrat,
    Montserrat_400Regular,
    Montserrat_700Bold
} from "@expo-google-fonts/montserrat";
import { FlatList } from "react-native-gesture-handler";

type MoodItem = {
    id?: number;
    imgPath: any;
    moodName: string;
};

export default function ChoosingMoodPlayScreen() {
    const router = useRouter();
    const [isModEnabled, setIsModEnabled] = useState(false);
    const insets = useSafeAreaInsets();

    let [fontsMontserratLoaded] = useMontserrat({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    if(!fontsMontserratLoaded) {
        return null;
    }

    const moodList: MoodItem[] = [
        { imgPath: require("../assets/images/avatar.png"), moodName: "Chill" },
        { imgPath: require("../assets/images/avatar2.png"), moodName: "Travel" },
        { imgPath: require("../assets/images/avatar5.png"), moodName: "Deadline" },

        { imgPath: require("../assets/images/avatar.png"), moodName: "Chill" },
        { imgPath: require("../assets/images/avatar2.png"), moodName: "Travel" },
        { imgPath: require("../assets/images/avatar5.png"), moodName: "Deadline" },

        { imgPath: require("../assets/images/avatar.png"), moodName: "Chill" },
        { imgPath: require("../assets/images/avatar2.png"), moodName: "Travel" },
        { imgPath: require("../assets/images/avatar5.png"), moodName: "Deadline" },

        { imgPath: require("../assets/images/avatar.png"), moodName: "Chill" },
        { imgPath: require("../assets/images/avatar2.png"), moodName: "Travel" },
        { imgPath: require("../assets/images/avatar5.png"), moodName: "Deadline" },

        { imgPath: require("../assets/images/avatar.png"), moodName: "Chill" },
        { imgPath: require("../assets/images/avatar2.png"), moodName: "Travel" },
        { imgPath: require("../assets/images/avatar5.png"), moodName: "Deadline" },
    ];

    const renderMoodItem = ({ item }: { item: MoodItem }) => (
        <View style={styles.gridItemContainer}>
            <View style={styles.moodCircle}>
                <Image source={item.imgPath} style={styles.moodImage} resizeMode="contain" />
            </View>
            <Text style={styles.moodName}>{item.moodName}</Text>
        </View>
    );

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

            <FlatList
                data={moodList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMoodItem}
                numColumns={3}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
