const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const {connectToDiscord} = require('./config/discordConfig');
const passport = require('passport');
const session = require('express-session');
require('./config/passport');
;
//Routes Import
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const staticRoutes = require('./routes/staticRoutes');
const ffLogsRoutes = require('./routes/ffLogsRoutes');
const lodestoneRoutes = require('./routes/lodestoneRoutes')
const serverStatusRoutes = require('./routes/serverStatusRoutes');
const pluginsRoutes = require('./routes/pluginsRoutes');
const discordBotRoutes = require('./routes/discordBot');

//Middleware
const logger = require('./middleware/logger');

dotenv.config();
connectDB();
connectToDiscord();

const corsOptions = {
    origin: '*' ,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();


app.use(cors(corsOptions));
app.use(express.json());

//Middleware
app.use(logger);
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/statics', staticRoutes);
app.use('/api/fflogs', ffLogsRoutes);
app.use('/api/lodestone', lodestoneRoutes);
app.use('/api', serverStatusRoutes);
app.use('/api', pluginsRoutes);
app.use('/api', discordBotRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
