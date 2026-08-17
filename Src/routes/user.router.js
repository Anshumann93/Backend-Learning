import { Router } from "express";
import { userRegister,
         userLogin,
         LoggedOut
} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import {VerifyJwt} from "../middleware/auth.middleware.js"

const router=Router()

router.post("/register",
    upload.fields([
      {
        name:"avtar",
        maxCount:1
      },
      {
        name:"coverImage",
        maxCount:1
      }
      
    ]),
    userRegister);
router.route("/login").post(userLogin)
router.route("/logout").post(VerifyJwt,LoggedOut)

export default router;




