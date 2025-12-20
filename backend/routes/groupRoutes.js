import express from "express";
import { auth } from "../middleware/auth.js";
import { createGroup, addMemberToGroup, viewUserGroups, leaveGroupOnlyIfClear,getGroupMembers,getGroupExpenses, getGroupExpenseStatus } from "../controllers/groupController.js";


const router = express.Router();

router.post("/create", auth, createGroup);
router.post("/add-member", auth, addMemberToGroup);
router.get("/my", auth, viewUserGroups);
router.post("/leave", auth, leaveGroupOnlyIfClear);
router.get("/:groupId/members", auth, getGroupMembers);
router.get("/:groupId/expenses", auth, getGroupExpenses);
router.get("/:groupId/expense-status", auth, getGroupExpenseStatus);


export default router;
