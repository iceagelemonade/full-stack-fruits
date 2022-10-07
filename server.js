// dotenv => will allow us to use a .env file to define environmental variables we can access via the process.env object
// express => web framework for creating our server and writing routes
// morgan => logs details about requests to our server, mainly to help us debug
// mongoose => ODM (Object Document Mapper)for connecting to and sending queries to a mongo database
// path => a module that provides utilities for working with file and directory paths

/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express

// we don't need this dependency anymore because it lives in connection.js
// const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module
const FruitRouter = require('./controllers/fruitControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const middleware = require('./utils/middleware')
/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
// const app = express()
const app =require('liquid-express-views')(express())

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request is processed through our middleware before mongoose does anything with it.
// our middle ware is now being passed through a function in the utils directory
// the middleware function takes one argument, an app, and processes the middleware on that argument(which is our app)
middleware(app)


/////////////////////////////////////////
// Routes
/////////////////////////////////////////
// home route:
app.get("/", (req, res) => {
    // res.send("Your server is running, better go out and catch it")
    if (req.session.loggedIn) {
        res.redirect('/fruits')
    } else {
        res.render('index.liquid')
    }
})


///////////////////////////////////////
// Register Routes
//////////////////////////////////////
// here is where we register our routes. this is how server.js knows to send the appropriate request to the appropriate route and send the correct response
// app.use, when we register a route, needs two arguements
// first is the base url endpoint, second is the file to use
app.use('/fruits', FruitRouter)
app.use('/users', UserRouter)
app.use('/comments', CommentRouter)

// this renders an error page, gets the error from a URL request query
app.get('/error', (req, res) => {
    // get session variables
    const { username, loggedIn, userId } = req.session
    const error = req.query.error || 'This page does not exist'

    res.render('error.liquid', {error, username, loggedIn, userId })
})

// this is a catch all route that will redirect to the error page for anything doesn't satisfy a controller
app.all('*', (req, res) => {
    res.redirect('/error')
})

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END