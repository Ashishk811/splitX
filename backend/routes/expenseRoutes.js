import express from "express";
import { auth } from "../middleware/auth.js";
import { addGroupExpense, addIndividualExpense, settleInGroup, settleBetweenUsers } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/group/:groupId", auth, addGroupExpense);
router.post("/individual", auth, addIndividualExpense);
router.post("/settle/group", auth, settleInGroup);
router.post("/settle/individual", auth, settleBetweenUsers);

export default router;
