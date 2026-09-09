import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/", createUser);
userRoutes.get("/", listUsers);
userRoutes.get("/:id", getUserById);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

export { userRoutes };
