import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    /* MINI PLAYER STUB */
    miniPlayerStub: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    miniBg: {
        paddingTop: "2%",
        paddingBottom: "20%",
        paddingHorizontal: "4%",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowRadius: 10,
        elevation: 10
    },
    miniHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    miniTitle: {
        textAlign: "center",
        color: "white",
        fontSize: 22,
        fontFamily: "Montserrat_700Bold",
        marginTop: 4,
    },
    miniSubtitle: {
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 14,
        fontStyle: "italic",
        marginTop: 4,
    },
    miniControlRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
        gap: 10,
    },
    miniIconBtn: {
        padding: 6
    },
    miniProgressRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        marginTop: 4,
    },
    progressTrack: {
        flex: 1,
        height: 14,
        backgroundColor: "#E8DEF8",
        borderRadius: 999,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#6750A4",
        borderRadius: 999,
    },
    miniDivider: {
        width: 8,
        height: 26,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        marginHorizontal: 10,
    },
    miniTimeText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
        width: 40,
        textAlign: 'center',
    },
    miniSliderContainer: {
        flex: 1,
        height: 30,
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    miniSliderTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E8DEF8',
    },
    miniSliderMinTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6750A4',
    },
    miniSliderThumb: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FFFFFF',
    },
});

export default styles;