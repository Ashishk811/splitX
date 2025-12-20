import { updateGroupBalance } from "./groupBalanceService.js";
import { updateUserBalance } from "./balanceService.js";
import { autoSimplifyGroupBalances } from "./simplifyAutomation.js";
import { addHistory } from "./historyService.js";
import User from "../models/User.js";
import { sendMail } from "./mailService.js";

export const settleGroup = async (groupId, from, to, amount) => {
  await updateGroupBalance(groupId, to, from, amount);
  await autoSimplifyGroupBalances(groupId);

  await addHistory({
    user: from,
    action: "SETTLEMENT",
    mode: "GROUP",
    amount,
    against: to,
    group: groupId,
  });

  await addHistory({
    user: to,
    action: "SETTLEMENT",
    mode: "GROUP",
    amount,
    against: from,
    group: groupId,
  });
  const fromUserAcc = await User.findById(from);
  const toUserAcc = await User.findById(to);

  // Notify payer
  await sendMail({
    to: fromUserAcc.email,
    subject: "Group Settlement Paid",
    text: `You paid ₹${amount} to ${toUserAcc.name} inside the group.`,
  });

  // Notify receiver
  await sendMail({
    to: toUserAcc.email,
    subject: "Group Settlement Received",
    text: `${fromUserAcc.name} paid you ₹${amount} inside the group.`,
  });

  return { message: "Group settlement complete" };
};

export const settleIndividual = async (from, to, amount) => {
  await updateUserBalance(from, to, amount * -1);
  await updateUserBalance(to, from, amount);

  await addHistory({
    user: from,
    action: "SETTLEMENT",
    mode: "INDIVIDUAL",
    amount,
    against: to,
    group: null,
  });

  await addHistory({
    user: to,
    action: "SETTLEMENT",
    mode: "INDIVIDUAL",
    amount,
    against: from,
    group: null,
  });

  const fromUserAcc = await User.findById(from);
  const toUserAcc = await User.findById(to);

  // Notify payer
  await sendMail({
    to: fromUserAcc.email,
    subject: "Group Settlement Paid",
    text: `You paid ₹${amount} to ${toUserAcc.name} inside the group.`,
  });

  // Notify receiver
  await sendMail({
    to: toUserAcc.email,
    subject: "Group Settlement Received",
    text: `${fromUserAcc.name} paid you ₹${amount} inside the group.`,
  });

  return { message: "Individual settlement complete" };
};
