const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

interface IMoodDetail {
    _id: string;
    name: string;
    displayName?: string;
    icon?: string;
    colorCode?: string;
    ownerId?: string;
    isSystem?: boolean;
    forkedFrom?: string;
}

export interface IContextData {
    _id: string;
    name: string;
    icon: string;
    color: string;
    moods: IMoodDetail[];
    ownerId?: string | null;
    isSystem?: boolean;
    forkedFrom?: string | null;
    createdAt: string;
}

interface IGetUserContextResponse {
    count: number;
    contextData: IContextData[];
}

const getContextUser = async (token: string): Promise<IContextData[] | null> => {
    try {
        console.log(`--- [GET USER CONTEXT API] Đang lấy danh sách Context ---`);
        
        const url = `${BASE_URL}/api/context/user`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[GET USER CONTEXT API] Lỗi: Server trả về HTML. Kiểm tra lại Endpoint.');
            console.log('Response status:', response.status);
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText);
            if (response.ok || response.status === 200) {
                const successResponse = responseJson as IGetUserContextResponse;
                if (Array.isArray(successResponse.contextData)) {
                    console.log(`[GET USER CONTEXT API] Lấy thành công! Số lượng: ${successResponse.count}`);
                    return successResponse.contextData;
                } else {
                    console.warn('[GET USER CONTEXT API] Server báo thành công nhưng format dữ liệu không đúng (thiếu contextData array):', responseJson);
                    return null;
                }
            } else {
                if (response.status === 401) {
                    console.error('[GET USER CONTEXT API] Lỗi 401: Token không hợp lệ hoặc hết hạn.');
                } else if (response.status === 500) {
                    console.error('[GET USER CONTEXT API] Lỗi 500: Lỗi Server nội bộ.');
                } else {
                    console.error(`[GET USER CONTEXT API] Lỗi ${response.status}:`, responseJson.message || responseJson);
                }
                return null;
            }
        } catch (e) {
            console.error('[GET USER CONTEXT API] Lỗi Parse JSON:', e);
            console.log('Raw text:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[GET USER CONTEXT API] Lỗi hệ thống (Network/Fetch):', error);
        return null;
    }
};

export default getContextUser;