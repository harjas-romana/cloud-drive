import express from 'express'; // Use default import for express
import cors from 'cors';
import dotenv from 'dotenv'; // Use default import for dotenv
import uploadRoute from './upload.ts';
import db from './db.ts';

dotenv.config();

const app = express();
app.use(cors()); // Allows frontend to communicate with backend, cross-origin requests
app.use(express.json()); // Enables JSON request body
app.use('/api', uploadRoute);

app.get('/', (req, res) => {
    res.send('Cloud Drive API is running..');
});

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.any('SELECT NOW()');
        res.json({ message: 'DB is working', time: result[0].now });
    } catch (error) {
        res.status(500).json({ message: "DB is not working", error });
    }
});

const PORT = 5174;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});