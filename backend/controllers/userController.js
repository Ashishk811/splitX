import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/Token.js";
import randomstring from "randomstring";
import { sendMail } from "../services/mailService.js";


export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashed });

    // create token entry
    const token = await new Token({
      userId: user._id,
      token: randomstring.generate()
    }).save();

    // verification URL
    const verifyURL = `http://localhost:5173/verify/${user._id}/${token.token}`;

    await sendMail({
      to: user.email,
      subject: "Verify your splitX account",
      text: `Click the link to verify: ${verifyURL}`
    });

    res.status(201).json({
      success: true,
      message: "Signup success, please verify via email"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "No user found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  if (!user.verified)
    return res
      .status(401)
      .json({ message: "Email not verified. Please verify first." });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
};


export const profile = async(req,res)=>{
  const user = await User.findById(req.user.userId).populate("groupsList");
  res.json(user);
};

export const addFriend = async(req,res)=>{
  const { friendId } = req.body;
  const user = await User.findById(req.user.userId);
  if(!user.friends.includes(friendId)) user.friends.push(friendId);
  await user.save();
  res.json({message:"Friend added"});
};

export const removeFriend = async(req,res)=>{
  const { friendId }=req.body;
  const user = await User.findById(req.user.userId);
  user.friends = user.friends.filter(f=>String(f)!==friendId);
  await user.save();
  res.json({message:"Friend removed"});
};

export const listFriends = async(req,res)=>{
  const user= await User.findById(req.user.userId).populate("friends");
  res.json(user.friends);
};

export const getHistory = async(req,res)=>{
  const user = await User.findById(req.user.userId)
    .populate({
      path: "history",
      populate: [
        { path: "against", select:"name email" },
        { path: "group", select:"groupName" }
      ]
    })
    .select("history");
    
  res.json(user.history);
};

export const getWhoIowe = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);

  const oweList = [];

  for (const [otherId, amount] of user.balances.entries()) {
    if (amount > 0.01) {
      const otherUser = await User.findById(otherId).select("name email");
      oweList.push({ user: otherUser, amount });
    }
  }

  res.json(oweList);
};

export const getWhoOwesMe = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);

  const owedList = [];

  for (const [otherId, amount] of user.balances.entries()) {
    if (amount < -0.01) {
      const otherUser = await User.findById(otherId).select("name email");
      owedList.push({ user: otherUser, amount: Math.abs(amount) });
    }
  }

  res.json(owedList);
  
};

export const verifyUser = async (req, res) => {
  try {
    const { id, token } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "Invalid user" });

    const check = await Token.findOne({ userId: id, token });
    if (!check) return res.status(400).json({ message: "Invalid verification link" });

    await User.findByIdAndUpdate(id, { verified: true });
    await Token.findByIdAndDelete(check._id); // remove used token

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
