import mongoose from "mongoose";

const SplitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  splitType: { type: String, enum: ["EQUAL", "PERCENT", "EXACT"] }
});

const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  paidUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  paidGroup: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  splits: [SplitSchema],
  time: { type: Date, default: Date.now }
});

export default mongoose.model("Expense", ExpenseSchema);
