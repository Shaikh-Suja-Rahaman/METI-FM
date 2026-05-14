import express from 'express';

import { sendPipResponse } from '../controller/pip.ts';
import { sendOrimResponse } from '../controller/orim.ts';
import { sendGlitchResponse } from '../controller/glitch.ts';
import { sendHordeResponse } from '../controller/theHorde.ts';
import { sendVorrkResponse } from '../controller/vorrk.ts';
import { sendHuskResponse } from '../controller/theHusk.ts';
import { sendSignalResponse } from '../controller/theSignal.ts';

const router = express.Router();

// Light Side
router.route('/chat/pip').post(sendPipResponse);
router.route('/chat/orim').post(sendOrimResponse);
router.route('/chat/glitch').post(sendGlitchResponse);

// Dark Side
router.route('/chat/theHorde').post(sendHordeResponse);
router.route('/chat/vorrk').post(sendVorrkResponse);
router.route('/chat/theHusk').post(sendHuskResponse);
router.route('/chat/theSignal').post(sendSignalResponse);

export default router;