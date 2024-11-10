const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Routes Import
const userRoutes = require('./routes/userRoutes');
const staticRoutes = require('./routes/staticRoutes');
const ffLogsRoutes = require('./routes/ffLogsRoutes'); //Route V2 & V1

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/statics', staticRoutes);
app.use('/api/fflogs', ffLogsRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
