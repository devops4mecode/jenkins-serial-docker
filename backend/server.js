require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require('./config/dbConnection')
const cors = require('cors')
const PORT = process.env.PORT || 3500
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');

console.log(process.env.NODE_ENV)

connectDB();

app.use(logger)
// app.use(cors(corsOptions))
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

// app.use('/', express.static(path.join(__dirname, '/public')))

// Making Build Folder as Public 
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/', require('./routes/root'))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/serials', require('./routes/serialRoutes'))

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

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