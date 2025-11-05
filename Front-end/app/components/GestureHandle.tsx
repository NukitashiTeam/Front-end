import React from "react";
import {
    View,
    StyleProp,
    ViewStyle,
    ViewProps
} from "react-native";
import styles from "./styles/GestureHandleStyles";

interface GestureHandleProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
}

const GestureHandle: React.FC<GestureHandleProps> = ({ style, ...rest }) => {
    return <View style={[styles.handle, style]} {...rest} />;
};

export default GestureHandle;