import dotenv from 'dotenv';
dotenv.config({});
import  express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/dbConnection.js';
import userRoute from  './routes/user.route.js';
import hospitalRoute from './routes/hospital.route.js';
import donationRoute from './routes/donation.route.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
  };
app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000;

app.use('/api/v1/user', userRoute);
app.use('/api/v1/hospital', hospitalRoute);
app.use('/api/v1/donation', donationRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});


