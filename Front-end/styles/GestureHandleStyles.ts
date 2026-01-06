import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    touchArea: {
        height: "10%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        zIndex: 10000000,
    },
    handle: {
        width: 80,
        height: 7,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.5)",
    },
});

export default styles;