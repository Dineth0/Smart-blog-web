import { Router } from "express";
import { createPost, getAllPosts, getMyPosts } from "../controllers/PostController";
import { authenticate } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";
import { requireRole } from "../middleware/role";
import { Role } from "../models/User";
import { upload } from "../middleware/upload";
// import { genrateContent } from "../controllers/aiController";


const router = Router()

router.post("/create", 
    authenticate, 
    requireRole([Role.ADMIN, Role.USER]), 
    upload.single("image"), //form data key value
    createPost)

router.get("/", getAllPosts)

router.get("/getMyPosts", 
    authenticate,
    requireRole([Role.ADMIN, Role.AUTHOR]), 
    getMyPosts)
// router.post("/ai/generate", genrateContent)

export default router