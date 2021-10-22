const mongoose = require("mongoose");

const subsPlan = require("../configs/subsPlan.js");

const objectId = mongoose.Types.ObjectId;

const subsSchema = new mongoose.Schema({
  user_name: {
    type: objectId,
    refs: "User",
    required: "enter the user name",
    trim: true,
  },
  plan_id: {
    type: String,
    required: "enter a plan Id",
    enum: subsPlan.plan_Id,
    trim: true,
  },
  start_date: {
    type: Date,
    required: true,
    trim: true,
  },
  valid_till: {
    type: Date,
  },
});

module.exports = mongoose.model("subs", subsSchema);
