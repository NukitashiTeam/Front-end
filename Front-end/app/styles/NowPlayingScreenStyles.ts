import { StyleSheet } from "react-native";

const PURPLE = "#4A2F7C";
const PURPLE_DARK = "#3A2366";
const LAVENDER = "#EADDFF";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PURPLE,
        paddingHorizontal: 16,
        flexDirection: "column",
        justifyContent: "space-between",
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
        transform: [{
            translateX: 0,
        }],
    },
    fakeSwitchThumbOn: {
        transform: [{
            translateX: 18,
        }],
    },

    /* ART */
    artWrapper: {
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#111",
        height: "60%",
        marginBottom: 16,
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
        marginBottom: 8,
    },
    titleCenter: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    songTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    songSubtitle: {
        color: "rgba(255, 255, 255, 0.7)",
        marginTop: 2,
        fontSize: 12,
    },

    /* TRANSPORT & ACTIONS */
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
        marginBottom: 10,
    },
    smallIconBtn: {
        padding: 8,
        borderRadius: 999,
        backgroundColor: "transparent",
    },
    transportRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 22 as any,
    },
    playBtn: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: LAVENDER,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6,
    },
    miniProgressRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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

    /* SLIDERS */
    slidersBlock: {
        marginTop: 6,
        marginBottom: 16,
    },
    progressSliderContainer: {
        marginBottom: 12, 
    },
    volumeIconContainer: {
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    muteSlash: {
        position: 'absolute',
        width: "120%",
        height: 2,
        backgroundColor: "#EADDFF",
        transform: [
            { rotate: "-45deg" }
        ]
    },
    volumeSliderContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
    },
    slider: {
        flex: 1,
        height: 30,
    },
    sliderContainer: {
        flex: 1,
        height: 30, 
    },
    sliderTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E8DEF8',
    },
    sliderMinTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6750A4',
    },
    sliderThumb: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: -8,
    },
    timeText: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
    },
});

export default styles;