import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from '../styles/style';
interface Props{
    onNextPage: ()  =>void;
    onBackPage: () =>void;
}
const NextBackButton: React.FC<Props> = ({onNextPage, onBackPage}) => {
    return(
        <View style={styles.bottombuttoncontainer}>
                        <TouchableOpacity style={styles.nextbutton} onPress={onNextPage}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextbutton} onPress={onBackPage}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NextBackButton;