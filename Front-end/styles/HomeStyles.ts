import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    }, 
    bgGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    contentWrapper: {
        flex: 1,
    },
    contentInner: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 200,
    },

    /* QUICK START CARD */
    quickStartWrapper: {
        marginBottom: 28,
    },
    quickStartCard: {
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.6)",
        shadowColor: "#000000",
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 6,
    },
    quickStartTopRow: {
        alignItems: "flex-start",
        justifyContent: "space-between",
        maxWidth: "40%",
    },
    quickStartLeftDown: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    quickStartLabel: {
        color: "white",
        fontSize: 20,
        fontWeight: 700,
        fontFamily: "Montserrat_700Bold",
    },
    playOuterCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    playInnerTriangle: {},
    quickStartBottomRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        maxWidth: "50%",
    },
    moodAvatarCircle: {
        width: 64, 
        height: 64,
        borderRadius: 32,
        backgroundColor: "#FFE082",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    moodAvatarImg: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    moodNameText: {
        color: "white",
        fontSize: 20,
        fontWeight: 700,
        marginLeft: 16,
        fontFamily: "Montserrat_700Bold",
    },

    /* SECTION TITLE */
    sectionTitle: {
        color: "white",
        fontSize: 24,
        fontWeight: "600",
        letterSpacing: 0.1,
        marginBottom: 12,
        fontStyle: "italic",
        lineHeight: 20,
        fontFamily: "Montserrat_700Bold",
    },

    /* RECENT PLAYLISTS*/
    playlistTitle: {
        marginTop: 8,
        fontSize: 14,
        color: "#FFFFFF",
        fontFamily: "Montserrat_700Bold",
    },

    /* PLACEHOLDERS */
    placeholderCard: {
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    placeholderGrid: {
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 12,
        padding: 16,
        minHeight: 150,
    },
    moodEmojiText: {
        fontSize: 40,
        textAlign: 'center',
    },
});

export default styles;