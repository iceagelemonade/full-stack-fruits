/////////////////////////////////////////////////////
// Our schema and model for the fruit resource
/////////////////////////////////////////////////////
const mongoose = require("mongoose") // import mongoose

// we're going to pull the Schema and model from mongoose
// we'll use a syntax called "destructuring"
const {Schema, model} = mongoose

// fruits schema
const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})

// make the fruit model
const Fruit = model("Fruit", fruitSchema)

//////////////////////////////
// export the fruit model
//////////////////////////////
module.exports = Fruit