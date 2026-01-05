const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface IMusic {
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

const getAllMusic = async (token: string): Promise<IMusic[] | null> => {
    try {
        console.log('--- [MUSIC API] Đang lấy danh sách tất cả bài hát... ---');
        const musicResponse = await fetch(`${BASE_URL}/api/music/music-list`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const musicText = await musicResponse.text();
        try {
            const responseJson = JSON.parse(musicText);
            if (musicResponse.ok) {
                if (Array.isArray(responseJson)) {
                    console.log(`[MUSIC API] Lấy thành công ${responseJson.length} bài hát!`);
                    return responseJson as IMusic[];
                } else {
                    console.warn('[MUSIC API] Response không phải là mảng:', responseJson);
                    return [];
                }
            } else {
                console.error('[MUSIC API] Server trả lỗi:', responseJson);
                return null;
            }
        } catch (e) {
            console.error('[MUSIC API] Lỗi Parse JSON Music. Raw:', musicText);
            return null;
        }
    } catch (error) {
        console.error('[MUSIC API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getAllMusic;