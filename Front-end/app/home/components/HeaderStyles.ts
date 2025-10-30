import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    /* HEADER */
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    headerLeaf: {},
    appName: {
        color: "white",
        fontSize: 24,
        fontWeight: "400",
        fontFamily: 'IrishGrover_400Regular',
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default styles;