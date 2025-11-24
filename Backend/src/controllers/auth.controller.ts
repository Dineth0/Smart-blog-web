import { Request, Response } from "express"
import { IUser, Role, Status, User } from "../models/User"
import bcrypt from "bcryptjs"
import { RefreshToken, signAccessToken } from "../utils/tokens"
import { AuthRequest } from "../middleware/auth"
import jwt from 'jsonwebtoken';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string


export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, role } = req.body

    
    if (!firstname || !lastname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (role !== Role.USER && role !== Role.AUTHOR) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email alrady registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const approvalStatus =
      role === Role.AUTHOR ? Status.PENDING : Status.APPROVED

    const newUser = new User({
      firstname, 
      lastname,
      email,
      password: hashedPassword,
      roles: [role],
      approved: approvalStatus
    })

    await newUser.save()

    res.status(201).json({
      message:
        role === Role.AUTHOR
          ? "Author registered successfully. waiting for approvel"
          : "User registered successfully",
      data: {
        id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
        approved: newUser.approved
      }
    })
  } catch (err: any) {
    res.status(500).json({ message: err?.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, existingUser.password)
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const accessToken = signAccessToken(existingUser)
    const refreshtoken = RefreshToken(existingUser)

    res.status(200).json({
      message: "success",
      data: {
        email: existingUser.email,
        roles: existingUser.roles,
        accessToken,
        refreshtoken
      }
    })
  } catch (err: any) {
    res.status(500).json({ message: err?.message })
  }
}

export const getMyDetails = async (req: AuthRequest, res: Response) => {
  
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const userId = req.user.sub
  const user =
    ((await User.findById(userId).select("-password")) as IUser) || null

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  const { firstname, lastname, email, roles, approved } = user

  res.status(200).json({
    message: "Ok",
    data: { firstname, lastname, email, roles, approved }
  })
}

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const {firstname, lastname, email, password } = req.body

    if(!firstname || !lastname || !email || !password){
      return res.status(400).json({
        message:"All fiels are Required"
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email exists" })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hash,
      roles: [Role.ADMIN],
      approved:Status.APPROVED
    })
    await user.save()

    res.status(201).json({
      message: "Admin registed",
      data: { 
        id: user._id,
        email: user.email,
        roles:user.roles,
        approved: user.approved
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const refreshToken = async (req:Request, res: Response) =>{
  const {token} = req.body

  if(!token){
    return res.status(401).json({
       message: "No refresh token provided" 
      })
  }

  try{
    const payload: any = jwt.verify(token, JWT_REFRESH_SECRET)

    const user = await User.findById(payload.sub)

    if(!user){
      return res.status(403).json({ 
        message: "User not found" 
      })
    }
    // if (user.refreshToken !== token) {
    //   return res.status(403).json({ 
    //     message: "Invalid refresh token" 
    //   })
    // }

    if(user.approved !== Status.APPROVED){
      return res.status(403).json({
        message: "Account not approved" 
      })
    }
    const newAccesstoken = signAccessToken(user)

    res.status(200).json({
      message: "Access token refreshed",
      data: {
        accessToken: newAccesstoken
      }
    })
  }catch(error){
    return res.status(403).json({ 
      message: "Invalid or expired refresh token" 
    })
  }
}

