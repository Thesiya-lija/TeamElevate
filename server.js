import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js'; 
import ceoRoutes from './routes/ceoRoutes.js';
import hrRoutes from './routes/hrRoutes.js';
import empRoutes from './routes/empRoutes.js';
import './controller/CronSalary.js'

import cors from 'cors';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 1300; 

app.use(cors({
  origin: ['http://192.168.11.217:5173','http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
  credentials: true, 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


connectDB();


app.use('/ceo', ceoRoutes);
app.use('/hr', hrRoutes);
app.use('/emp', empRoutes);


app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server is running`);
});
