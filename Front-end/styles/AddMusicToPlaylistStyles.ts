import { StyleSheet } from "react-native";

const localStyles = StyleSheet.create({
    songCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12
    },
    songInfo: {
        flex: 1,
        justifyContent: 'center'
    },
    songTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },
    songArtist: {
        color: '#E0E0E0',
        fontSize: 14,
        opacity: 0.8
    }
});

export default localStyles;