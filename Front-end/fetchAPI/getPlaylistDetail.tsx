import { refreshTokenUse } from './loginAPI';

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface ISong {
    songId: string;
    title: string;
    artist: string;
    addedAt: string;
    image_url?: string;
}

export interface IPlaylistDetail {
    _id: string;
    title: string;
    thumbnail?: string;
    description?: string;
    type?: string;
    mood?: string;
    context?: string;
    songs: ISong[];
    owner?: string | { _id: string, avatar: string };
    isPublic?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const getPlaylistDetail = async (token: string, playlistId: string): Promise<IPlaylistDetail | null> => {
    const fetchDetail = async (currentToken: string) => {
        return await fetch(`${BASE_URL}/api/playlist/detail/${playlistId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            },
        });
    };

    try {
        console.log(`--- [PLAYLIST DETAIL API] Đang lấy chi tiết playlist ID: ${playlistId}... ---`);
        
        let response = await fetchDetail(token);
        if (response.status === 403) {
            console.warn('[PLAYLIST DETAIL API] Token hết hạn (403). Đang thử Refresh Token...');
            
            try {
                const newToken = await refreshTokenUse();
                if (newToken) {
                    console.log('[PLAYLIST DETAIL API] Refresh thành công. Đang gọi lại API...');
                    response = await fetchDetail(newToken);
                } else {
                    console.error('[PLAYLIST DETAIL API] Refresh Token thất bại. Không thể lấy dữ liệu.');
                    return null;
                }
            } catch (refreshError) {
                console.error('[PLAYLIST DETAIL API] Lỗi trong quá trình Refresh Token:', refreshError);
                return null;
            }
        }

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[PLAYLIST DETAIL API] LỖI: Server trả về HTML (có thể sai URL hoặc lỗi Server 500).');
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText);
            if (response.ok) {
                if (responseJson && (responseJson._id || responseJson.data)) {
                    const finalData = responseJson.data || responseJson;
                    console.log(`[PLAYLIST DETAIL API] Thành công! Playlist: "${finalData.title}"`);
                    return finalData as IPlaylistDetail;
                } else {
                    console.warn('[PLAYLIST DETAIL API] JSON trả về thiếu dữ liệu quan trọng:', JSON.stringify(responseJson, null, 2));
                    return null;
                }
            } else {
                console.error(`[PLAYLIST DETAIL API] Server trả lỗi HTTP ${response.status}:`, responseJson);
                return null;
            }
        } catch (e) {
            console.error('[PLAYLIST DETAIL API] Lỗi Parse JSON. Raw:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[PLAYLIST DETAIL API] Lỗi hệ thống (Network request failed):', error);
        return null;
    }
};

export default getPlaylistDetail;