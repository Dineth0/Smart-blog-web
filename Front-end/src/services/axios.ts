import axios, { AxiosError } from "axios";
import { refreshTokens } from "./auth";




const axiosInstance = axios.create({
    baseURL:"http://localhost:5000/api/v1",
    headers:{
        "Content-Type":"application/json"
    }
})

const  PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

axiosInstance.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('accessToken')
        const isPublic = PUBLIC_ENDPOINTS.some((url)=>{
           return config.url?.includes(url)
        })
        if(token && !isPublic){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) =>{
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) =>{     //response ekata callback function eka
        return response
    },
    async (error : AxiosError) =>{    // backend error ekak awoth error callback function eka
        const originalReuset: any = error.config
        const isPublic = PUBLIC_ENDPOINTS.some((url)=>{
           return originalReuset.url?.includes(url)
        })

        if(error.response?.status === 401 && !isPublic && !originalReuset._retry) {
                originalReuset._rety = true
                try{
                    const refreshToken = localStorage.getItem("refreshToken")
                    if (!refreshToken) {
                        throw new Error("No refresh token available")
                    }
                    const data = await refreshTokens(refreshToken)
                    localStorage.setItem("accessToken", data.accessToken)

                    originalReuset.headers.Authorization = `Bearer ${data.accessToken}`
                    return axios(originalReuset)
                }catch(refreshError){
                    localStorage.removeItem("refreshToken")
                    localStorage.removeItem("accessToken")
                    window.location.href = "/login"
                    console.error(refreshError)
                    return Promise.reject(refreshError)
                }
            }
        return Promise.reject(error)
    }
)
export default axiosInstance