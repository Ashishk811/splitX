import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import { updateGroupBalance } from "./groupBalanceService.js";
import { autoSimplifyGroupBalances } from "./simplifyAutomation.js";
import { addHistory } from "./historyService.js";
import User from "../models/User.js";
import { sendMail } from "./mailService.js";
import { updateUserBalance } from "./balanceService.js";

function calculate(amount, users, type, values) {
  if (type === "EQUAL") {
    const per = amount / users.length;
    return users.map((u) => ({ user: u, amount: per }));
  }
  if (type === "PERCENT") {
    return users.map((u, i) => ({
      user: u,
      amount: (amount * values[i]) / 100,
    }));
  }
  if (type === "EXACT") {
    return users.map((u, i) => ({ user: u, amount: values[i] }));
  }
}

export const createGroupExpense = async ({
  groupId,
  description,
  amount,
  paidUser,
  users,
  splitType,
  values,
}) => {
  if (users.length < 2) throw new Error("Expense needs at least 2 members");

  const group = await Group.findById(groupId);
  const valid = users.every((u) =>
    group.members.map(String).includes(String(u))
  );
  if (!valid) throw new Error("All users must be group members");

  const splits = calculate(amount, users, splitType, values);

  const exp = await Expense.create({
    description,
    amount,
    paidUser,
    paidGroup: groupId,
    splits,
  });

  for (const s of splits) {
    if (String(s.user) !== String(paidUser)) {
      await updateGroupBalance(groupId, s.user, paidUser, s.amount);
      await updateUserBalance(s.user, paidUser, s.amount);

      const debtor = await User.findById(s.user);
      const payer = await User.findById(paidUser);

      // Email debtor
      await sendMail({
        to: debtor.email,
        subject: `You owe ₹${s.amount} in group expense`,
        text: `${payer.name} added an expense "${description}" in group.\nYou owe ₹${s.amount} to ${payer.name}.`,
      });

      // Email payer
      await sendMail({
        to: payer.email,
        subject: `Group expense recorded`,
        text: `${debtor.name} has been added as owing ₹${s.amount} on "${description}".`,
      });

      await addHistory({
        user: s.user,
        action: "EXPENSE",
        mode: "GROUP",
        amount: s.amount,
        against: paidUser,
        group: groupId,
      });

      await addHistory({
        user: paidUser,
        action: "EXPENSE",
        mode: "GROUP",
        amount: s.amount,
        against: s.user,
        group: groupId,
      });
    }
  }

  await autoSimplifyGroupBalances(groupId);

  return exp;
};
