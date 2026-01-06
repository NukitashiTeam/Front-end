import * as SecureStore from 'expo-secure-store'
import { refreshTokenUse } from './loginAPI'
export interface UserResponse {
  message: string;
  data: UserData;
}

export interface UserData {
  _id: string;
  phone: number | null;
  email: string;
  username: string;
  avatar: any; 
}
export default async function getUserInfo(): Promise<UserResponse|null>{
    let accessToken = await SecureStore.getItemAsync("accessToken");
    try{
        const response = await fetch('https://moody-blue-597542124573.asia-southeast2.run.app/api/user/self',{
            method:'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        if(response.status === 401 || response.status ===403){
            accessToken = await refreshTokenUse();
            if(accessToken){
                const retryResponse = await fetch('https://moody-blue-597542124573.asia-southeast2.run.app/api/user/self', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                },
                });
                if (retryResponse.ok) {
                    const json: UserResponse = await retryResponse.json();
                    return json
                }
            }
        }
        else{
            const json: UserResponse = await response.json();
            console.log(json)
            return json
        }
        return null;
        
    }
    catch (error) {
    console.error("Lỗi fetch user info:", error);
    return null;
  }   
}