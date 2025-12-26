import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    
    user: {
      refreshToken: string;
      phone: string | null;
      email: string;
      
    };
  };
}
interface RefreshTokenResponse{
  message:string;
  accessToken:string;
  refreshToken:string
}
const loginAPI = async (username: string, password: string): Promise<LoginResponse> => {
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
        
        const data: LoginResponse = await loginResponse.json();
        console.log(data)
        if (!loginResponse.ok) {
            throw new Error('Đăng nhập thất bại');
        }
        // if (data.trim().startsWith('<')) {
        //     console.error('[LOGIN API] LỖI: Server trả về HTML. Sai endpoint hoặc Server lỗi 500.');
        //     return null;
        // }

    //     let loginData;
    //     try {
    //         loginData = JSON.parse(responseText);
    //     } catch (e) {
    //         console.error('[LOGIN API] Lỗi Parse JSON:', e);
    //         return null;
    //     }

    //     if (!loginResponse.ok) {
    //         console.error('[LOGIN API] Login thất bại:', loginData);
    //         return null;
    //     }

    //     const token = loginData.data?.accessToken;
    //     if (!token) {
    //         console.error('[LOGIN API] Không tìm thấy AccessToken trong phản hồi!');
    //         return null;
    //     }

    //     console.log('[LOGIN API] Đăng nhập thành công! Token:', token.substring(0, 10) + '...');
    //     return token;

    // } catch (error) {
    //     console.error('[LOGIN API] Lỗi hệ thống:', error);
    //     return null;
    // }
    await SecureStore.setItemAsync('accessToken', data.data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.data.user.refreshToken);
    await SecureStore.setItemAsync('userEmail', data.data.user.email);
    await SecureStore.setItemAsync('userPhone', 
  data.data.user.phone ? String(data.data.user.phone) : ''
);
    return data;}
    catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null; // lưu Promise đang chạy

export const refreshTokenUse = async (): Promise<string> => {
  if (isRefreshing && refreshPromise) {
    console.log('[REFRESH TOKEN] Đang có refresh khác chạy → chờ chung...');
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    
    if (!refreshToken) {
      throw new Error('Không tìm thấy refresh token');
    }

    console.log('[REFRESH TOKEN] Đang gửi request refresh token...');

    try {
      const response = await fetch(`${BASE_URL}/api/user/refreshToken`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Refresh thất bại');
      }

      const data: RefreshTokenResponse = await response.json();

      await SecureStore.setItemAsync('accessToken', data.accessToken);
      await SecureStore.setItemAsync('refreshToken', data.refreshToken);

      console.log('[REFRESH TOKEN] Refresh thành công! Access token mới đã được lưu.');

      return data.accessToken;
    } catch (error) {
      console.error('[REFRESH TOKEN] Lỗi khi refresh token:', error);
      
      
      throw error; 
    } finally {
      // Luôn reset trạng thái sau khi xong (thành công hay thất bại)
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
export const logoutAPI = async ()=>{
  try{
    console.log("Thực hiện đăng xuất.......");
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if(accessToken){
      const response = await fetch(`${BASE_URL}/api/user/logout`,{
        method: "POST",
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      })
      const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đăng xuất thất bại');
    }

    console.log('[LOGOUT API] Thành công:', data.message);

    // Xóa toàn bộ dữ liệu lưu trữ sau khi gọi API thành công
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userEmail');
    await SecureStore.deleteItemAsync('userPhone');

    // return data.message; // { message: "Đăng xuất thành công" }
  }} catch (error) {
    console.error('Logout error:', error);
    // Tùy trường hợp, bạn vẫn có thể xóa token local để force logout
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userEmail');
    await SecureStore.deleteItemAsync('userPhone');
    throw error;
  }
}
export default loginAPI;