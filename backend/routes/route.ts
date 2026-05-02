import express from 'express';

import {fullConvo, sendResponse} from "../controller/gentleListener.ts"

const router = express.Router();

router.route('/chat/gentleListener').post(sendResponse);

export default router;