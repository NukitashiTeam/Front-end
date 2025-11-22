import { StyleSheet,Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#818BFF"
    },
    headerWrap: {
        paddingHorizontal: "3%",
        paddingTop: 8
    },
    choosingMoodPlayTextContainer: {
        width: "100%",
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    choosingMoodPlayTitleStyle: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 24,
    },
    choosingMoodPlayTextStyle: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 16,
        width: "80%",
        textAlign: "center",
    },
    flatListContent: {
        paddingTop: 20,
        paddingBottom: 50,
    },
    gridItemContainer: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        marginBottom: 30,
    },
    moodCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFD54F',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    moodImage: {
        width: '100%',
        height: '100%',
    },
    moodName: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'Montserrat_700Bold',
        fontWeight: 'bold',
    }
});

export default styles;