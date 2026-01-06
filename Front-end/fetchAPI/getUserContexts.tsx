import { refreshTokenUse } from './loginAPI';

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface IMoodInContext {
    _id: string;
    name: string;
    displayName: string;
    colorCode: string;
    icon: string;
}

export interface IContext {
    _id: string;
    name: string;
    icon: string;
    color: string;
    moods: IMoodInContext[];
    ownerId: string;
    isSystem: boolean;
    forkedFrom?: string;
    createdAt?: string;
}

interface ServerResponse {
    contextData: IContext[];
}

const getUserContexts = async (token: string): Promise<IContext[] | null> => {
    const fetchContexts = async (currentToken: string) => {
        return await fetch(`${BASE_URL}/api/context/all`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            },
        });
    };

    try {
        console.log('--- [CONTEXT API] Đang lấy danh sách Context của User... ---');

        let response = await fetchContexts(token);
        if (response.status === 403) {
            console.warn('[CONTEXT API] Token hết hạn (403). Đang thử Refresh Token...');
            try {
                const newToken = await refreshTokenUse();
                if (newToken) {
                    console.log('[CONTEXT API] Refresh thành công. Đang gọi lại API...');
                    response = await fetchContexts(newToken);
                } else {
                    console.error('[CONTEXT API] Refresh thất bại. Không thể lấy dữ liệu.');
                    return null;
                }
            } catch (refreshError) {
                console.error('[CONTEXT API] Lỗi khi refresh token:', refreshError);
                return null;
            }
        }

        const responseText = await response.text();
        try {
            const responseJson = JSON.parse(responseText) as ServerResponse;
            if (response.ok) {
                if (responseJson.contextData && Array.isArray(responseJson.contextData)) {
                    console.log(`[CONTEXT API] Lấy thành công ${responseJson.contextData.length} context!`);
                    return responseJson.contextData;
                } else {
                    console.warn('[CONTEXT API] Response không chứa mảng contextData hợp lệ:', responseJson);
                    return [];
                }
            } else {
                console.error(`[CONTEXT API] Lỗi HTTP ${response.status}:`, responseJson);
                return null;
            }
        } catch (e) {
            console.error('[CONTEXT API] Lỗi Parse JSON. Raw:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[CONTEXT API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getUserContexts;