import express from 'express';

import {sendGentleResponse} from "../controller/gentleListener.ts"
import { sendChillResponse } from '../controller/chillFriend.ts';
import { sendHarshResponse } from '../controller/harshCoach.ts'; //note these are just functions, which take req, res

const router = express.Router();

router.route('/chat/gentleListener').post(sendGentleResponse);
router.route('/chat/chillFriend').post(sendChillResponse);
router.route('/chat/harshCoach').post(sendHarshResponse);

export default router;