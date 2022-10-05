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
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our fruits
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    // we'll use the mongoose model method `create` to make a new fruit
    Fruit.create(req.body)
        .then(fruit => {
            // send the user a '201 created' response, along with the new fruit
            res.status(201).json({ fruit: fruit.toObject() })
        })
        .catch(error => console.log(error))
})

// we're going to build another route that is owner specfic, to list all of the fruits owned by a certain (logged in) user
router.get('/mine', (req, res) => {
    // find fruits by ownership
    Fruit.find({owner: req.session.userId})
    // then display fruits
        .then(fruits => {
            res.status(200).json({fruits: fruits})
        })
    // or throw an error if there is one
        .catch(err => res.json(err))
})

// PUT request
// update route -> updates a specific route
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params)
    const id = req.params.id
    Fruit.findById(id)
    // populate will provide more data about the document that is in the specified collection
    // the first argument is the field to populate
    // the second can specify which parts to keep of remove(prepend '-')
    .populate("owner", "-password")
    // we can also populate fields of our subdocuments
    .populate("comments.author", "username")
        .then(fruit => {
            if (fruit.owner == req.session.userId) {
                // update success is called '204 - no content'
                res.sendStatus(204)
                return fruit.updateOne(req.body)
            } else {
                res.send(401)
            }    
        })
        .then(fruit => {
            console.log('the fruit from update: ',fruit)
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
    // Fruit.findByIdAndRemove(id)
    Fruit.findById(id)
       
        .then((fruit)=> {
            if (fruit.owner == req.session.userId) {
                // send a 204 if successful AND if the user is the owner
                res.sendStatus(204)
                return fruit.deleteOne()
            } else {
                // if they are not the owner, send the unauthorized status
                res.sendStatus(401)
            }
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
