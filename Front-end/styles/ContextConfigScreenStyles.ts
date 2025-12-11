import { StyleSheet, Platform } from "react-native";

const CARD_BG = "rgba(46, 38, 111, 0.55)";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3b2a89"
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    pageTitle: {
        marginTop: "1%",
        marginBottom: 6,
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    sectionLabel: {
        marginTop: 10,
        marginBottom: "5%",
        color: "#0B0B0B",
        fontSize: 20,
        fontWeight: "700",
    },
    rowCard: {
        flexDirection: "row",
        gap: "5%",
        alignItems: "center",
    },
    typeCard: {
        width: 120,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#72A8FF",
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 3,
        alignItems: "center",
    },
    typeIconWrap: {
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    typeIcon: {
        width: 44,
        height: 44
    },
    typeText: {
        marginTop: 8,
        color: "#1D1B20",
        fontWeight: "700"
    },
    pillBtn: {
        height: 40,
        borderRadius: 999,
        backgroundColor: "#580499E3",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    pillBtnText: {
        color: "#FFFFFF",
        fontWeight: "700"
    },
    selectedBar: {
        padding: 12,
        borderRadius: 18,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        height: "auto",
        flexWrap: "wrap",
    },
    selectedItem: {
        alignItems: "center",
        width: "20%"
    },
    selectedAvatar: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        backgroundColor: "#fff"
    },
    selectedText: {
        marginTop: 4,
        fontSize: 11,
        color: "#FFFFFF"
    },
    gridCard: {
        marginTop: 10,
        padding: 12,
        borderRadius: 18,
    },
    moodCell: {
        width: 62,
        alignItems: "center",
        marginVertical: 8,
        borderRadius: 14,
        paddingVertical: 6,
    },
    moodCellActive: {
        backgroundColor: "rgba(255,255,255,0.18)",
    },
    moodAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#fff"
    },
    moodLabel: {
        marginTop: 4,
        fontSize: 10,
        color: "#FFFFFF"
    },
    createHeaderCard: {
        marginTop: 8,
        padding: 12,
        borderRadius: 18,
        backgroundColor: "rgba(159, 177, 255, 0.25)",
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
    },
    formLabel: {
        color: "#0B0B0B",
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 6,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.7)",
        paddingVertical: Platform.OS === "ios" ? 10 : 6,
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 14,
    },
    logoCard: {
        width: 120,
        backgroundColor: "transparent",
        display: "flex", 
        flexDirection: "column",
        alignItems: "center"
    },
    logoBox: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: "#72A8FF",
        alignItems: "center",
        justifyContent: "center",
    },
    createBtn: {
        marginTop: 16,
        height: 44,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.75)",
        alignItems: "center",
        justifyContent: "center",
    },
    createBtnText: {
        color: "#1D1B20",
        fontWeight: "800"
    },
        iconPickerRow: {
        paddingVertical: 6,
        paddingHorizontal: 4,
        gap: 10,
    },
    iconOption: {
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.18)",
        marginRight: 8,
    },
    iconOptionActive: {
        backgroundColor: "#FFFFFF44",
    },
    iconOptionIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    iconOptionLabel: {
        marginTop: 4,
        fontSize: 11,
        color: "#FFFFFF",
    },
    colorPickerRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: 4,
        gap: 10,
    },
    colorDot: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
    },
    colorDotActive: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: "#FFFFFF",
        backgroundColor: "rgba(0,0,0,0.35)",
    },
});

export default styles;