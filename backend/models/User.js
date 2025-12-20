import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  balances: { type: Map, of: Number, default: {} },
  groupsList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  verified:{
    type:Boolean,
    default:false
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }]
});

export default mongoose.model("User", UserSchema);
