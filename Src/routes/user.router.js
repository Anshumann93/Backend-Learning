import { Router } from "express";
import { userRegister } from "../controller/user.controller.js";

const router=Router()

router.post("/register", userRegister);

export default router;




