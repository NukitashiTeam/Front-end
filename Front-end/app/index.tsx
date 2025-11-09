import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import BackgroundLayer from "@/Components/BackgroundLayer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";

const { width, height } = Dimensions.get("window");

const style = StyleSheet.create({
  container: {
    flex: 1,
    top: 0.26 * height,
    alignItems: "center",
  },
});

export default function Index() {
  const router = useRouter();
  // const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const checkOnboarding = async () => {
  //     try {
  //       const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
  //       setIsFirstLaunch(hasSeen === null);
  //     } catch (error) {
  //       console.error("Error checking onboarding:", error);
  //     };

  //   checkOnboarding();
  // }}, []);

  // // ✅ Điều hướng sau khi render (không gây lỗi)
  // useEffect(() => {
  //   if ( isFirstLaunch) {
  //     router.replace("/onboarding");
  //   }
  //   else{
  //     router.replace("/HomeScreen");
  //   }
  // }, []);

  // // ⏳ Có thể hiển thị splash hoặc loading tạm

  const checkOpen = useCallback (async () => {
    const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
    if (hasSeen !== "true") {
      router.replace("/onboarding");
    } else {
      router.replace("/HomeScreen");
    }
  }, [])

  useEffect(() => {
    checkOpen();
  }, []);

  return (
    <BackgroundLayer>
      <View style={style.container}>
        <TouchableOpacity
          onPress={() => router.replace("/onboarding")}
          activeOpacity={0.8}
        >
          <Image source={require("../assets/images/ScreenLogo.png")} />
        </TouchableOpacity>
      </View>
    </BackgroundLayer>
  );
}
