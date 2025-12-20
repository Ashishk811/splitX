import express from "express";
import { agentCommand } from "../controllers/agentController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.post("/command", auth, agentCommand);

export default router;
