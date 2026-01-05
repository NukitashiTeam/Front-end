import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import getMusicById, { IMusicDetail } from '../fetchAPI/getMusicById';
import { MiniPlayerRef } from '../Components/MiniPlayer';

interface PlayerContextType {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    progressVal: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    currentSong: IMusicDetail | null;
    playTrack: (songId: string) => Promise<void>;
    miniPlayerRef: React.RefObject<MiniPlayerRef | null>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);
export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progressVal, setProgress] = useState(0);
    const [currentSong, setCurrentSong] = useState<IMusicDetail | null>(null);
    const miniPlayerRef = useRef<MiniPlayerRef>(null);
    const playTrack = async (songId: string) => {
        try {
            setIsPlaying(false);
            const token = await SecureStore.getItemAsync('accessToken');
            if (!token) {
                console.warn('No access token found');
                return;
            }

            const songDetails = await getMusicById(songId, token);
            if (songDetails) {
                setCurrentSong(songDetails);
                setIsPlaying(true);
                console.log('Now playing:', songDetails.title);
            }
        } catch (error) {
            console.error('Error playing track:', error);
        }
    };

    return (
        <PlayerContext.Provider value={{ 
            isPlaying, 
            setIsPlaying, 
            progressVal, 
            setProgress,
            currentSong,
            playTrack,
            miniPlayerRef
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};