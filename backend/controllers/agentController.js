import { runAgent } from "../services/agentService.js";

export const agentCommand = async (req, res) => {
  const userId = req.user.userId;
  const { prompt } = req.body;
  const result = await runAgent(prompt, userId);
  res.json(result);
};
