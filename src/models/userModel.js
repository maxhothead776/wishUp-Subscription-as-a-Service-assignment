const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    user_name : {type: String, required: "please enter a userName", trim:true},
    created_at : {type: Date}
})

module.exports = mongoose.model("User", userSchema)
