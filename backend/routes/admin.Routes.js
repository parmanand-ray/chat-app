import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import { upload } from "../middlewares/multer.js";
import {
  getAllUsersAdmin,
  updateUserAdmin,
  deleteUserAdmin,
} from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.use(isAuth, isAdmin);

adminRouter.get("/users", getAllUsersAdmin);
adminRouter.put("/users/:id", upload.single("image"), updateUserAdmin);
adminRouter.delete("/users/:id", deleteUserAdmin);

export default adminRouter;
