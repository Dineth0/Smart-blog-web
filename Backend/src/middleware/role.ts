import { NextFunction, Response } from "express"
import { Role } from "../models/User"
import { AuthRequest } from "./auth"


export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // user.roles එකේ role එකක් හෝ roles array එකේ එකක් match වෙනවාද කියලා බලන්න
    const hasRole = req.user.roles?.some((r: Role) => roles.includes(r))

    if (!hasRole) {
      return res.status(403).json({
        message: `Require one of the following roles: ${roles.join(", ")}`
      })
    }

    next()
  }
}
