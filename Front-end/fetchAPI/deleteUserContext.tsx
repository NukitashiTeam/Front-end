const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface IDeleteContextResponse {
    message: string;
    deletedId: string;
    isRevertedToSystem: boolean;
}

const deleteUserContext = async (token: string, contextId: string): Promise<IDeleteContextResponse | null> => {
    try {
        console.log(`--- [DELETE CONTEXT API] Đang yêu cầu xóa context ID: "${contextId}" ---`);
        
        const url = `${BASE_URL}/api/context/user/${contextId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[DELETE CONTEXT API] Lỗi: Server trả về HTML. Kiểm tra lại Endpoint.');
            console.log('Response status:', response.status);
            return null;
        }

        try {
            const responseJson = JSON.parse(responseText);
            if (response.ok || response.status === 200) {
                const successResponse = responseJson as IDeleteContextResponse;
                console.log(`[DELETE CONTEXT API] Xóa thành công! ID: ${successResponse.deletedId}`);
                if (successResponse.isRevertedToSystem) {
                    console.log('-> Context hệ thống gốc đã được khôi phục.');
                }
                return successResponse;
            } else {
                if (response.status === 403) {
                    console.error('[DELETE CONTEXT API] Lỗi 403: Không có quyền (Access denied). Bạn không phải chủ sở hữu.');
                } else if (response.status === 404) {
                    console.error('[DELETE CONTEXT API] Lỗi 404: Không tìm thấy Context cần xóa.');
                } else if (response.status === 500) {
                    console.error('[DELETE CONTEXT API] Lỗi 500: Lỗi Server nội bộ.');
                } else {
                    console.error(`[DELETE CONTEXT API] Lỗi ${response.status}:`, responseJson.message || responseJson);
                }
                return null;
            }
        } catch (e) {
            console.error('[DELETE CONTEXT API] Lỗi Parse JSON:', e);
            console.log('Raw text:', responseText);
            return null;
        }
    } catch (error) {
        console.error('[DELETE CONTEXT API] Lỗi hệ thống (Network/Fetch):', error);
        return null;
    }
};

export default deleteUserContext;