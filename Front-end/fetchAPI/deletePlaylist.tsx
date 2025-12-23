const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

interface DeleteResponse {
    message: string;
}

const deletePlaylist = async (token: string, playlistId: string): Promise<boolean> => {
    try {
        console.log(`--- [DELETE PLAYLIST API] Đang xóa playlist ID: "${playlistId}"... ---`);

        const response = await fetch(`${BASE_URL}/api/playlist/${playlistId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[DELETE PLAYLIST API] LỖI: Server trả về HTML. Kiểm tra lại Endpoint.');
            return false;
        }

        try {
            const responseJson = JSON.parse(responseText) as DeleteResponse;

            if (response.ok) {
                console.log(`[DELETE PLAYLIST API] Thành công: ${responseJson.message}`);
                return true;
            } else {
                if (response.status === 404) {
                    console.error('[DELETE PLAYLIST API] Lỗi 404: Playlist không tồn tại hoặc bạn không phải chủ sở hữu.');
                } else if (response.status === 403) {
                    console.error('[DELETE PLAYLIST API] Lỗi 403: Không có quyền truy cập.');
                } else if (response.status === 500) {
                    console.error('[DELETE PLAYLIST API] Lỗi 500: Server gặp sự cố.');
                } else {
                    console.error(`[DELETE PLAYLIST API] Lỗi ${response.status}:`, responseJson);
                }
                return false;
            }
        } catch (e) {
            console.error('[DELETE PLAYLIST API] Lỗi Parse JSON:', e);
            console.log('Raw text:', responseText);
            return false;
        }

    } catch (error) {
        console.error('[DELETE PLAYLIST API] Lỗi hệ thống:', error);
        return false;
    }
};

export default deletePlaylist;