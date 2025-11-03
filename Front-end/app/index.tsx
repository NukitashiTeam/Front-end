import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity} from "react-native";
import BackgroundLayer from "@/Components-Khanh/BackgroundLayer";
import { useRouter } from "expo-router";

const { width, height} = Dimensions.get("window");

const style = StyleSheet.create({
  container: {
    flex: 1,
    top: 0.26*height,
    alignItems: "center",
  },
});

import LoginScreen from "./src/Login";
export default function Index() {
  const router = useRouter();

  return (
    <BackgroundLayer>
      <View style={style.container}>
        <TouchableOpacity 
        onPress={() => router.push("/onboarding")}
        activeOpacity={0.8}
      >
        <Image
          source={require('../assets/images/ScreenLogo.png')}
        />
        
      </TouchableOpacity>

      </View>
    </BackgroundLayer>
  );
  return <LoginScreen />;
}
