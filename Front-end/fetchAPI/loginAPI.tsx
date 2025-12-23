const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

const loginAPI = async (username: string, password: string): Promise<string | null> => {
    try {
        console.log('--- [LOGIN API] Đang đăng nhập... ---');
        const loginResponse = await fetch(`${BASE_URL}/api/user/login`, { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const responseText = await loginResponse.text();
        if (responseText.trim().startsWith('<')) {
            console.error('[LOGIN API] LỖI: Server trả về HTML. Sai endpoint hoặc Server lỗi 500.');
            return null;
        }

        let loginData;
        try {
            loginData = JSON.parse(responseText);
        } catch (e) {
            console.error('[LOGIN API] Lỗi Parse JSON:', e);
            return null;
        }

        if (!loginResponse.ok) {
            console.error('[LOGIN API] Login thất bại:', loginData);
            return null;
        }

        const token = loginData.data?.accessToken;
        if (!token) {
            console.error('[LOGIN API] Không tìm thấy AccessToken trong phản hồi!');
            return null;
        }

        console.log('[LOGIN API] Đăng nhập thành công! Token:', token.substring(0, 10) + '...');
        return token;

    } catch (error) {
        console.error('[LOGIN API] Lỗi hệ thống:', error);
        return null;
    }
};

export default loginAPI;