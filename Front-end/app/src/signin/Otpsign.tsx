import React,{useState, useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../../../styles/style';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Background from '../../../Components/background';
import { verifyOTP, resendOTP } from '@/fetchAPI/signupAPI';
const Otpsign = () =>{
    const router = useRouter();
    const [otp,setOtp] = useState<string[]>(['', '', '', '']);
    const ref0 = useRef<TextInput>(null);
    const ref1 = useRef<TextInput>(null);
    const ref2 = useRef<TextInput>(null);
    const ref3 = useRef<TextInput>(null);
    const refs = [ref0, ref1, ref2, ref3];
    const { email } = useLocalSearchParams<{ email?: string }>();
    const { username, password } = useLocalSearchParams<{ username?: string; password?: string }>();
    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input if digit entered
        if (text && index < 3) {
            refs[index + 1]?.current?.focus();
        }
    };

    const handleNext = async () => {
        const code = otp.join('');
        console.log('OTP:', code);
        if (code.length !== 4) {
          Alert.alert("Lỗi", "Vui lòng nhập đủ 4 chữ số OTP");
          return;
        }
        try {
          await verifyOTP({ otp: code });
          Alert.alert("Thành công", "Tài khoản đã được tạo thành công!");
          router.push({
            pathname: "/src/signin/Typesong",
            params: {
              username: username,
              password: password
            }
          }); 
        } catch (error: any) {
          Alert.alert("OTP sai", error.message);
        } 
    };
  const handleResend = async () => {
      if (!email) {
        Alert.alert("Lỗi", "Không tìm thấy email. Vui lòng quay lại bước trước.");
        return;
      }

      try {
        await resendOTP({ contact: email });
        Alert.alert("Thành công", "OTP mới đã được gửi lại đến email của bạn!");
      } catch (error: any) {
        Alert.alert("Thất bại", error.message || "Không thể gửi lại OTP");
      }
    };

    return(
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
                  ref={refs[index]} 
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
            <TouchableOpacity onPress={handleResend} style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
              <View>
                <Image source={require("../../../assets/images/Vector.png")} style={styles.icon} />
              </View>
              <Text style={{fontWeight: "600"}}>Edit Phone number</Text>
            </TouchableOpacity>
          </View>
        </Background>
    )   
}
export default Otpsign;