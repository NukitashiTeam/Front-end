const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface IPlaylist {
    _id: string;
    title: string;
    thumbnail?: string;
    owner?: string;
    type?: string;
}

interface ServerResponse {
    success: boolean;
    data: IPlaylist[];
}

const getAllPlaylist = async (token: string): Promise<IPlaylist[] | null> => {
    try {
        console.log('--- [PLAYLIST API] Đang lấy danh sách Playlist... ---');

        const playlistResponse = await fetch(`${BASE_URL}/api/playlist/user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json', 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const playlistText = await playlistResponse.text();
        
        try {
            const responseJson = JSON.parse(playlistText) as ServerResponse;
            if (playlistResponse.ok) {
                if (responseJson.data && Array.isArray(responseJson.data)) {
                    console.log(`[PLAYLIST API] Lấy thành công ${responseJson.data.length} playlist!`);
                    return responseJson.data;
                } else {
                    console.log('[PLAYLIST API] Không tìm thấy mảng data trong response');
                    return [];
                }
            } else {
                console.error('[PLAYLIST API] Server trả lỗi:', responseJson);
                return null;
            }
        } catch (e) {
            console.error('[PLAYLIST API] Lỗi Parse JSON Playlist. Raw:', playlistText);
            return null;
        }

    } catch (error) {
        console.error('[PLAYLIST API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getAllPlaylist;