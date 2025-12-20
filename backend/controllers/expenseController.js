import { createGroupExpense } from "../services/groupExpenseService.js";
import { createIndividualExpense } from "../services/individualExpenseService.js";
import { settleGroup, settleIndividual } from "../services/settlementService.js";
import User from "../models/User.js";

export const addGroupExpense = async(req,res)=>{
  try {
    const ex = await createGroupExpense({
      groupId:req.params.groupId,
      ...req.body
    });
    res.json(ex);
  } catch(e) {
    res.status(400).json({message:e.message});
  }
};

export const addIndividualExpense = async(req,res)=>{
  const ex = await createIndividualExpense(req.body);
  res.json(ex);
};

export const settleInGroup = async (req, res) => {
  const { groupId, from, to, amount } = req.body;

  try {
    const fromUser = await User.findOne({ email: from });
    const toUser = await User.findOne({ email: to });

    if (!fromUser || !toUser) {
      return res.status(404).json({
        message: "Invalid user email(s)",
        missing: [
          !fromUser ? fromEmail : null,
          !toUser ? toEmail : null
        ].filter(Boolean)
      });
    }

    const r = await settleGroup(groupId, fromUser._id, toUser._id, amount);
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const settleBetweenUsers = async (req, res) => {
  const { from, to, amount } = req.body;

  try {
    const fromUser = await User.findOne({ email: from });
    const toUser = await User.findOne({ email: to });
    if (!fromUser || !toUser) {
      return res.status(404).json({
        message: "Invalid user email(s)",
        missing: [
          !fromUser ? fromEmail : null,
          !toUser ? toEmail : null
        ].filter(Boolean)
      });
    }

    const r = await settleIndividual(fromUser._id, toUser._id, amount);
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
