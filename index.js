require("dotenv").config();

const path = require('path')

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const corsOptions = require('./config/cors')
const connectDB = require('./config/database')
const credentials = require('./middleware/credentials')
const errorHandlerMiddleware = require('./middleware/error_handler');
const authenticationMiddleware = require("./middleware/authentication");

const app = express();

connectDB()

// Allow Credentials
app.use(credentials)

// CORS
// app.use(cors(corsOptions))
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
	next();
});

// application.x.www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// application/json response
app.use(express.json());

// middelware for cookies
app.use(cookieParser());

app.use(authenticationMiddleware)

// static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// Default error handler
app.use(errorHandlerMiddleware)

// Routes
app.use('/api/auth', require('./routes/api/auth'))

app.all('*', (req, res) => {
    res.status(404)

    if(req.accepts('json')){
        res.json('error: 404 NOT FOUND')
    }else {
        res.type('text').send('404 NOT FOUNDs')
    }
})

mongoose.connection.once('open', () => {
    console.log('DB connected')
    app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
})
