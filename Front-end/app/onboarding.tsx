import { StyleSheet, Text, View, Image, Dimensions} from 'react-native'
import React, { useRef, useState }  from 'react'
import { useRouter } from "expo-router";
import { FlatList } from 'react-native-gesture-handler';
import BackgroundLayer from '@/Components-Khanh/BackgroundLayer';

const { width, height} = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    image: require('../assets/images/onboarding1.png'),
    title: "Welcome to MoodyBlue!",
    description: "Nghe nhạc theo tâm trạng hiện tại của bạn mọi lúc mọi nơi",
  },
  {
    id: 2,
    image: require('../assets/images/onboarding2.png'),
    title: "Discover & Save Easily",
    description: "Tìm kiếm mọi loại nhạc phù hợp với tâm trạng của bạn và lưu lại một cách đơn giản và nhanh chóng",
  },
  {
    id: 3,
    image: require('../assets/images/onboarding3.png'),
    title: "Relax & Enjoy",
    description: "Sau khi đã lưu lại bạn chỉ cần trải nghiệm, thư giãn và tận hưởng; chúng tôi sẽ mang đến cho bạn khoảng thời gian tuyệt vời",
  },
  {
    id: 4,
    image: require('../assets/images/onboarding4.png'),
    title: "Your Style, One App",
    description: "Lên mood – lên nhạc – lên năng lượng",
  },
];


const onboarding = () => {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);

  
  return (
    <BackgroundLayer>
      
      <View style={styles.container}>
        
        <Image
          source={require('../assets/images/MoodyBlue.png')}
          style={styles.logo}

        />
        <Image
          source={onboardingData[3].image}
          style={styles.image}
        />
        
        <Text style={styles.title}>{onboardingData[0].title}</Text>
        <View style={{width: width*0.75}}>
          <Text style={styles.description}>{onboardingData[0].description}</Text>
        </View>
      </View>
    </BackgroundLayer>
  )
}

export default onboarding

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    alignItems: "center",
  },
  logo: {
    marginTop: 60,
  },
  image: {
    width: '100%',
    height:height*0.4,
    marginTop: 10,
  },
  title: {
    fontFamily:'Inter-Bold',
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 25,
  },
  description: {
    fontSize: 17,
    color: '#ddd',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 25,
    fontWeight: '400',
  },
  
})