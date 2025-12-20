import express from "express";
import { signup, login, profile, addFriend, removeFriend, listFriends,getWhoIowe, getWhoOwesMe, verifyUser } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
import { getHistory } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth, profile);
router.post("/add-friend", auth, addFriend);
router.post("/remove-friend", auth, removeFriend);
router.get("/friends", auth, listFriends);
router.get("/history", auth, getHistory);
router.get("/owe", auth, getWhoIowe);
router.get("/owed-by", auth, getWhoOwesMe);
router.get("/verify/:id/:token", verifyUser);

export default router;





