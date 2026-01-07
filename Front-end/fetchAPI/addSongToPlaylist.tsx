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

interface AddSongResponse {
    success: boolean;
    data: IPlaylistDetail;
}

const addSongToPlaylist = async (token: string, playlistId: string, musicId: string): Promise<IPlaylistDetail | null> => {
    try {
        console.log(`--- [ADD SONG API] Đang thêm musicId: "${musicId}" vào playlistId: "${playlistId}" ---`);
        const ENDPOINT = `${BASE_URL}/api/playlist/new-music/${playlistId}`;
        const response = await fetch(ENDPOINT, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ musicId: musicId }),
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[ADD SONG API] LỖI: Server trả về HTML. Kiểm tra lại Endpoint hoặc Method (PATCH).');
            console.log('Response status:', response.status);
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText) as AddSongResponse;
            if (response.ok) {
                if (responseJson) {
                    const resultData = responseJson.data || responseJson; 
                    if (resultData) {
                         console.log(`[ADD SONG API] Thành công!`);
                         return resultData as IPlaylistDetail;
                    }
                }
                console.warn('[ADD SONG API] Server OK nhưng không có dữ liệu trả về.');
                return null; 
            } else {
                if (response.status === 401) {
                    console.error('[ADD SONG API] Lỗi 401: Token không hợp lệ hoặc hết hạn.');
                } else if (response.status === 403) {
                    console.error('[ADD SONG API] Lỗi 403: Token hết hạn hoặc không có quyền sở hữu playlist.');
                } else if (response.status === 404) {
                    console.error('[ADD SONG API] Lỗi 404: Không tìm thấy bài hát hoặc playlist.');
                } else {
                    console.error(`[ADD SONG API] Lỗi ${response.status}:`, responseJson);
                }
                return null;
            }
        } catch (e) {
            console.error('[ADD SONG API] Lỗi Parse JSON:', e);
            console.log('Raw text:', responseText);
            return null;
        }

    } catch (error) {
        console.error('[ADD SONG API] Lỗi hệ thống:', error);
        return null;
    }
};

export default addSongToPlaylist;