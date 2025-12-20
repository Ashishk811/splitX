import { createGroup } from "../controllers/groupController.js";
import { createGroupExpense } from "../services/groupExpenseService.js";
import { createIndividualExpense } from "../services/individualExpenseService.js";
import { settleGroup, settleIndividual } from "../services/settlementService.js";
import { getWhoIowe, getWhoOwesMe } from "../controllers/userController.js";
import { getGroupExpenses } from "../controllers/groupController.js";
import User from "../models/User.js";

export async function createGroupService({ groupName, members }, userId) {
  return await createGroup({
    userId,
    groupName,
    members
  });
}

export async function addMemberService({ groupId, userIdToAdd }) {
  // call addMember logic here
}

export async function createGroupExpenseService({ groupId, description, amount, paidUser, users, splitType, values }) {
  return await createGroupExpense({
    groupId,
    description,
    amount,
    paidUser,
    users,
    splitType,
    values
  });
}

export async function createIndividualExpenseService(data) {
  return await createIndividualExpense(data);
}

export async function performGroupSettlement({ groupId, from, to, amount }) {
  return await settleGroup(groupId, from, to, amount);
}

export async function performIndividualSettlement({ from, to, amount }) {
  return await settleIndividual(from, to, amount);
}

export async function fetchOweList(data, userId){
  return await getWhoIowe({ user: { userId } });
}

export async function fetchOwedByList(data, userId){
  return await getWhoOwesMe({ user: { userId } });
}

export async function fetchGroupExpenses({ groupId }){
  return await getGroupExpenses({ params: { groupId } });
}

export async function fetchProfileService(_, userId){
  return await User.findById(userId).select("name email groupsList");
}
