import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
   StatusBar,
   Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router'; // nếu dùng Expo Router
import Background from "../../../Components/background";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NextBackButton from "../../../Components/NextBackButton";
import styles from '@/styles/style';
import { signupStep2 } from '@/fetchAPI/signupAPI';
export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { username, password } = useLocalSearchParams<{ username?: string; password?: string }>();
  const handleNext = async () => {
    if (!email.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập email");
        return;
    }
    setLoading(true);
    try {
        await signupStep2({ contact: email.trim() });
        router.push({
          pathname: "/src/signin/Otpsign",
          params: { email: email.trim(),
            username: username,
            password: password
           } // Truyền email qua params
        });
    } catch (error: any) {
        Alert.alert("Gửi OTP thất bại", error.message);
    } finally {
        setLoading(false);
    }
  };
  const insets = useSafeAreaInsets()
  return (
    <Background>
          <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start', 
            paddingTop:80, 
            paddingHorizontal: 20,
            width:"100%"
          }}
        >
          {/* Tiêu đề */}
          <Text style={styles.signintitle}>Enter Your Email</Text>

          {/* Input Email */}
          <TextInput
                          style={[styles.textinput, { width: "90%"}]}
                          placeholder="Enter your email"
                          placeholderTextColor="#999"
                          value={email}
                          onChangeText={setEmail}
                      />
        </View>
          
          

          {/* Text Terms */}
          <Text style={[styles.termtext,{color:"white"}]}>By creating an account, you agree to the Terms and Privacy Policy</Text>
             <NextBackButton onNextPage={handleNext} onBackPage ={() => router.back()}/>
          
    </Background>
  );
}
