import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String }, 
  mode: { type: String }, 
  amount: Number,
  against: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who owes/receives
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  time: { type: Date, default: Date.now }
});

export default mongoose.model("History", HistorySchema);
