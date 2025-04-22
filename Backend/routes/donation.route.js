import express from 'express';
import { createDonation, getAllDonations, updateDonationStatus } from '../controllers/donation.controller.js';
import isAuthentication from '../middleware/isAuthentication.js';

const router = express.Router();

router.route("/createDonation").post(isAuthentication, createDonation);
router.route("/getAllDonations").get(isAuthentication, getAllDonations);
router.route("/updateDonationStatus/:id").put(isAuthentication, updateDonationStatus);

export default router;