import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const GAP = 12;
const PADDING_H = 16;
const ITEM_WIDTH = (width - (PADDING_H * 2) - (GAP * 2)) / 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#818BFF"
    },
    headerTopWrap: {
        paddingHorizontal: "3%",
        paddingTop: 8,
        zIndex: 10,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginTop: 10,
        marginBottom: 16,
        position: 'relative',
        height: 40,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        padding: 4,
    },
    screenTitle: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 20,
        color: "#000",
        textAlign: 'center',
    },

    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        color: "#333",
        height: '100%',
    },

    flatListContent: {
        paddingHorizontal: PADDING_H,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    cardContainer: {
        width: ITEM_WIDTH,
        alignItems: 'center',
    },
    cardBox: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    cardIcon: {
        marginBottom: 4,
        fontSize: 64,
    },
    cardTitleInside: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 13,
        color: "#2E266F",
        textAlign: "center",
    },
    cardLabelOutside: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        color: "#FFFFFF",
        textAlign: "center",
        width: "100%",
        fontWeight: "bold",
    },

    createButtonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 20,
    },
    createButton: {
        backgroundColor: '#D1D5DB',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    createButtonText: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
        color: "#000",
    }
});

export default styles;