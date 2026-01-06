import { refreshTokenUse } from './loginAPI';

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface ISongPreview {
    songId: string;
    title: string;
    artist: string;
    image_url?: string;
}

export interface IRandomMoodResponse {
    success: boolean;
    data: ISongPreview[];
    mood?: string;
}

const getRandomSongsByMood = async (token: string, moodName: string): Promise<IRandomMoodResponse | null> => {
    const fetchRandomSongs = async (currentToken: string) => {
        const url = `${BASE_URL}/api/playlist/random-by-mood?moodName=${encodeURIComponent(moodName)}`;
        return await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            },
        });
    };

    try {
        console.log(`--- [MOOD API] Đang lấy nhạc theo mood: ${moodName}... ---`);

        let response = await fetchRandomSongs(token);
        if (response.status === 403) {
            console.warn('[MOOD API] Token hết hạn (403). Đang thử Refresh Token...');
            try {
                const newToken = await refreshTokenUse();
                if (newToken) {
                    console.log('[MOOD API] Refresh thành công. Đang gọi lại API...');
                    response = await fetchRandomSongs(newToken);
                } else {
                    console.error('[MOOD API] Refresh thất bại.');
                    return null;
                }
            } catch (refreshError) {
                console.error('[MOOD API] Lỗi khi refresh token:', refreshError);
                return null;
            }
        }

        const responseText = await response.text();
        try {
            const result = JSON.parse(responseText);
            if (response.ok) {
                const songCount = result.data ? result.data.length : 0;
                console.log(`[MOOD API] Thành công! Tìm thấy ${songCount} bài.`);
                return result as IRandomMoodResponse;
            } else {
                console.log(`[MOOD API] Lỗi HTTP ${response.status}:`, result);
                return null;
            }
        } catch (jsonError) {
            console.error('[MOOD API] Lỗi Parse JSON. Raw:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[MOOD API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getRandomSongsByMood;