import express from "express";
import { getAllHospitals, getHospitalById, login, logout, register, UpdateBloodBank } from "../controllers/hospital.controller.js";
import isAuthentication from "../middleware/isAuthentication.js";

const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/allhospitals").get(isAuthentication, getAllHospitals)
router.route("/gethospital/:id").get(isAuthentication, getHospitalById)
router.route("/updateBloodBank/:id").put(isAuthentication, UpdateBloodBank)

export default router;