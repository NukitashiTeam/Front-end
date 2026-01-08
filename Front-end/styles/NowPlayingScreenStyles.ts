import { StyleSheet } from "react-native";

const PURPLE = "#4A2F7C";
const LAVENDER = "#EADDFF";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PURPLE,
        paddingHorizontal: 16,
    },
    switchHitSlop: {
        padding: 2,
        marginRight: 2,
    },
    fakeSwitchTrack: {
        width: 42,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        justifyContent: "center",
        paddingHorizontal: 3,
    },
    fakeSwitchTrackOn: {
        backgroundColor: LAVENDER,
    },
    fakeSwitchThumb: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#fff",
    },
    fakeSwitchThumbOn: {
        transform: [{ translateX: 18 }],
    },

    artWrapper: {
        width: "100%",
        aspectRatio: 1,
        maxHeight: "45%",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#111",
        alignSelf: "center",
    },
    artImage: {
        width: "100%",
        height: "100%",
    },

    /* TITLE ROW */
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10, 
    },
    titleCenter: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: 10,
    },
    songTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    songSubtitle: {
        color: "rgba(255, 255, 255, 0.7)",
        marginTop: 4,
        fontSize: 14,
        textAlign: "center",
    },

    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    smallIconBtn: {
        padding: 10,
        borderRadius: 999,
        backgroundColor: "transparent",
    },
    transportRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20, 
    },
    playBtn: {
        width: 60, 
        height: 60,
        borderRadius: 30,
        backgroundColor: LAVENDER,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    /* SLIDERS */
    slidersBlock: {
        justifyContent: 'flex-end',
    },
    progressSliderContainer: {
        marginBottom: 5, 
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    volumeIconContainer: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    muteSlash: {
        position: 'absolute',
        width: "100%",
        height: 2,
        backgroundColor: "#EADDFF",
        transform: [{ rotate: "-45deg" }]
    },
    volumeSliderContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 5,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    sliderContainer: {
        flex: 1,
        height: 40,
        marginHorizontal: 10,
    },
    sliderTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(232, 222, 248, 0.3)',
    },
    sliderMinTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EADDFF',
    },
    sliderThumb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    timeText: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
        width: 40,
        textAlign: "center",
    },
});

export default styles;