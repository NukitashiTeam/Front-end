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
    owner?: string;
    isPublic?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface ServerResponse {
    success: boolean;
    data: IPlaylistDetail | IPlaylistDetail[];
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
            console.error('[PLAYLIST DETAIL API] LỖI: Server trả về HTML. Kiểm tra lại ID hoặc Endpoint.');
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText) as ServerResponse;

            if (response.ok) {
                let resultData: IPlaylistDetail | null = null;

                if (Array.isArray(responseJson.data)) {
                    if (responseJson.data.length > 0) {
                        resultData = responseJson.data[0];
                    }
                } else if (responseJson.data) {
                    resultData = responseJson.data;
                }

                if (resultData) {
                    console.log(`[PLAYLIST DETAIL API] Thành công! Playlist: "${resultData.title}" có ${resultData.songs?.length || 0} bài hát.`);
                    return resultData;
                } else {
                    console.warn('[PLAYLIST DETAIL API] Không tìm thấy dữ liệu playlist trong response.');
                    return null;
                }
            } else {
                console.error('[PLAYLIST DETAIL API] Server trả lỗi:', responseJson);
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