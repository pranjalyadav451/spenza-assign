const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  timeStamp: Date,
});
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
