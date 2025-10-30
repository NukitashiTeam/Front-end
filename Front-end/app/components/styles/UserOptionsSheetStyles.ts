import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    panel: {
        position: "absolute",
        backgroundColor: "#2F1766DD",
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 24,
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#DDD",
        marginRight: 12,
    },
    name: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    email: {
        color: "#E9E9E9",
        fontSize: 12,
        opacity: 0.9,
    },
    menu: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "25%",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    itemText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default styles;