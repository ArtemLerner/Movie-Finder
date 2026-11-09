import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import movies from './routes/movies';
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK' });
});
app.use('/api', movies);
app.listen(PORT, () => {
    console.log('Server started on port 3000');
});
