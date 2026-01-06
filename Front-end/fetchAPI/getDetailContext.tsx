import { refreshTokenUse } from './loginAPI';

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface IMoodInContext {
    _id: string;
    name: string;
    displayName: string;
    colorCode: string;
    icon: string;
}

export interface IContextDetailData {
    _id: string;
    name: string;
    icon: string;
    color: string;
    moods: IMoodInContext[];
    createdUserId?: string;
    createdUserName?: string;
    isSystem: boolean;
    createdAt?: string;
}

interface ServerResponse {
    Id: string;
    contextData: IContextDetailData;
}

const getDetailContext = async (token: string, contextId: string): Promise<IContextDetailData | null> => {
    const fetchApi = async (currentToken: string) => {
        return await fetch(`${BASE_URL}/api/context/choose/${contextId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            },
        });
    };

    try {
        console.log(`--- [CONTEXT DETAIL API] Đang lấy thông tin context ID: ${contextId}... ---`);

        let response = await fetchApi(token);
        if (response.status === 403 || response.status === 401) {
            console.warn(`[CONTEXT DETAIL API] Token hết hạn (${response.status}). Đang thử Refresh Token...`);
            
            try {
                const newToken = await refreshTokenUse();
                if (newToken) {
                    console.log('[CONTEXT DETAIL API] Refresh thành công. Đang gọi lại API...');
                    response = await fetchApi(newToken);
                } else {
                    console.error('[CONTEXT DETAIL API] Refresh thất bại. Không thể lấy dữ liệu.');
                    return null;
                }
            } catch (refreshError) {
                console.error('[CONTEXT DETAIL API] Lỗi trong quá trình refresh token:', refreshError);
                return null;
            }
        }

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[CONTEXT DETAIL API] LỖI: Server trả về HTML. Kiểm tra lại ID hoặc Endpoint.');
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText);
            if (response.ok) {
                const result = responseJson as ServerResponse;
                if (result.contextData) {
                    console.log(`[CONTEXT DETAIL API] Thành công! Lấy được context: "${result.contextData.name}"`);
                    return result.contextData;
                } else {
                    console.warn('[CONTEXT DETAIL API] Response thiếu field contextData:', result);
                    return null;
                }
            } else {
                console.error(`[CONTEXT DETAIL API] Lỗi HTTP ${response.status}:`, responseJson);
                return null;
            }
        } catch (e) {
            console.error('[CONTEXT DETAIL API] Lỗi Parse JSON:', e);
            console.log('Raw text:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[CONTEXT DETAIL API] Lỗi hệ thống:', error);
        return null;
    }
};

export default getDetailContext;