require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require("cookie-parser");
const connectDB = require('./config/dbConnection')
const cors = require('cors')
const PORT = process.env.PORT || 3500
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');

console.log(process.env.NODE_ENV)

connectDB();

app.use(logger)
app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/serials', require('./routes/serialRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))
app.use('/api/lucky', require('./routes/globalRoutes'))

const buildPath = path.join(__dirname, 'build')
app.use(express.static(buildPath))

app.get('/*', function (req, res) {
    res.sendFile(
        path.join(__dirname, 'build/index.html'),
        function (error) {
            if (error) {
                res.status(500).send(error)
            }
        }
    )
})

app.use(errorHandler)

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