import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import getMusicById, { IMusicDetail } from '../fetchAPI/getMusicById';
import { MiniPlayerRef } from '../Components/MiniPlayer';

interface PlayerContextType {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    progressVal: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    currentSong: IMusicDetail | null;
    playTrack: (songId: string) => Promise<void>;
    togglePlayPause: () => Promise<void>;
    seekTo: (value: number) => Promise<void>;
    miniPlayerRef: React.RefObject<MiniPlayerRef | null>;
    duration: number;
    position: number;
    setSoundVolume: (value: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progressVal, setProgress] = useState(0);
    const [currentSong, setCurrentSong] = useState<IMusicDetail | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [isFinished, setIsFinished] = useState(false); 
    const miniPlayerRef = useRef<MiniPlayerRef>(null);

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            playThroughEarpieceAndroid: false
        });
    }, []);

    const playTrack = async (songId: string) => {
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (!token) return;

            const songDetails = await getMusicById(songId, token);
            if (songDetails && songDetails.mp3_url) {
                if (sound) {
                    await sound.unloadAsync();
                }

                setCurrentSong(songDetails);
                setIsFinished(false); 
                console.log("Loading Sound:", songDetails.mp3_url);
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: songDetails.mp3_url },
                    { shouldPlay: true },
                    onPlaybackStatusUpdate
                );

                setSound(newSound);
                setIsPlaying(true);
            } else {
                console.warn("Bài hát không có MP3 URL hoặc không lấy được thông tin");
            }
        } catch (error) {
            console.error('Error playing track:', error);
        }
    };

    const togglePlayPause = async () => {
        if (!sound) return;
        if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
        } else {
            if (isFinished) {
                await sound.setPositionAsync(0);
                setIsFinished(false);
            }
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const seekTo = async (value: number) => {
        if (sound && duration) {
            const seekPosition = value * duration;
            await sound.setPositionAsync(seekPosition);
            if (isFinished) {
                await sound.playAsync();
                setIsPlaying(true);
                setIsFinished(false);
            }
        }
    };

    const setSoundVolume = async (value: number) => {
        if (sound) {
            await sound.setVolumeAsync(value);
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);
            
            if (status.durationMillis) {
                setProgress(status.positionMillis / status.durationMillis);
            }

            if (status.didJustFinish) {
                setIsPlaying(false);
                setIsFinished(true);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (sound) {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
        };
    }, [sound]);

    return (
        <PlayerContext.Provider value={{ 
            isPlaying, 
            setIsPlaying, 
            progressVal, 
            setProgress,
            currentSong,
            playTrack,
            togglePlayPause,
            seekTo,
            miniPlayerRef,
            duration,
            position,
            setSoundVolume,
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