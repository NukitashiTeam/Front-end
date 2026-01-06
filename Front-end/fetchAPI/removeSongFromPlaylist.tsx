import { IPlaylistDetail } from "./getPlaylistDetail"; 

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface ISong {
    songId: string;
    title: string;
    artist: string;
    addedAt: string;
}

interface RemoveSongResponse {
    message: string;
    data: IPlaylistDetail;
}

const removeSongFromPlaylist = async (token: string, playlistId: string, musicId: string): Promise<IPlaylistDetail | null> => {
    try {
        console.log(`--- [REMOVE SONG API] Đang xóa musicId: "${musicId}" khỏi playlist... ---`);

        const response = await fetch(`${BASE_URL}/api/playlist/music/${playlistId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ musicId: musicId }),
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[REMOVE SONG API] LỖI: Server trả về HTML. Kiểm tra lại Endpoint.');
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText) as RemoveSongResponse;

            if (response.ok) {
                if (responseJson.data) {
                    console.log(`[REMOVE SONG API] Thành công! Playlist giờ còn ${responseJson.data.songs.length} bài.`);
                    return responseJson.data;
                } else {
                    console.warn('[REMOVE SONG API] Server báo thành công nhưng thiếu data playlist mới.');
                    return null;
                }
            } else {
                if (response.status === 404) {
                    console.error('[REMOVE SONG API] Lỗi 404: Playlist không tồn tại hoặc bài hát không có trong playlist.');
                } else if (response.status === 403) {
                    console.error('[REMOVE SONG API] Lỗi 403: Bạn không phải chủ sở hữu.');
                } else {
                    console.error(`[REMOVE SONG API] Lỗi ${response.status}:`, responseJson);
                }
                return null;
            }
        } catch (e) {
            console.error('[REMOVE SONG API] Lỗi Parse JSON:', e);
            return null;
        }

    } catch (error) {
        console.error('[REMOVE SONG API] Lỗi hệ thống:', error);
        return null;
    }
};

export default removeSongFromPlaylist;