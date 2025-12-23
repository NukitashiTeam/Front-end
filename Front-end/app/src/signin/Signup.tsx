import React,{ useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from "../../../styles/style";
import Background from "../../../Components/background";
import { signupStep1 } from "@/fetchAPI/signupAPI";

export default function SignupScreen() {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); 
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [passwordError, setPasswordError] = useState<string>('');
    const handleSignup = async () => {
        if (password !== confirmPassword) {
        setPasswordError("Passwords do not match!");
        return;
    }
    if (!username || !password) {
        Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
        return;
    }

    try {
        await signupStep1({
        username: username.trim(),
        password,
        passwordConfirm: confirmPassword,
        });

        router.navigate('/src/signin/EmailInput');
    } catch (error: any) {
        Alert.alert("Đăng ký thất bại", error.message);
    }
    };
    
    return (
        <Background>
            <Text style={styles.signinlogo}>MoodyBlue</Text>
            <Text style={styles.signinsubtitle}>Welcome to Moody Blue</Text>
                        {passwordError ? (
                <Text style={{ color: "red", marginLeft: 10, marginTop: -5 }}>
                    {passwordError}
                </Text>
            ) : null}
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
        <View style={styles.passwordContainer}>
                <TextInput
                    style={[
                        styles.passwordInput,
                        passwordError ? { borderColor: "red", borderWidth: 1 } : null
                    ]}
                    placeholder="Confirm password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (passwordError) setPasswordError("");
                    }}
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
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Already have an account? <Text style={{fontWeight: 'bold'}} onPress={() => router.push('/src/signin/Login')}>Log In</Text>
        </Text>
        </Background>
    );
}
