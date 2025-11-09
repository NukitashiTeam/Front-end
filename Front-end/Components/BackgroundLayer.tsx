import { Text, View, StyleSheet, Image, Dimensions} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height} = Dimensions.get("window");

const style = StyleSheet.create({
  container: {
    backgroundColor: "#818BFF",
    flex: 1,
  },
  gradientOverlay: {
    position: "absolute",
    width: width,
    height: 795,
    top: 230,
    left: 0,
    right: 0,   
  },
  content:{
    zIndex: 1,
  }
});

type Props = {
  children: any;
};

export default function BackgroundLayer({ children }: Props) {
  return (
    <View
      style={style.container}
    >
        <View style={style.content}>{children}</View>
        <Image
            source={require('../assets/images/Shadow.png')} 
            style={[
            style.gradientOverlay,
            ]}
            resizeMode="stretch"
        />
    </View>
  );
}

