import History from "../models/History.js";
import User from "../models/User.js";

export const addHistory = async ({ user, action, mode, amount, against, group }) => {
  const record = await History.create({ user, action, mode, amount, against, group });

  // push history pointer to User
  const u = await User.findById(user);
  u.history.push(record._id);
  await u.save();

  return record;
};
