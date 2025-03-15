import * as express from 'express'; // Change made here

import * as cors from 'cors';

import * as dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(cors()); //It allows frontend to communicate with backend, cross-origin requests
app.use(express.json()); //enables JSON request body

app.get('/', (req,res) => {
    res.send('Cloud Drive API is running..');
});


const PORT = 5174;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});