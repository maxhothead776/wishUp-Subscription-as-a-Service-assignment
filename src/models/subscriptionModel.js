const mongoose = require("mongoose");

const objectId = mongoose.Types.ObjectId;

const subsSchema = new mongoose.Schema({
  user_name: { type: objectId, required: "enter the user name", refs: "User" },
  // plan_id: < plan_id >,
  // "start_date": < date in YYYY-MM-DD format >
});

module.exports = mongoose.model("subs", subsSchema)