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
import { useRouter } from 'expo-router'; // nếu dùng Expo Router
import Background from "../../../Components/background";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NextBackButton from "../../../Components/NextBackButton";
import styles from '@/styles/style';
import { signupStep2 } from '@/fetchAPI/signupAPI';
export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
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
          params: { email: email.trim() } // Truyền email qua params
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
          {/* Tiêu đề */}
            <Text style={styles.signintitle}>Enter Your Email</Text>

            {/* Input Email */}
            <TextInput
                style={styles.textinput}
                placeholder="Insert your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                />
          
          

          {/* Text Terms */}
          <Text style={[styles.termtext,{color:"white"}]}>By creating an account, you agree to the Terms and Privacy Policy</Text>
             <NextBackButton onNextPage={handleNext} onBackPage ={() => router.back()}/>
          
    </Background>
  );
}
