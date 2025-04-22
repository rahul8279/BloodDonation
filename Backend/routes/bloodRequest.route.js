import  express from 'express';
import isAuthentication from '../middleware/isAuthentication.js';
import { createBloodRequest, getBloodRequests, updateBloodRequestStatus } from '../controllers/bloodRequest.controller.js';
const router = express.Router();

router.route('/postRequest').post(isAuthentication , createBloodRequest);
router.route('/getRequests').get(getBloodRequests);
router.route('/updateStatus/:id').put(isAuthentication, updateBloodRequestStatus); 

export default router;