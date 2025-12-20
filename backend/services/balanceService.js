import User from "../models/User.js";

export const updateUserBalance = async (fromUser, toUser, amount) => {
  const from = await User.findById(fromUser);
  const current = from.balances.get(toUser) || 0;
  from.balances.set(toUser, current + amount);
  await from.save();

  const to = await User.findById(toUser);
  const curr2 = to.balances.get(fromUser) || 0;
  to.balances.set(fromUser, curr2 - amount);
  await to.save();
};
