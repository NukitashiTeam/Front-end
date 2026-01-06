import React, { createContext, useContext, useState, ReactNode, useRef, useEffect, useCallback, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import getMusicById, { IMusicDetail } from '../fetchAPI/getMusicById';
import { MiniPlayerRef } from '../Components/MiniPlayer';

type ProgressCallback = (position: number, duration: number) => void;

interface PlayerContextType {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    currentSong: IMusicDetail | null;
    playTrack: (song: string | IMusicDetail) => Promise<void>; 
    togglePlayPause: () => Promise<void>;
    seekTo: (value: number) => Promise<void>;
    miniPlayerRef: React.RefObject<MiniPlayerRef | null>;
    setSoundVolume: (value: number) => Promise<void>;
    subscribeToProgress: (callback: ProgressCallback) => () => void;
    getCurrentProgress: () => { position: number, duration: number };
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState<IMusicDetail | null>(null);
    const [isFinished, setIsFinished] = useState(false); 
    
    const miniPlayerRef = useRef<MiniPlayerRef>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const playRequestRef = useRef<number>(0);

    const progressRef = useRef({ position: 0, duration: 0 });
    const subscribersRef = useRef<ProgressCallback[]>([]);

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

    const subscribeToProgress = useCallback((callback: ProgressCallback) => {
        subscribersRef.current.push(callback);
        return () => {
            subscribersRef.current = subscribersRef.current.filter(cb => cb !== callback);
        };
    }, []);

    const getCurrentProgress = useCallback(() => {
        return progressRef.current;
    }, []);

    const onPlaybackStatusUpdate = useCallback((status: any) => {
        if (status.isLoaded) {
            progressRef.current = {
                position: status.positionMillis || 0,
                duration: status.durationMillis || 0
            };

            subscribersRef.current.forEach(callback => {
                callback(progressRef.current.position, progressRef.current.duration);
            });

            if (status.didJustFinish) {
                setIsPlaying(false);
                setIsFinished(true);
            }
        }
    }, []);

    const playTrack = useCallback(async (input: string | IMusicDetail) => {
        const currentRequestId = ++playRequestRef.current;
        try {
            if (typeof input !== 'string') {
                setCurrentSong(input);
                setIsPlaying(true);
                setIsFinished(false);
            }

            let songDetails: IMusicDetail | null = null;
            if (typeof input === 'string') {
                const token = await SecureStore.getItemAsync('accessToken');
                if (!token) return;
                songDetails = await getMusicById(input, token);
                if (songDetails) setCurrentSong(songDetails);
            } else {
                songDetails = input;
            }

            if (playRequestRef.current !== currentRequestId) return;

            if (songDetails && songDetails.mp3_url) {
                if (soundRef.current) {
                    try {
                        await soundRef.current.unloadAsync(); 
                    } catch (e) { console.log(e); }
                }

                if (playRequestRef.current !== currentRequestId) return;

                progressRef.current = { position: 0, duration: 0 };
                subscribersRef.current.forEach(cb => cb(0, 0));
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: songDetails.mp3_url },
                    { shouldPlay: false, progressUpdateIntervalMillis: 500 },
                    onPlaybackStatusUpdate
                );

                if (playRequestRef.current !== currentRequestId) {
                    await newSound.unloadAsync(); 
                    return;
                }

                soundRef.current = newSound;
                await newSound.playAsync();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error playing track:', error);
            setIsPlaying(false);
        }
    }, [onPlaybackStatusUpdate]);

    const togglePlayPause = useCallback(async () => {
        if (!soundRef.current) return;
        if (isPlaying) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
        } else {
            if (isFinished) {
                await soundRef.current.setPositionAsync(0);
                setIsFinished(false);
            }
            await soundRef.current.playAsync();
            setIsPlaying(true);
        }
    }, [isPlaying, isFinished]);

    const seekTo = useCallback(async (value: number) => {
        const currentDuration = progressRef.current.duration;
        if (soundRef.current && currentDuration) {
            const seekPosition = value * currentDuration;
            await soundRef.current.setPositionAsync(seekPosition);
            progressRef.current.position = seekPosition;
            subscribersRef.current.forEach(cb => cb(seekPosition, currentDuration));

            if (isFinished) {
                await soundRef.current.playAsync();
                setIsPlaying(true);
                setIsFinished(false);
            }
        }
    }, [isFinished]);

    const setSoundVolume = useCallback(async (value: number) => {
        if (soundRef.current) {
            await soundRef.current.setVolumeAsync(value);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (soundRef.current) soundRef.current.unloadAsync();
        };
    }, []);

    const contextValue = useMemo(() => ({
        isPlaying, 
        setIsPlaying, 
        currentSong,
        playTrack,
        togglePlayPause,
        seekTo,
        miniPlayerRef,
        setSoundVolume,
        subscribeToProgress,
        getCurrentProgress  
    }), [isPlaying, currentSong, playTrack, togglePlayPause, seekTo, setSoundVolume, subscribeToProgress, getCurrentProgress]);

    return (
        <PlayerContext.Provider value={contextValue}>
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