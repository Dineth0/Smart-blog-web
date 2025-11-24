import axiosInstance from "./axios"

 
 export const createPost = async (data: any) =>{
   const res = await axiosInstance.post("/post/create", data,{
        headers:{
            'Content-Type' : "multipart/form-data"
        }
   })
   return res.data
 }

 export const getAll = async (page: number, limit:number)=>{
    const res = await axiosInstance.get(`/post?page=${page}&limit=${limit}`)
    return res.data
 }

 export const getMyPost = async (page:number, limit : number)=>{
    const res = await axiosInstance.get(`/post?page=${page}&limit=${limit}`)
    return res.data
 }