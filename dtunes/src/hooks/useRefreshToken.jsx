import axiosBase from "../api/axiosBase.jsx";
import useAuth from "./useAuth";

export default function useRefreshToken(){
    const {setAuth} = useAuth();

    async function refresh(){
        const response = await axiosBase.get('/refresh', {
            withCredentials: true,
            credentials: 'include',
        })
        
        setAuth(prev => {
            console.log('old accessT', JSON.stringify(prev))
            console.log('new accessT', response.data.accessToken);
            return {...prev, accessToken: response.data.accessToken, user: response.data.user}
        })

        return response.data.accessToken;
    }

    return refresh;
}