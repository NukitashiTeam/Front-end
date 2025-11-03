import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import styles from './styles/GestureHandleStyles';

interface GestureHandleProps {
    style?: StyleProp<ViewStyle>;
}

const GestureHandle: React.FC<GestureHandleProps> = ({ style }) => {
    return <View style={[styles.handle, style]} />;
};

export default GestureHandle;