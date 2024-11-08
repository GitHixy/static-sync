const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Routes Import
const userRoutes = require('./routes/userRoutes');
const staticRoutes = require('./routes/staticRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/statics', staticRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
