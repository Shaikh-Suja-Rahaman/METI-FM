import express from 'express';
import type {Request, Response} from 'express'

import dotenv from 'dotenv'
import router from './routes/route.ts';


dotenv.config()
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json())

app.get('/', (req:Request, res:Response)=>{
  res.status(200).send("Hello wassup");
})

app.post('/', (req:Request, res:Response)=>{
  const body = req.body;
  res.status(200).send(body);
})

app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${PORT}`);
})

app.use('/api', router)