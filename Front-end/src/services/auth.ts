import axiosInstance from "../services/axios"

type registerDataType ={
    firstname:string
    lastname:string
    email:string
    password:string
    role: string

}
export const signup = async(data:registerDataType) =>{
    const res = await axiosInstance.post("/auth/register", data)
    return res.data
}

export const login = async(email:string, password:string)=>{
    const res = await axiosInstance.post("/auth/login", {email, password})
    return res.data
}

export const getMyDetails = async () =>{
    const res = await axiosInstance.get("/auth/me")
    return res.data
}
export const refreshTokens = async (refreshToken: string) =>{
    const res = await axiosInstance.post("/auth/refresh" ,{
        token: refreshToken
    })
    return res.data
}