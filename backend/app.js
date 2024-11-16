const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Routes Import
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const staticRoutes = require('./routes/staticRoutes');
const ffLogsRoutes = require('./routes/ffLogsRoutes');
const lodestoneRoutes = require('./routes/lodestoneRoutes')
const serverStatusRoutes = require('./routes/serverStatusRoutes');

dotenv.config();
connectDB();

const corsOptions = {
    origin: '*' ,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();


app.use(cors(corsOptions));
app.use(express.json());

//Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/statics', staticRoutes);
app.use('/api/fflogs', ffLogsRoutes);
app.use('/api/lodestone', lodestoneRoutes);
app.use('/api', serverStatusRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
