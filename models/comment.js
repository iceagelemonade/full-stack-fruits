/////////////////////////////////////////////////////
// Import Dependencies
/////////////////////////////////////////////////////
const mongoose = require('./connection')

// pull schema from mongoose through "destructuring"
const {Schema} = mongoose

// comment schema
const commentSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        // object ID refrence (or Foreign Key)
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true})

//////////////////////////////
// export the Schema
//////////////////////////////
module.exports = commentSchema