import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import styles from "../../../styles/style";
import Background from "../../../Components/background";
const LoginScreen = () => {
  const router = useRouter();

  return (
    <Background>
      <Text style={styles.signinlogo}>MoodyBlue</Text>

      <Text style={styles.signinsubtitle}>All your music in one place.</Text>

      <View style={styles.signinbuttonContainer}>
        <TouchableOpacity style={styles.signinbutton} onPress={() => router.push("/src/signin/Otpsign")}>
          <View style={styles.iconcontainer}>
            <Image source={require("../../../assets/images/ant-design_mobile-outlined.png")} style={styles.icon} />
          </View>
          <Text style={styles.buttonText}>Continue with Phone Number</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signinbutton}>
           <View style={styles.iconcontainer}>          
            <Image source={require("../../../assets/images/flat-color-icons_google.png")} style={styles.icon}/>
            </View>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signinbutton}>
           <View style={styles.iconcontainer}>          
            <Image source={require("../../../assets/images/logos_facebook.png")} style={styles.icon}/>
            </View>
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};


export default LoginScreen;
