import express from "express";
import {
  editProfile,
  getAllUser,
  getCurrentUser,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/all-users", isAuth, getAllUser);
userRouter.put("/profile", isAuth, upload.single("image"), editProfile);

export default userRouter;
