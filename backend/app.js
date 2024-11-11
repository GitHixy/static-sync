const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Routes Import
const userRoutes = require('./routes/userRoutes');
const staticRoutes = require('./routes/staticRoutes');
const ffLogsRoutes = require('./routes/ffLogsRoutes'); //Route V2 & V1

dotenv.config();
connectDB();

const corsOptions = {
    origin: '*' ,// Sostituisci con l'URL del frontend, se necessario
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();


app.use(cors(corsOptions));
app.use(express.json());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/statics', staticRoutes);
app.use('/api/fflogs', ffLogsRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
