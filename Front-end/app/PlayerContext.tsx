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
    queue: IMusicDetail[];
    currentIndex: number;
    playTrack: (song: string | IMusicDetail) => Promise<void>; 
    playList: (list: IMusicDetail[], startIndex?: number) => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
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
    const [queue, setQueue] = useState<IMusicDetail[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [isFinished, setIsFinished] = useState(false); 
    
    const miniPlayerRef = useRef<MiniPlayerRef>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const playRequestRef = useRef<number>(0);
    
    const queueRef = useRef<IMusicDetail[]>([]);
    const currentIndexRef = useRef<number>(-1);

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

    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        let isMounted = true;
        if (isFinished && isMounted) {
            setIsFinished(false);
            playNext();
        }
        return () => { isMounted = false; };
    }, [isFinished]);
    
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
                setIsFinished(true);
            }
        } else if (status.error) {
            console.error(`Player Error: ${status.error}`);
        }
    }, []);

    // --- SỬA LỖI TẠI ĐÂY ---
    const playTrack = useCallback(async (input: string | IMusicDetail, keepQueue: boolean = false) => {
        const currentRequestId = ++playRequestRef.current;
        try {
            let songDetails: IMusicDetail | null = null;
            const token = await SecureStore.getItemAsync('accessToken');

            if (typeof input === 'string') {
                // Trường hợp 1: Input là ID string -> Gọi API lấy full thông tin
                if (!token) return;
                songDetails = await getMusicById(input, token);
            } else {
                // Trường hợp 2: Input là Object (từ Queue hoặc Playlist)
                songDetails = input;

                // KIỂM TRA QUAN TRỌNG:
                // Nếu object này không có mp3_url (hoặc rỗng), ta phải gọi API để lấy link nhạc chuẩn
                if ((!songDetails.mp3_url || songDetails.mp3_url === "") && token) {
                    console.log(`[PlayerContext] Bài hát "${songDetails.title}" thiếu link nhạc. Đang tải chi tiết...`);
                    const songId = songDetails._id || songDetails.track_id;
                    const fullDetails = await getMusicById(songId, token);
                    
                    if (fullDetails) {
                        // Gộp thông tin mới lấy được vào object hiện tại
                        songDetails = { ...songDetails, ...fullDetails };
                    }
                }
            }

            if (!songDetails) return;

            // Cập nhật UI ngay lập tức
            setCurrentSong(songDetails);
            setIsPlaying(true);
            setIsFinished(false);

            if (!keepQueue) {
                setQueue([songDetails]);
                setCurrentIndex(0);
            }

            // Unload nhạc cũ
            if (soundRef.current) {
                try {
                    await soundRef.current.unloadAsync(); 
                } catch (e) {
                    console.log('Unload Error:', e);
                }
            }

            // Kiểm tra race condition (nếu người dùng bấm bài khác nhanh quá)
            if (playRequestRef.current !== currentRequestId) return;

            progressRef.current = { position: 0, duration: 0 };
            subscribersRef.current.forEach(cb => cb(0, 0));

            // Phát nhạc
            if (songDetails.mp3_url) {
                console.log(`[PlayerContext] Đang phát: ${songDetails.title}`);
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
            } else {
                console.warn('Song has no MP3 URL:', songDetails.title);
                setIsFinished(true); // Tự động next nếu lỗi link
            }
        } catch (error) {
            console.error('Error playing track:', error);
            setIsPlaying(false);
        }
    }, [onPlaybackStatusUpdate]);

    const playList = useCallback(async (list: IMusicDetail[], startIndex: number = 0) => {
        if (!list || list.length === 0) return;
        setQueue(list);
        setCurrentIndex(startIndex);
        // Gọi playTrack với object từ list, playTrack sẽ tự lo việc fetch link nếu thiếu
        await playTrack(list[startIndex], true);
    }, [playTrack]);

    const playNext = useCallback(async () => {
        const currentQueue = queueRef.current;
        const cIndex = currentIndexRef.current;
        if (currentQueue.length === 0) return;
        const nextIndex = (cIndex + 1) % currentQueue.length;
        setCurrentIndex(nextIndex);
        await playTrack(currentQueue[nextIndex], true);
    }, [playTrack]);

    const playPrevious = useCallback(async () => {
        const currentQueue = queueRef.current;
        const cIndex = currentIndexRef.current;
        if (currentQueue.length === 0) return;
        const prevIndex = (cIndex - 1 + currentQueue.length) % currentQueue.length;
        setCurrentIndex(prevIndex);
        await playTrack(currentQueue[prevIndex], true);
    }, [playTrack]);

    const togglePlayPause = useCallback(async () => {
        if (!soundRef.current) {
            if (currentSong) {
                await playTrack(currentSong, true);
            }
            return;
        }

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
    }, [isPlaying, isFinished, currentSong, playTrack]);

    const seekTo = useCallback(async (value: number) => {
        const currentDuration = progressRef.current.duration;
        if (soundRef.current && currentDuration) {
            const seekPosition = value * currentDuration;
            await soundRef.current.setPositionAsync(seekPosition);
            progressRef.current.position = seekPosition;
            subscribersRef.current.forEach(cb => cb(seekPosition, currentDuration));

            if (!isPlaying) {
                await soundRef.current.playAsync();
                setIsPlaying(true);
                setIsFinished(false);
            }
        }
    }, [isPlaying]);

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
        queue,
        currentIndex,
        playTrack,
        playList,
        playNext,
        playPrevious,
        togglePlayPause,
        seekTo,
        miniPlayerRef,
        setSoundVolume,
        subscribeToProgress,
        getCurrentProgress  
    }), [
        isPlaying, currentSong, queue, currentIndex, 
        playTrack, playList, playNext, playPrevious, 
        togglePlayPause, seekTo, setSoundVolume, 
        subscribeToProgress, getCurrentProgress
    ]);

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