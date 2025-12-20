import Expense from "../models/Expense.js";
import { updateUserBalance } from "./balanceService.js";
import { addHistory } from "./historyService.js";
import User from "../models/User.js";
import { sendMail } from "./mailService.js";

function calc(amount, users, type, values) {
  if (type === "EQUAL")
    return users.map((u) => ({ user: u, amount: amount / users.length }));
  if (type === "PERCENT")
    return users.map((u, i) => ({
      user: u,
      amount: (amount * values[i]) / 100,
    }));
  if (type === "EXACT")
    return users.map((u, i) => ({ user: u, amount: values[i] }));
}

export const createIndividualExpense = async ({
  description,
  amount,
  paidUser,
  users,
  splitType,
  values,
}) => {
  const splits = calc(amount, users, splitType, values);

  const exp = await Expense.create({
    description,
    amount,
    paidUser,
    paidGroup: null,
    splits,
  });

  for (const s of splits) {
    if (String(s.user) !== String(paidUser))
      await updateUserBalance(s.user, paidUser, s.amount);
    const debtor = await User.findById(s.user);
    const payer = await User.findById(paidUser);

    await sendMail({
      to: debtor.email,
      subject: `You owe ₹${s.amount} (Individual Expense)`,
      text: `${payer.name} added an individual expense "${description}".\nYou owe ₹${s.amount} to ${payer.name}.`,
    });

    await sendMail({
      to: payer.email,
      subject: `Individual Expense Logged`,
      text: `${debtor.name} owes you ₹${s.amount} for "${description}".`,
    });

    await addHistory({
      user: s.user,
      action: "EXPENSE",
      mode: "INDIVIDUAL",
      amount: s.amount,
      against: paidUser,
      group: null,
    });

    await addHistory({
      user: paidUser,
      action: "EXPENSE",
      mode: "INDIVIDUAL",
      amount: s.amount,
      against: s.user,
      group: null,
    });
  }

  return exp;
};
