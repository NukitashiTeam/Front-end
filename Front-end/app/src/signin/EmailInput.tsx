import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Background from "../../../Components/background";
import NextBackButton from "../../../Components/NextBackButton";
import styles from '@/styles/style';
import { signupStep2 } from '@/fetchAPI/signupAPI';

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Thêm loading
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
          params: { 
            email: email.trim(),
            username: username,
            password: password
          } 
        });
    } catch (error: any) {
        Alert.alert("Gửi OTP thất bại", error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Background>
      <Modal visible={loading} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Modal>

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
        <Text style={styles.signintitle}>Enter Your Email</Text>

        <TextInput
          style={[styles.textinput, { width: "90%"}]}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <Text style={[styles.termtext,{color:"white"}]}>By creating an account, you agree to the Terms and Privacy Policy</Text>
      <NextBackButton 
        onNextPage={handleNext} 
        onBackPage={() => router.back()}
        // loading={loading} 
      />
    </Background>
  );
}