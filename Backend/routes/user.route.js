import express from 'express';
import { login, logout, register, updateProfile } from '../controllers/user.controller.js';
import isAuthentication from '../middleware/isAuthentication.js';

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/update/profile').put(isAuthentication , updateProfile);

export default router;