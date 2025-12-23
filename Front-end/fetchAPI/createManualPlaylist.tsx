const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface INewPlaylist {
    _id: string;
    title: string;
    thumbnail?: string;
    description?: string;
    type?: string;
    mood?: string;
    context?: string;
    owner?: string;
    isPublic?: boolean;
    createdAt?: string;
    updatedAt?: string;
    songs?: any[];
}

interface CreateResponse {
    success: boolean;
    playlist: INewPlaylist;
}

const createManualPlaylist = async (token: string, title: string): Promise<INewPlaylist | null> => {
    try {
        console.log(`--- [CREATE PLAYLIST API] Đang tạo playlist: "${title}"... ---`);

        const response = await fetch(`${BASE_URL}/api/playlist/manual-playlist`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: title }),
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[CREATE PLAYLIST API] LỖI: Server trả về HTML. Kiểm tra lại Endpoint.');
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText);

            if (response.ok) {
                const resultData = responseJson as CreateResponse;
                if (resultData.success && resultData.playlist) {
                    console.log(`[CREATE PLAYLIST API] Thành công! ID: ${resultData.playlist._id}`);
                    return resultData.playlist;
                } else {
                    console.warn('[CREATE PLAYLIST API] Server báo thành công nhưng không tìm thấy object playlist:', resultData);
                    return null;
                }
            } else {
                console.error(`[CREATE PLAYLIST API] Lỗi HTTP ${response.status}:`, responseJson);
                return null;
            }
        } catch (e) {
            console.error('[CREATE PLAYLIST API] Lỗi Parse JSON:', e);
            console.log('Raw text nhận được:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[CREATE PLAYLIST API] Lỗi hệ thống:', error);
        return null;
    }
};

export default createManualPlaylist;