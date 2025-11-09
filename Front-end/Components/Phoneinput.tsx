// import React from "react";
// import {View, TextInput, StyleSheet} from "react-native";
// import Background from "./background";
// import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
// import styles from "../style";
// interface Props{
//     countryCode: CountryCode;
//     onSelect: (country: Country) => void;
//     value: string;
//     onChangeText: (text: string) => void;
// }

// const PhoneInput: React.FC<Props> = ({countryCode, onSelect, value, onChangeText}) => {
//     return (
//         <View style={styles.phoneinputContainer}>
//             <CountryPicker withFlag withFilter withCallingCode countryCode={countryCode} onSelect={onSelect} />
//             <TextInput style={styles.phoneInput} placeholder="Enter your phone number" placeholderTextColor="#999" keyboardType="phone-pad" value={value} onChangeText={onChangeText} />
//         </View>
//     )
// }
// export default PhoneInput;