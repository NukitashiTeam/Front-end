const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface ICreateContextInput {
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
}

export interface IContextData {
    _id: string;
    name: string;
    icon: string;
    color: string;
    moods: IMoodDetail[];
    createdAt: string;
}

interface CreateContextResponse {
    message: string;
    contextData: IContextData;
}

const createContext = async (token: string, input: ICreateContextInput): Promise<IContextData | null> => {
    try {
        console.log(`--- [CREATE CONTEXT API] Đang tạo context: "${input.name}" ---`);
        const response = await fetch(`${BASE_URL}/api/context/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[CREATE CONTEXT API] Lỗi: Server trả về HTML. Endpoint có thể sai.');
            console.log('Status:', response.status);
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText);
            if (response.ok || response.status === 201) {
                const successResponse = responseJson as CreateContextResponse;
                if (successResponse.contextData) {
                    console.log(`[CREATE CONTEXT API] Thành công! ID: ${successResponse.contextData._id}`);
                    return successResponse.contextData;
                } else {
                    console.warn('[CREATE CONTEXT API] Server báo thành công nhưng thiếu contextData:', responseJson);
                    return null;
                }
            } else {
                console.error(`[CREATE CONTEXT API] Lỗi ${response.status}:`, responseJson);
                if (response.status === 400) {
                     console.warn('-> Gợi ý: Có thể do trùng tên, thiếu Mood, hoặc ĐÃ ĐẠT GIỚI HẠN số lượng Context.');
                }
                return null;
            }
        } catch (e) {
            console.error('[CREATE CONTEXT API] Lỗi Parse JSON:', e);
            console.log('Raw text:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[CREATE CONTEXT API] Lỗi hệ thống:', error);
        return null;
    }
};

export default createContext;