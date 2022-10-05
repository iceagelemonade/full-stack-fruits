/////////////////////////////////////////////////////
// Our schema and model for the fruit resource
/////////////////////////////////////////////////////
// this is the old mongoose import
// const mongoose = require("mongoose") // import mongoose
const mongoose = require('./connection')
// we don't need to import the User for the owner field in the index to work, but we will need it later
const User = require('./user')
// here we will import our comment schema
const commentSchema = require('./comment')
// we're going to pull the Schema and model from mongoose
// we'll use a syntax called "destructuring"
const {Schema, model} = mongoose

// fruits schema
const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean,
    // we're going to use a reference to the user's id
    owner: {
        // references the type 'ObjectId', the  `._id` of a user.
        type: Schema.Types.ObjectId,
        // references the model: 'User'
        ref: 'User'
    },
    comments: [commentSchema]
}, {timestamps: true})

// make the fruit model
const Fruit = model("Fruit", fruitSchema)

//////////////////////////////
// export the fruit model
//////////////////////////////
module.exports = Fruit