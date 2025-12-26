import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, IrishGrover_400Regular } from "@expo-google-fonts/irish-grover"
import { Montserrat_600SemiBold } from "@expo-google-fonts/montserrat"
import { StyleSheet } from "react-native";

import style from "../styles/style";
interface Props {
  children: ReactNode;
}

const Background: React.FC<Props> = ({ children }) => {
        const [fontsLoaded] = useFonts({
    IrishGrover_400Regular,
  });
  return (
    <LinearGradient colors={["#818BFF", "#3b2a89"]} style={style.userinfocontainer}>
      {children}
    </LinearGradient>
  );
};

export default Background;
