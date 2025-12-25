import { refreshTokenUse } from './loginAPI';

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface ISongInput {
    songId: string;
    title: string;
    artist: string;
    image_url?: string;
}

export interface ISavedPlaylistData {
    _id: string;
    title: string;
    thumbnail?: string;
    type?: string;
    owner?: string;
    isPublic?: boolean;
    createdAt?: string;
    updatedAt?: string;
    songs: any[];
}

export interface ISavePlaylistResponse {
    success: boolean;
    message: string;
    data: ISavedPlaylistData;
}

const saveRandomMoodPlaylist = async (
    token: string, 
    title: string, 
    songs: ISongInput[]
): Promise<ISavePlaylistResponse | null> => {
    const callApi = async (currentToken: string) => {
        return await fetch(`${BASE_URL}/api/playlist/save-random-mood`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                songs: songs
            }),
        });
    };

    try {
        console.log(`--- [SAVE PLAYLIST API] Đang lưu playlist: "${title}" (${songs.length} bài)... ---`);

        let response = await callApi(token);
        if (response.status === 403 || response.status === 401) {
            console.warn(`[SAVE PLAYLIST API] Token hết hạn (${response.status}). Đang thử Refresh Token...`);
            try {
                const newToken = await refreshTokenUse();
                if (newToken) {
                    console.log('[SAVE PLAYLIST API] Refresh thành công. Đang gọi lại lệnh Lưu...');
                    response = await callApi(newToken);
                } else {
                    console.warn('[SAVE PLAYLIST API] Refresh thất bại. Hủy thao tác.');
                    return null;
                }
            } catch (refreshError) {
                console.warn('[SAVE PLAYLIST API] Lỗi quá trình refresh token:', refreshError);
                return null;
            }
        }

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[SAVE PLAYLIST API] LỖI: Server trả về HTML. Kiểm tra Endpoint.');
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText);
            if (response.ok) {
                const result = responseJson as ISavePlaylistResponse;
                if (result.success) {
                    console.log(`[SAVE PLAYLIST API] Thành công! ID Mới: ${result.data._id}`);
                    return result;
                } else {
                    console.warn('[SAVE PLAYLIST API] Server xử lý thất bại:', result.message);
                    return null;
                }
            } else {
                console.error(`[SAVE PLAYLIST API] Lỗi HTTP ${response.status}:`, responseJson);
                return null;
            }
        } catch (e) {
            console.error('[SAVE PLAYLIST API] Lỗi Parse JSON:', e);
            console.log('Raw text:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[SAVE PLAYLIST API] Lỗi hệ thống:', error);
        return null;
    }
};

export default saveRandomMoodPlaylist;