////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Fruit = require("../models/fruit")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// POST
// only loggedIn users can post comments
router.post("/:fruitId", (req, res) => {
    const fruitId = req.params.fruitId

    if (req.session.loggedIn) {
        // we want to adjust req.body so that the author is automatically assigned
        req.body.author = req.session.userId
    } else {
        res.redirect(`/error?error=${err}`)
    }
    // find a specific fruit
    Fruit.findById(fruitId)
        // do something if it works
        //  --> send a success response status and maybe the comment? maybe the fruit?
        .then(fruit => {
            // push the comment into the fruit.comments array
            fruit.comments.push(req.body)
            // we need to save the fruit
            return fruit.save()
        })
        .then(fruit => {
            res.redirect(`/fruits/${fruitId}`)
        })
        // do something else if it doesn't work
        //  --> send some kind of error depending on what went wrong
        .catch(err => res.redirect(`/error?error=${err}`))
})

// DELETE
// only the author of the comment can delete it
router.delete('/delete/:fruitId/:commId', (req, res) => {
    // isolate the ids and save to vars for easy ref
    const fruitId = req.params.fruitId 
    const commId = req.params.commId
    // get the fruit
    Fruit.findById(fruitId)
        .then(fruit => {
            // get the comment
            // subdocs have a built in method that you can use to access specific subdocuments when you need to.
            // this built in method is called .id()
            const theComment = fruit.comments.id(commId)
            console.log('this is the comment that was found', theComment)
            // make sure the user is logged in
            if (req.session.loggedIn) {
                // only let the author of the comment delete it
                if (theComment.author == req.session.userId) {
                    // find some way to remove the comment
                    // here's another built in method
                    theComment.remove()
                    fruit.save()
                    res.redirect(`/error?error=${err}`)
                    // return the saved fruit
                    return 
                } else {
                    const err = 'You%20are%20not%authorized%20for%this%action'
                    res.redirect(`/error?error=${err}`)
                }
            } else {
                const err = 'You%20are%20not%authorized%20for%this%action'
                res.redirect(`/error?error=${err}`)
            }
        })
        // send an error if error
        .catch(err => res.redirect(`/error?error=${err}`))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router