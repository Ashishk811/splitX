import Group from "../models/Group.js";
import { simplifyDebts } from "./debtSimplifier.js";

export const autoSimplifyGroupBalances = async (groupId) => {
  const group = await Group.findById(groupId);
  const bal = {};

  group.members.forEach(id => bal[id] = {});

  for (const key of group.balances.keys()) {
    const [from, to] = key.split("_");
    const amt = group.balances.get(key);
    if (amt > 0) bal[from][to] = amt;
  }

  const simplified = simplifyDebts(bal);

  group.balances = new Map();

  for (const from in simplified) {
    for (const to in simplified[from]) {
      const amt = simplified[from][to];
      if (amt > 0) group.balances.set(`${from}_${to}`, amt);
    }
  }

  await group.save();
};
