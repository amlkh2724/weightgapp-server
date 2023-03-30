import express from "express";
import {
  checkRegister,
  login,
  getaAllUsers,
  logout,
  UpdateTheWeightFoodIntake,
} from "../controllers/updateDbWhight.js";

const router = express.Router();
router.route("/").get(getaAllUsers);
router.route("/register").post(checkRegister);
router
.route("/login").
post(login);
router
.get("/logout", logout);
router
.route("/weightRecords/:id")
.put(UpdateTheWeightFoodIntake);

export default router;
