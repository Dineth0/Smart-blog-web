import {Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { Role } from "../models/User";


export const isAdmin = (req: AuthRequest, res:Response, next:NextFunction) =>{
    try{
        if(!req.user){
            return res.status(401).json({
                message:"Unathorized"
            })
        }

        if(!req.user.roles.includes(Role.ADMIN)){
            return res.status(403).json({
                message:"Access denied. Admin only"
            })
        }
        next()
    }catch(error){
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}