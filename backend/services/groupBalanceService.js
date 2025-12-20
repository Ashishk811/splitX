import Group from "../models/Group.js";

export const updateGroupBalance = async (groupId, fromUserId, toUserId, amount) => {
  const group = await Group.findById(groupId);
  const key = `${fromUserId}_${toUserId}`;
  const current = group.balances.get(key) || 0;
  group.balances.set(key, current + amount);
  await group.save();
};
