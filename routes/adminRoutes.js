import express from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/admin.js";

const router = express.Router({ mergeParams: true });
router
.route("/admin")
.get(getAllUsers).
post(createUser);
router
.route("/admin/:id")
.get(getUser).
put(updateUser)
.delete(deleteUser);

export default router;
