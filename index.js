const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')

// env File
dotenv.config()

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
	next();
})

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next()
})

// routes
app.use('/api/auth', authRoutes)

// port
const port = process.env.PORT || 8000

// db
const db = process.env.DATABASE_URI
mongoose
    .connect(db, {})
    .then(() => {
        app.listen(port, () => console.log(`**DB connected** & Server running on port ${port}`))
    })
    .catch((err) => {
        console.log("DB error => ", err);
    })