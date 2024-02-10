import { Router } from "express";
import { registerUser ,loginuser} from "../controller/user.controller.js";
import { Postuser } from "../controller/post.controller.js";
import { likepostbyuser } from "../controller/like.controller.js";
import { commentbyuser } from "../controller/comment.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"Profilephoto",
            maxCount:1
        }
    ]),
    registerUser
)
router.route("/login").post(loginuser)
router.route("/Postuser").post(
    upload.fields([
        {
            name:"Postimage",
            maxCount:1
        }
    ]),
    Postuser
)
router.route("/:postId/like").post(likepostbyuser)
router.route("/comment").post(commentbyuser)
export default router



