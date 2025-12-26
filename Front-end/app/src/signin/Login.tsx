import React,{ useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import loginAPI from "@/fetchAPI/loginAPI";
import styles from "../../../styles/style";
import Background from "../../../Components/background";
export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleLogin = async () => {
      if (!username || !password) return;

      try {
        await loginAPI(username, password);
        // Đăng nhập thành công → chuyển sang Home
        router.navigate('/HomeScreen');
      } catch (error) {
        alert('Đăng nhập thất bại. Kiểm tra username/password.');
        console.error(error);
      }
    };
    return (
        <Background>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <Text style={styles.signinlogo}>MoodyBlue</Text>
            <Text style={styles.signinsubtitle}>All your music in one place.</Text>
            <TextInput
                style={styles.textinput}
                placeholder="Insert your username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
            />
        <View style={styles.passwordContainer}>
            <TextInput
            style={styles.passwordInput}
            placeholder="Insert your password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            />  
            <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#aaa"
                    style={styles.eyeButton}
                    onPress={toggleShowPassword}
                />
        </View>
        
        <TouchableOpacity 
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.customCheckbox, rememberMe && styles.checkedCheckbox]}>
            {rememberMe && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.otpbutton,{backgroundColor: username&&password ? 'white' : '#AAA'}]}
          disabled={!username||!password}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Don&apos;t have an account? <Text style={{fontWeight: 'bold'}} onPress={() => router.push('/src/signin/Signup')}>Sign Up</Text>
        </Text>
        </Background>
    );
}
