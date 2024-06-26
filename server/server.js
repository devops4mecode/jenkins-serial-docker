require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler')
const cookieParser = require("cookie-parser");
const connectDB = require('./config/dbConnection')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const PORT = process.env.PORT || 3500
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');

const { generateCurrentMonthChart, generateSummary, spareSummary } = require('./cron')

// console.log(process.env.NODE_ENV)

connectDB();

// app.use(logger)
app.use(cors())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
// Custom Morgan
app.use(morgan(':method :url :status :response-time ms [:date[clf]]'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/serials', require('./routes/serialRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))
// ! Integration Routes
app.use('/api/lucky', require('./routes/globalRoutes'))

app.use(errorHandler)

generateSummary()

generateCurrentMonthChart()

// spareSummary()

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
    );
});
