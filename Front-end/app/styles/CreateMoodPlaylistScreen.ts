import { StyleSheet } from "react-native";

const RADIUS = 18;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#6E5ED1"
    },
    headerWrap: {
        paddingHorizontal: 16,
        paddingTop: 8
    },
    backBtn: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "transparent",
        marginLeft: "4%",
    },

    headerBlock: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 6,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },

    playlistHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    ownerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        backgroundColor: "rgba(255,255,255,0.35)",
    },
    ownerName: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    iconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.25)",
    },
    playCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        marginLeft: 12,
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
    bottomWrap: {
        position: "fixed",
        bottom: "1%",
        left: 0,
        right: 0,
        paddingHorizontal: 12,
    },
});

export default styles;