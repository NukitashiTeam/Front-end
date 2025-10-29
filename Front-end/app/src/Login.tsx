import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, IrishGrover_400Regular } from "@expo-google-fonts/irish-grover"

const LoginScreen = () => {
    const [fontsLoaded] = useFonts({
    IrishGrover_400Regular,
  });

  return (
    <LinearGradient
      colors={["#818BFF", "#3b2a89"]}
      style={styles.container}
    >
      <Text style={styles.logo}>MoodyBlue</Text>

      <Text style={styles.subtitle}>All your music in one place.</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconcontainer}>          
            <Image source={require('../../assets/images/ant-design_mobile-outlined.png')} style={styles.icon}/>
            </View>
          <Text style={styles.buttonText}>Continue with Phone Number</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
           <View style={styles.iconcontainer}>          
            <Image source={require('../../assets/images/flat-color-icons_google.png')} style={styles.icon}/>
            </View>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
           <View style={styles.iconcontainer}>          
            <Image source={require('../../assets/images/logos_facebook.png')} style={styles.icon}/>
            </View>
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontWeight: "400",
    position: "absolute",
    color: "rgba(255, 255, 255, 0.72)",
    top: 80,
    fontFamily: "IrishGrover_400Regular",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    fontWeight:"600",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "85%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: "flex-start",
  },
  iconcontainer :{
    width: 40, // giúp icon của các button thẳng hàng nhau
    alignItems: "center",
    marginRight:20,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500",
    justifyContent: "center",
  },
});

export default LoginScreen;
