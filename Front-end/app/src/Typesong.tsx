import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Background from "./component/background";
import styles from "./style";

const TypeSong = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // 👈 lấy giá trị safe area
  const [selected, setSelected] = useState<string[]>([]);
  const types = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "Country", "Dance", "Chill", "Buồn", "Thất tình", "Vui", "Lofi"," Nhạc Trẻ", "Nhạc Trịnh", "Remix"," Acoustic", "Indie", "R&B", "Blues", "Metal"];

  const renderType = (type: string) => {
    const isSelected = selected.includes(type);

    return (
      <TouchableOpacity
        style={styles.optionTypeContainer}
        onPress={() => {
          if (isSelected) {
            setSelected(selected.filter(item => item !== type));
          } else {
            setSelected([...selected, type]);
          }
        }}
        activeOpacity={0.8}>
        <LinearGradient
          colors={
            isSelected
              ? ['#6040aaff', '#8B5CF6', '#a883ffff']
            //   ['#4c669f', '#3b5998', '#192f6a']
              : ['#3239ffff', '#7ea7ffff']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.optionTypebutton}>
          <View style={styles.radioContainer}>
            <View style={[styles.radioCircle, isSelected && styles.radioActive]}>
              {isSelected && <View style={styles.radioDot} />}
            </View>
            <Text style={{...styles.optionText, fontFamily: "Montserrat_600SemiBold",}}>{type}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <Background>
      <View style={{ flex: 1, alignItems: "center", paddingTop: insets.top + 10 }}>
        <Text style={styles.signintitle}>What type of songs do you like?</Text>

        <FlatList
          data={types}
          renderItem={({ item }) => renderType(item)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingVertical: 5 , marginBottom:"5%"}}
          showsVerticalScrollIndicator={false}
        />
        </View>
        <TouchableOpacity style={{...styles.otpbutton, marginBottom: "15%", marginTop: "5%"}} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

    </Background>
  );
};

export default TypeSong;
