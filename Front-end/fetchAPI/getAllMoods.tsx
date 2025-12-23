import { refreshTokenUse } from './loginAPI';

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface IMood {
    _id: string;
    name: string;
    displayName: string;
    description: string;
    colorCode: string;
    icon: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ServerResponse {
    message: string;
    data: IMood[];
}

const getAllMoods = async (token: string): Promise<IMood[] | null> => {
    const fetchMoods = async (currentToken: string) => {
        return await fetch(`${BASE_URL}/api/mood/all`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            },
        });
    };

    try {
        console.log('--- [MOOD API] Đang lấy danh sách Mood... ---');

        let response = await fetchMoods(token);
        if (response.status === 403) {
            console.warn('[MOOD API] Token hết hạn (403). Đang thử Refresh Token...');
            try {
                const newToken = await refreshTokenUse();
                if (newToken) {
                    console.log('[MOOD API] Refresh thành công. Đang gọi lại API...');
                    response = await fetchMoods(newToken);
                } else {
                    console.error('[MOOD API] Refresh thất bại. Không thể lấy dữ liệu.');
                    return null;
                }
            } catch (refreshError) {
                console.error('[MOOD API] Lỗi khi refresh token:', refreshError);
                return null;
            }
        }

        const responseText = await response.text();
        try {
            const responseJson = JSON.parse(responseText) as ServerResponse;
            if (response.ok) {
                if (responseJson.data && Array.isArray(responseJson.data)) {
                    console.log(`[MOOD API] Lấy thành công ${responseJson.data.length} mood!`);
                    return responseJson.data;
                } else {
                    console.warn('[MOOD API] Response không chứa mảng data hợp lệ:', responseJson);
                    return [];
                }
            } else {
                console.error(`[MOOD API] Lỗi HTTP ${response.status}:`, responseJson);
                return null;
            }
        } catch (e) {
            console.error('[MOOD API] Lỗi Parse JSON. Raw:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[MOOD API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getAllMoods;