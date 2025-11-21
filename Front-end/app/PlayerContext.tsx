// PlayerContext.tsx
import React, { createContext, useContext, useState } from "react";

interface PlayerState {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    progressVal: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    // Thêm các state khác nếu cần, như volume
}

const PlayerContext = createContext<PlayerState | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [progressVal, setProgress] = useState(0.25);
    return (
        <PlayerContext.Provider value={{ isPlaying, setIsPlaying, progressVal, setProgress }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) throw new Error("usePlayer must be used within PlayerProvider");
    return context;
};