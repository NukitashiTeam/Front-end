import AsyncStorage from '@react-native-async-storage/async-storage';

export const RECENT_SONGS_KEY = 'RECENT_PLAYED_SONGS_HISTORY';

export const addToHistory = async (song: any) => {
    try {
        const savedSongs = await AsyncStorage.getItem(RECENT_SONGS_KEY);
        let currentList = savedSongs ? JSON.parse(savedSongs) : [];
        const normalizedSong = {
            ...song,
            track_id: song.track_id || song.songId || song._id,
            _id: song._id || song.songId || song.track_id,
            image_url: song.image_url || song.cover,
        };

        currentList = currentList.filter((item: any) => 
            (item.track_id && item.track_id !== normalizedSong.track_id) && 
            (item._id && item._id !== normalizedSong._id)
        );

        currentList.unshift(normalizedSong);
        if (currentList.length > 10) {
            currentList = currentList.slice(0, 10);
        }

        await AsyncStorage.setItem(RECENT_SONGS_KEY, JSON.stringify(currentList));
        console.log(`Saved to history: ${normalizedSong.title}`);
    } catch (error) {
        console.error("Failed to save history helper", error);
    }
};