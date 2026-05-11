import express from 'express';
import cors from 'cors'
import type {Request, Response} from 'express'

import dotenv from 'dotenv'
import router from './routes/route.ts';

dotenv.config()
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json())

app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${PORT}`);
})

app.use('/api', router)