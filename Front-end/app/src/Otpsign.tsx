import React,{useState, useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './style';
import { useRouter } from 'expo-router';
import Background from './component/background';
import NextBackButton from './component/NextBackButton';
const Otpsign = () =>{
    const router = useRouter();
    const [otp,setOtp] = useState<string[]>(['', '', '', '']);
    const ref0 = useRef<TextInput>(null);
    const ref1 = useRef<TextInput>(null);
    const ref2 = useRef<TextInput>(null);
    const ref3 = useRef<TextInput>(null);
    const refs = [ref0, ref1, ref2, ref3];
    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input if digit entered
        if (text && index < 3) {
            refs[index + 1]?.current?.focus();
        }
    };

    const handleNext = () => {
        const code = otp.join('');
        console.log('OTP:', code);
        // Navigate to next screen or verify OTP
        // router.push('/next-screen');
    };
    const handleResend = () => {
        console.log('Resend SMS');
        // Logic to resend OTP
    };

    return(
        <Background>
        <Text style={styles.signintitle}>Enter OTP</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              ref={refs[index]} // Gán ref đúng cách
              autoFocus={index === 0}
            />
          ))}
        </View>
        <NextBackButton onNextPage={handleNext} onBackPage ={() => router.back()}/>
        </Background>
    )   
}
export default Otpsign;