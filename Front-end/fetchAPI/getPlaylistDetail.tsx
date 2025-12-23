const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface ISong {
    songId: string;
    title: string;
    artist: string;
    addedAt: string;
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
    try {
        console.log(`--- [PLAYLIST DETAIL API] Đang lấy chi tiết playlist ID: ${playlistId}... ---`);
        const response = await fetch(`${BASE_URL}/api/playlist/detail/${playlistId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[PLAYLIST DETAIL API] LỖI: Server trả về HTML.');
            return null;
        }

        try {
            const responseData = JSON.parse(responseText) as IPlaylistDetail;
            if (response.ok) {
                if (responseData && responseData._id) {
                    console.log(`[PLAYLIST DETAIL API] Thành công! Playlist: "${responseData.title}"`);
                    return responseData;
                } else {
                    console.warn('[PLAYLIST DETAIL API] JSON trả về không có _id, có thể lỗi format:', JSON.stringify(responseData, null, 2));
                    return null;
                }
            } else {
                console.error('[PLAYLIST DETAIL API] Server trả lỗi HTTP:', response.status);
                return null;
            }
        } catch (e) {
            console.error('[PLAYLIST DETAIL API] Lỗi Parse JSON. Raw:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[PLAYLIST DETAIL API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getPlaylistDetail;