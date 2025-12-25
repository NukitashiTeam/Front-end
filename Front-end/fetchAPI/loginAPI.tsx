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
export const refreshTokenUse = async (): Promise<string>=>{
  const refreshtoken = await SecureStore.getItemAsync('refreshToken');
  try{
    const response = await fetch(`${BASE_URL}/api/user/refreshToken`,{
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshtoken}`
      }
    });
    if(!response.ok){
       throw new Error('Refresh thất bại');
    }
    const data : RefreshTokenResponse = await response.json();
    await SecureStore.setItemAsync('accessToken',data.accessToken);
    await SecureStore.setItemAsync('refreshToken',data.refreshToken)
    return data.accessToken
  } 
  catch (error){
    console.error('[REFRESH TOKEN] Lỗi khi refresh token:', error);
    throw error;
  }
}

export default loginAPI;