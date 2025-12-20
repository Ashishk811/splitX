import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  groupName: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  balances: { type: Map, of: Number, default: {} }
});

export default mongoose.model("Group", GroupSchema);
