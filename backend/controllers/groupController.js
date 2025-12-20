import Group from "../models/Group.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";

export const createGroup = async (req, res) => {
  const creatorId = req.user.userId;
  const { groupName, members } = req.body; // members = array of emails

  try {
    if (!members || members.length < 1) {
      return res
        .status(400)
        .json({ message: "At least one more member required" });
    }

    // 1. Get all user docs by email
    const users = await User.find({ email: { $in: members } });

    if (users.length !== members.length) {
      return res.status(400).json({
        message: "Some emails do not match any user",
        invalidEmails: members.filter(
          (m) => !users.map((u) => u.email).includes(m)
        ),
      });
    }

    // 2. Extract their _id values
    const memberIds = users.map((u) => u._id.toString());

    // 3. Add creator to the group (if not already there)
    const finalMembers = [...new Set([creatorId, ...memberIds])];

    // 4. Create group
    const group = await Group.create({ groupName, members: finalMembers });

    // 5. Push group into each user's groupList
    await User.updateMany(
      { _id: { $in: finalMembers } },
      { $push: { groupsList: group._id } }
    );

    res.json({ message: "Group created", group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const addMemberToGroup = async (req, res) => {
  const { groupId, email } = req.body;
console.log("Adding member to group:", groupId, email);
  try {
    // 1. Find Group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // 2. Find User by Email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    // 3. Check if already member
    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: "User already in group" });
    }

    // 4. Add to group + save
    group.members.push(user._id);
    await group.save();

    // 5. Update user's groupsList
    await User.findByIdAndUpdate(user._id, {
      $push: { groupsList: groupId }
    });

    res.json({ message: "Member added", group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const viewUserGroups = async (req, res) => {
  const userId = req.user.userId;

  const groups = await Group.find({ members: userId }).select(
    "groupName members"
  );

  res.json(groups);
};

export const leaveGroupOnlyIfClear = async (req, res) => {
  const userId = req.user.userId;
  const { groupId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (!group.members.includes(userId))
    return res.status(400).json({ message: "You are not part of this group" });

  // ❗ check balances in the group
  const hasDebt = Array.from(group.balances.keys()).some((key) =>
    key.includes(userId)
  );

  if (hasDebt)
    return res
      .status(403)
      .json({ message: "You cannot leave until all balances are settled" });

  // remove from members
  group.members = group.members.filter((m) => String(m) !== String(userId));
  await group.save();

  // remove group from user's groupList
  await User.findByIdAndUpdate(userId, {
    $pull: { groupsList: groupId },
  });

  res.json({ message: "You left the group", group });
};

export const getGroupMembers = async (req, res) => {
  const { groupId } = req.params;
  const group = await Group.findById(groupId).populate("members", "name email");
  if (!group) return res.status(404).json({ message: "Group not found" });
  res.json(group.members);
};

export const getGroupExpenses = async (req, res) => {
  const { groupId } = req.params;

  const expenses = await Expense.find({ paidGroup: groupId })
    .populate("paidUser", "name email")
    .populate("splits.user", "name email");

  res.json(expenses);
};

export const getGroupExpenseStatus = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ paidGroup: groupId })
      .populate("paidUser", "name email")
      .populate("splits.user", "name email");

    const summaries = expenses.map(ex => {

      const payer = ex.paidUser;   // can be null if user deleted

      const details = ex.splits.map(s => {
        const u = s.user; // populated user or null

        // build names safely
        const payerName = payer?.name || "Unknown User";
        const userName  = u?.name || "Unknown User";

        // who owes?
        let oweStatus = "User info missing in DB";

        if (payer && payer._id && u && u._id) {
          oweStatus =
            String(u._id) !== String(payer._id)
              ? `${userName} owes ${payerName} ₹${s.amount}`
              : `${payerName} paid their own share`;
        }

        return {
          user: u
            ? { _id: u._id, name: userName, email: u.email }
            : { name: "Unknown User" },

          amount: s.amount,

          owesTo: payer
            ? { _id: payer._id, name: payerName, email: payer.email }
            : { name: "Unknown User" },

          message: oweStatus
        };
      });

      return {
        description: ex.description,
        amount: ex.amount,
        payer: payer
          ? { _id: payer._id, name: payer.name, email: payer.email }
          : { name: "Unknown User" },
        date: ex.time,
        details
      };
    });

    res.json(summaries);

  } catch (error) {
    console.error("Error fetching expense summaries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

