import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import {Post} from "../models/postModel"
import { AuthRequest } from "../middleware/auth";

export const createPost = async(req:AuthRequest, res:Response) =>{
    //req.file.buffer -> save una iamge eka eliyata genimata
    try{
        const {title, content, tags} = req.body
        let imageUrls = ""

        if (req.file) {
            const result: any = await new Promise((resole, reject) => {
            const upload_stream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
                if (error) {
                return reject(error)
                }
                resole(result) // success return
            })
            upload_stream.end(req.file?.buffer)
            })
            imageUrls = result.secure_url
        }

        const newPost = new Post ({
            title,
            content,
            tags: tags.split(","),  //"modile, smartPhone" -> "mobile" "samartPhonr"
            imageUrls,
            author: req.user.sub  //user id from auth middleware
        })
        await newPost.save()
        res.status(201).json({
      message: "Post created",
      data: newPost
    })
    }catch(error){
         console.error(error)
    res.status(500).json({ message: "Fail to create post" })
    }

}

export const getAllPosts  = async(req:Request, res:Response, next: NextFunction) =>{

    try{
        const page = parseInt(req.query.page as string)  | 1
        const limit = parseInt(req.query.limit as string) | 10

        const skip = (page - 1) * limit

        const posts = await Post.find()
            .populate("author", "firstname email")
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)

            const total = await Post.countDocuments()
            res.status(200).json({
                message: "Posts data",
            data: posts,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
            })
     }catch(error){
        console.error(error)
        res.status(500).json({ message: "Failed to fetch posts" })
     }


}

export const getMyPosts = async(req:AuthRequest, res:Response , next:NextFunction) =>{
    try{
            const page = parseInt(req.query.page as string) | 1
            const limit = parseInt(req.query.limit as string) | 10
             const skip = (page - 1) * limit

             const posts = await Post.find({ author: req.user.sub })
            .sort({ createdAt: -1 }) // change order
            .skip(skip) // ignore data for pagination
            .limit(limit) // data cound currently need

            const total = await Post.countDocuments({ author: req.user.sub })

            res.status(200).json({
            message: "Posts data",
            data: posts,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
    })
    }catch(error){
        console.error(error)
        res.status(500).json({ message: "Failed to fetch posts" })
    }
}