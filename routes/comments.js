import express from "express";
// import * as commentControllers from "../controllers/commentControllers.js";
import { verifyToken } from "../middleware/auth.js";
import {updateComment,createComment,deleteComment,getPostComments,getUserComments} from "../controllers/commentControllers.js"

const router = express.Router();

router.patch("/:id", verifyToken, updateComment);

router.post("/post/:postId", verifyToken, createComment);

router.delete("/:id", verifyToken, deleteComment);

router.get("/post/:postId", getPostComments);

router.get("/user/:userId", getUserComments);

export default router;
