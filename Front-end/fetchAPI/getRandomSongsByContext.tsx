const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface ISongContextItem {
    songId: string;
    title: string;
    artist: string;
    image_url?: string; 
}

export interface IContextResponse {
    success: boolean;
    context: string;
    data: ISongContextItem[];
}

const getRandomSongsByContext = async (token: string, contextName: string): Promise<IContextResponse | null> => {
    try {
        console.log(`--- [CONTEXT MUSIC API] Đang lấy bài hát cho context: "${contextName}"... ---`);
        const encodedContext = encodeURIComponent(contextName);
        const url = `${BASE_URL}/api/playlist/random-by-context?contextName=${encodedContext}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        try {
            const responseJson = JSON.parse(responseText) as IContextResponse;
            if (response.ok && responseJson.success) {
                console.log(`[CONTEXT MUSIC API] Thành công! Context: ${responseJson.context}, Số lượng bài: ${responseJson.data?.length}`);
                return responseJson;
            } else {
                console.warn('[CONTEXT MUSIC API] Server trả lỗi hoặc success = false:', responseJson);
                return null;
            }
        } catch (e) {
            console.error('[CONTEXT MUSIC API] Lỗi Parse JSON. Raw:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[CONTEXT MUSIC API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getRandomSongsByContext;