import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';


dotenv.config();

const app = express();

const PORT=process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['https://mern-auth-frontend-uszl.onrender.com/'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials: true}))

app.get('/', (req, res) => res.send("App is runnig here ..."));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, 
    console.log(`app running at port : ${PORT}`)
)
