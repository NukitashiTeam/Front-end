import BackgroundLayer from "@/Components/BackgroundLayer";
import Paginator from "@/Components/Paginator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-gesture-handler";

console.log("✅ Onboarding component loaded");

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 0,
    image: require("../assets/images/onboarding1.png"),
    title: "Welcome to MoodyBlue!",
    description: "Nghe nhạc theo tâm trạng hiện tại của bạn mọi lúc mọi nơi",
  },
  {
    id: 1,
    image: require("../assets/images/onboarding2.png"),
    title: "Discover & Save Easily",
    description:
      "Tìm kiếm mọi loại nhạc phù hợp với tâm trạng của bạn và lưu lại một cách đơn giản và nhanh chóng",
  },
  {
    id: 2,
    image: require("../assets/images/onboarding3.png"),
    title: "Relax & Enjoy",
    description:
      "Sau khi đã lưu lại bạn chỉ cần trải nghiệm, thư giãn và tận hưởng; chúng tôi sẽ mang đến cho bạn khoảng thời gian tuyệt vời",
  },
  {
    id: 3,
    image: require("../assets/images/onboarding4.png"),
    title: "Your Style, One App",
    description: "Lên mood – lên nhạc – lên năng lượng",
  },
];

function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNextPage = async () => {
    if (index < onboardingData.length - 1) {
      const nextIndex = index + 1;
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: nextIndex });
      }
      setIndex(nextIndex);
    } else {
      // ✅ Khi hoàn tất onboarding, lưu lại trạng thái đã xem
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/HomeScreen");
    }
  };

  const skipOnboarding = async () => {
    // ✅ Khi người dùng bấm "Skip!", cũng lưu lại
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/HomeScreen");
  };

  const renderPage = ({ item }: { item: (typeof onboardingData)[0] }) => {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/MoodyBlue.png")}
          style={styles.logo}
        />

        <Image source={item.image} style={styles.image} />

        <Text style={styles.title}>{item.title}</Text>
        <View style={{ width: width * 0.7 }}>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <BackgroundLayer>
      <FlatList
        style={{ flex: 0 }}
        ref={flatListRef}
        data={onboardingData}
        horizontal
        bounces={false}
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        scrollEnabled={false}
        renderItem={renderPage}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }
          }, 100);
        }}
      />
      <View style={{marginTop:-50}}>
        <Paginator data={onboardingData} scrollX={scrollX} index={index} />

      <View style={{ alignItems: "center", marginTop:-10 }}>
        <TouchableOpacity style={styles.button} onPress={handleNextPage}>
          <Text style={styles.buttonText}>
            {index === onboardingData.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={skipOnboarding}>
          <Text style={{ fontSize: 13, marginTop: 15, fontWeight: "400" }}>
            Skip!
          </Text>
        </TouchableOpacity>
      </View>
      </View>
      
    </BackgroundLayer>
  );
}

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    width: width,
    alignItems: "center",
  },
  logo: {
    marginTop: 60,
  },
  image: {
    width: width,
    height: height * 0.4,
    marginTop: 10,
    resizeMode: "contain",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
    marginTop: 25,
  },
  description: {
    fontSize: 20,
    color: "#ddd",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 25,
    fontWeight: "400",
  },
  button: {
    backgroundColor: "#8400FF",
    paddingVertical: 20,
    paddingHorizontal: 48,
    gap: 34,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 21,
    fontWeight: "700",
  },
});
