import { StyleSheet } from "react-native";

const RADIUS = 18;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#818BFF"
    },
    headerWrap: {
        paddingHorizontal: 16,
        paddingTop: 8
    },
    headerBlock: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 18,
    },
    sectionTitle: {
        color: "#000000",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "Montserrat_700Bold",
    },
    ownerName: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "700",
    },
    songRow: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(255,255,255,0.12)",
    },
    songCover: {
        width: 46,
        height: 46,
        borderRadius: RADIUS,
        marginRight: 12,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    songMeta: {
        flex: 1
    },
    songTitle: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
    songArtist: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 12,
        marginTop: 2
    },
    suggestionsMoodPlaylistTextBlock: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 10,
    },
    showMoreText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: 500,
        fontFamily: "Montserrat_400Regular",
        lineHeight: 22,
    },
    quickStartWrapper: {
        marginBottom: 28,
    },
    quickStartCard: {
        borderRadius: 24,
        paddingVertical: "2%",
        paddingHorizontal: "4%",
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
        maxWidth: "100%",
    },
    quickStartLeftDown: {
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    moodAvatarCircle: {
        width: 55, 
        height: 55,
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
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "Montserrat_700Bold",
        marginTop: 5,
    },
    suggestionsMoodPlaylistFlatList: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default styles;