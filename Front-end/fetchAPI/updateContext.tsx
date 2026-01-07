const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface IUpdateContextInput {
    name: string;
    icon: string;
    color: string;
    moods: string[];
}

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
    createdAt: string;
}

interface UpdateContextResponse {
    message: string;
    contextData: IContextData;
}

const updateContext = async (token: string, contextId: string, input: IUpdateContextInput): Promise<IContextData | null> => {
    try {
        console.log(`--- [UPDATE CONTEXT API] Đang cập nhật context ID: "${contextId}" ---`);
        
        const url = `${BASE_URL}/api/context/update/${contextId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[UPDATE CONTEXT API] Lỗi: Server trả về HTML. Kiểm tra lại Endpoint.');
            console.log('Response status:', response.status);
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText);
            if (response.ok || response.status === 200) {
                const successResponse = responseJson as UpdateContextResponse;
                if (successResponse.contextData) {
                    if (successResponse.contextData._id !== contextId) {
                        console.log(`[UPDATE CONTEXT API] Đã tạo bản sao (Fork) thành công! ID mới: ${successResponse.contextData._id}`);
                    } else {
                        console.log(`[UPDATE CONTEXT API] Cập nhật thành công! ID: ${successResponse.contextData._id}`);
                    }
                    return successResponse.contextData;
                } else {
                    console.warn('[UPDATE CONTEXT API] Server báo thành công nhưng thiếu contextData:', responseJson);
                    return null;
                }
            } else {
                if (response.status === 401) {
                    console.error('[UPDATE CONTEXT API] Lỗi 401: Token không hợp lệ hoặc hết hạn.');
                } else if (response.status === 404) {
                    console.error('[UPDATE CONTEXT API] Lỗi 404: Không tìm thấy Context để sửa.');
                } else {
                    console.error(`[UPDATE CONTEXT API] Lỗi ${response.status}:`, responseJson.message || responseJson);
                }
                return null;
            }
        } catch (e) {
            console.error('[UPDATE CONTEXT API] Lỗi Parse JSON:', e);
            console.log('Raw text:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[UPDATE CONTEXT API] Lỗi hệ thống:', error);
        return null;
    }
};

export default updateContext;