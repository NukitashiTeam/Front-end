const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface IMusicDetail {
    track_id: string;
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    mp3_url: string;
    image_url: string;
    is_premium?: boolean;
    release_date?: string;
    mood?: string;
}

const getMusicById = async (id: string, token: string): Promise<IMusicDetail | null> => {
    try {
        console.log(`--- [MUSIC DETAIL API] Đang lấy thông tin bài hát ID: ${id}... ---`);
        if (!id) {
            console.error('[MUSIC DETAIL API] Lỗi: ID bài hát không hợp lệ hoặc bị rỗng.');
            return null;
        }

        const response = await fetch(`${BASE_URL}/api/music/music-by-id/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        try {
            const responseJson = JSON.parse(responseText);
            if (response.ok) {
                if (responseJson && typeof responseJson === 'object' && !Array.isArray(responseJson)) {
                    console.log(`[MUSIC DETAIL API] Lấy thành công bài hát: ${responseJson.title}`);
                    return responseJson as IMusicDetail;
                } else {
                    console.warn('[MUSIC DETAIL API] Format dữ liệu trả về không đúng (mong đợi Object):', responseJson);
                    return null;
                }
            } else {
                if (response.status === 404) {
                    console.error('[MUSIC DETAIL API] Không tìm thấy bài hát (404).');
                } else {
                    console.error(`[MUSIC DETAIL API] Server trả lỗi (${response.status}):`, responseJson);
                }
                return null;
            }
        } catch (e) {
            console.error('[MUSIC DETAIL API] Lỗi Parse JSON. Raw:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[MUSIC DETAIL API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getMusicById;