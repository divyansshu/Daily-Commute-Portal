const mongoose = require("mongoose");

const CommuteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  start: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  routeData: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Commute", CommuteSchema);
