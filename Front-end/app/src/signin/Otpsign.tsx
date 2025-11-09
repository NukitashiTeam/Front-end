import React,{useState, useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../../../styles/style';
import { useRouter } from 'expo-router';
import Background from '../../../Components/background';
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
        router.push("/src/signin/Typesong");
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
        <Text style={styles.otpsubtitle}> We sent an SMS with a 4-digit Code to your phone number</Text>
        <TouchableOpacity onPress={handleNext} style={styles.otpbutton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResend} style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <View>
            <Image source={require("../../../assets/images/mingcute_message-4-line.png")} style={styles.icon} />
          </View>
          <Text style={{fontWeight: "600"}}>Resend OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.back()} style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <View>
            <Image source={require("../../../assets/images/Vector.png")} style={styles.icon} />
          </View>
          <Text style={{fontWeight: "600"}}>Edit Phone Number</Text>
        </TouchableOpacity>
        </Background>
    )   
}
export default Otpsign;