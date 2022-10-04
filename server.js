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
const morgan = require("morgan") // import morgan
const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module

/////////////////////////////////////////////
// Import Our Models
/////////////////////////////////////////////
const Fruit = require('./models/fruit')
const { DESTRUCTION } = require("dns")
console.log('is this a fruit model?', Fruit)
/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// this is where we set up our inputs for our datatbase connect function
const DATABASE_URL = process.env.DATABASE_URL
// here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// establish our connection:
// mongoose built in function 'connect' is taking two arguements--that DB and options passed as an object as defined above
mongoose.connect(DATABASE_URL, CONFIG)

// tell mongoose what to do with certain events
// opens, disconnects, errors
mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log("An error occured:\n",error))

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request is processed through our middleware before mongoose does anything with it.
app.use(morgan("tiny")) // this is for request logging, the 'tiny' arguement declares what size morgan log to use.
app.use(express.urlencoded({extended: true})) // this parses urlEncoded request bodies(useful for Post and Put requests)
app.use(express.static("public")) // serves files from the public folder statically
app.use(express.json()) // this parse incoming request payloads with JSON

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running, better go out and catch it")
})

// Here, we're going to set up a seed route
// this will seed our database for us so we have some starting resources
// there are two ways we're going to talk about seeding a db
// routes -> they work, but they are not best practice
// see scripts -> they work, and they ARE best practice

app.get("/fruits/seed", (req, res) => {
    // array of starter fruits
  const startFruits = [
    { name: "Orange", color: "orange", readyToEat: false },
    { name: "Grape", color: "purple", readyToEat: false },
    { name: "Banana", color: "orange", readyToEat: false },
    { name: "Strawberry", color: "red", readyToEat: false },
    { name: "Coconut", color: "brown", readyToEat: false },
  ]

//   Delete every fruit in DB
    Fruit.deleteMany({})
        .then(() => {
            // seed with starter array
            Fruit.create(startFruits)
                .then(data => {
                    res.json(data)
                })
        })
})

// GET request
// index route -> shows all instances of a document in the DB
app.get("/fruits", (req, res) => {
    // inside of our index route, we want to use mongoose model methods to get our data
    Fruit.find({})
        .then(fruits => {
            // this is fine for inital testing
            // res.send(fruits)
            // this is the preferred method for APIs
            res.json({ fruits: fruits })
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new fruits
app.post("/fruits", (req, res) => {
    // here, we will get something called a request body
    // inside this function, that will be referred to as req.body
    // we'll use the mongoose model method "create" to make a new fruit
    Fruit.create(req.body)
    .then(fruit => {
        // send the user a '201 created' response, along with new fruit
        res.status(201).json({fruit: fruit.toObject() })
    })
    .catch(error => console.log(error))
})

// PUT request
// update route -> updates a specific route
app.put("/fruits/:id", (req, res) => {
    // console.log("I hit the update route", req.params)
    const id = req.params.id

    // for now, we will use a simple mongoose model method... eventually we will update this and all routes and we'll use a different method
    // we're using findByIdAndUpdate, which needs three arguements:
    // ID, req.body, and whether the info is new
    Fruit.findByIdAndUpdate(id, req.body, {new: true})
        .then(fruit => {
            console.log('the fruit from update: ',fruit)
            // update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
    // res.send("nothing yet, but we're getting there")
})

// DELETE request
// destroy route -> finds and deletes a single resource
app.delete("/fruits/:id", (req, res) => {
    // grab the id from the request
    const id =req.params.id
    // find and delete the fruit
    Fruit.findByIdAndRemove(id)
        // send a 204 if successful
        .then(fruit => {
            res.sendStatus(204)
        })
        // send error if not
        .catch(err => res.json(err))
})

// GET request
// show route -> find and display a single document
app.get("/fruits/:name", (req, res) => {
    // grab the id from the request
    // const id = req.params.id
    let name = req.params.name
    // manipulating the name here so it is always in the correct case
    name = name[0].toUpperCase() + name.slice(1).toLowerCase()    
    Fruit.find({name})
    // Fruit.findById(id)
        .then(fruit => {
            res.json({ fruit: fruit })
        })
        .catch(err => console.log(err))
})


// app.get("/donut", (req, res) => {
//     res.send("Welcome to the donut page")
// })

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END