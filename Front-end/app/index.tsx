import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Pressable } from "react-native";
import BackgroundLayer from "@/Components/BackgroundLayer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react-native";


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

  // ⏳ Có thể hiển thị splash hoặc loading tạm

  const checkOpen = useCallback (async () => {
    const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
    if (hasSeen !== "true") {
      router.replace("/onboarding");
    } else {
      router.replace("/src/signin/Login");
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
           <Pressable
            className="w-full py-3 bg-textPrimary500 items-center justify-center text-white font-bold rounded-lg tracking-wide"
            onPress={() => {
              console.log("=== TEST SENTRY: Crash tại nút + Đăng sách/tài liệu mới ===");
              // Gửi message
              Sentry.captureMessage(
                "Test Sentry từ nút + Đăng sách/tài liệu mới – Nhóm 4 test crash"
              );
              // Gửi exception
              Sentry.captureException(
                new Error(
                  "SENTRY ERROR: Crash test – nút + Đăng sách/tài liệu mới (error + sourcemaps + performance)"
                )
              );
              // Crash thật
              throw new Error(
                "CRASHED: Crash test từ màn hình Đăng Sách/Tài Liệu – Sentry test"
              );
            }}
          >
            <Text className="text-white font-bold text-base tracking-wide">
              + Đăng sách/tài liệu mới
            </Text>
          </Pressable>

          <Image source={require("../assets/images/ScreenLogo.png")} />
        </TouchableOpacity>
      </View>
    </BackgroundLayer>
  );
}
