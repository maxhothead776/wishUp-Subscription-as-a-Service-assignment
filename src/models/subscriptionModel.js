const mongoose = require("mongoose");

const subsPlan = require("../configs/subsPlan.js");

const subsSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: "enter the user name",
    refs: "User",
    unique: true,
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
  },
  valid_till: {
    type: Date,
  }
});

module.exports = mongoose.model("subs", subsSchema);
