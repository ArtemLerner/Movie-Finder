import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import movies from './routes/movies';
import auth from "./routes/auth";
import initDB from "./db";
import cookieParser from "cookie-parser";


const PORT = process.env.PORT || 3000;
const app = express();



app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://movie-finder-one-zeta.vercel.app'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())



app.get('/api/health', (_req, res) => {
    res.json({status: 'OK'});
})

app.use('/api', movies);
app.use('/auth', auth);


initDB().then(() => {
    app.listen(PORT, ()=>{
        console.log('Server started on port 3000');
    });
})

