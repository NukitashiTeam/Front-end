import React,{useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Background from "./component/background";
import PhoneInput from "./component/Phoneinput";
import { useRouter } from "expo-router";
import { Country, CountryCode } from "react-native-country-picker-modal";
import NextBackButton from "./component/NextBackButton";
import styles from "./style";
const PhoneScreen = () =>{
    const [countryCode, setCountryCode] = useState<CountryCode>("IN");
    const [country, setCountry] = useState<Country | null>(null);
    const [phoneNumber,setPhoneNumber] = useState("");
    const router = useRouter();
    return(
        <Background>
            <Text style={styles.signintitle}>Enter your phone number</Text>
            <PhoneInput countryCode={countryCode} onSelect = {(c)=>{
                setCountryCode(c.cca2);
                setCountry(c);
            }}
            value={phoneNumber} onChangeText={setPhoneNumber}/>
            <Text style={styles.termtext}>By creating an account, you agree to the Terms and Privacy Policy</Text>
            <NextBackButton onNextPage={()=>router.push("/src/Otpsign")} onBackPage ={() => router.back()}/>
        </Background>
    )
}
export default PhoneScreen;