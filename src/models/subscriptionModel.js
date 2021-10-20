const mongoose = require("mongoose");

const subsPlan = require("../configs/subsPlan.js");

const objectId = mongoose.Types.ObjectId;

const subsSchema = new mongoose.Schema({
    user_name: {
        type: objectId,
        required: "enter the user name",
        refs: "User"
    },
    plan_Id: {
        type: String,
        required: true,
        enum: subsPlan.plan_Id,
        trim: true
    },
    start_date: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model("subs", subsSchema);