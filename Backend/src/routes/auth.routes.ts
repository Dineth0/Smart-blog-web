import { Router } from "express"
import {
  getMyDetails,
  login,
  register,
  registerAdmin,
  refreshToken
} from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth"
import { isAdmin } from "../middleware/isAdmin"
// import { genrateContent } from "../controllers/aiController"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refreshToken)
router.post("/admin/register", authenticate, isAdmin, registerAdmin)

// protected (USER, AUTHOR, ADMIN)
router.get("/me", authenticate, getMyDetails)

// protected
// ADMIN only 
// need create middleware for check req is from ADMIN
router.post("/admin/register", authenticate, registerAdmin)
// router.post("/ai/genarate", genrateContent)

export default router
