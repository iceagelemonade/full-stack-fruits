////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Fruit = require("../models/fruit")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

// GET request
// index route -> shows all instances of a document in the DB
router.get("/", (req, res) => {
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
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
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
router.get("/:name", (req, res) => {
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

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
