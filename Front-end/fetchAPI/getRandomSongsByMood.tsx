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
    title: string;
    songs: ISongPreview[];
    isTemporary: boolean;
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
        console.log(`--- [MOOD API] Đang lấy nhạc theo mood: "${moodName}"... ---`);

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
            const data = JSON.parse(responseText);
            if (response.ok) {
                console.log(`[MOOD API] Thành công! Tìm thấy ${data.songs?.length || 0} bài.`);
                return data as IRandomMoodResponse;
            } else {
                console.error(`[MOOD API] Lỗi HTTP ${response.status}:`, data);
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