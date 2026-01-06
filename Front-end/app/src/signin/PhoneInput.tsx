import React,{ useState, useRef } from "react";
import {View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    StatusBar,
    Platform,
    Pressable,
    TextInput,
    TouchableOpacity,
    Modal } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhoneInput, {
  ICountry,
  IPhoneInputRef,
} from 'react-native-international-phone-number';
import styles from "../../../styles/style";
import Background from "../../../Components/background";
import NextBackButton from "../../../Components/NextBackButton";
export default function PhoneInputScreen(){
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [selectedCountry, setSelectedCountry] =
    useState<null | ICountry>(null);
    function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
    }
    function handleInputValue(phoneNumber: string) {
    setPhoneNumber(phoneNumber);
    }
    const insets = useSafeAreaInsets();
    return(
        <Background>
            <View style={{flex:1,alignItems:'center', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, paddingBottom: insets.bottom ? Math.max(insets.bottom, 12) : 12,}}>
            <Text style={{...styles.signintitle, marginTop:20}}>Enter your Email</Text>
             <View style={{width: '100%', paddingTop: 30,paddingLeft:15,paddingRight:5, marginLeft:"1%"}}>
                <PhoneInput
                    value={phoneNumber}
                    onChangePhoneNumber={handleInputValue}
                    selectedCountry={selectedCountry}
                    onChangeSelectedCountry={handleSelectedCountry}
                />
             </View>

             
             
             <Text style={[styles.termtext,{color:"white"}]}>By creating an account, you agree to the Terms and Privacy Policy</Text>
             <NextBackButton onNextPage={()=>router.push("/src/signin/Otpsign")} onBackPage ={() => router.back()}/>
                            </View>
        </Background>
    )
}