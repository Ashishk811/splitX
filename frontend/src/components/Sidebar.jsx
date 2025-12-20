import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { clearToken } from "../auth";
import {
  FaHome, FaUsers, FaUserFriends,
  FaHistory, FaBars, FaSignOutAlt, FaRobot
} from "react-icons/fa";

export default function Sidebar(){
  const [open, setOpen] = useState(true);
  const nav = useNavigate();

  function logout(){
    clearToken();
    nav("/");
  }

  const menu = [
    { to:"/dashboard", icon:<FaHome/>, text:"Dashboard" },
    { to:"/groups", icon:<FaUsers/>, text:"Groups & Expenses" },
    { to:"/friends", icon:<FaUserFriends/>, text:"Friends & Settlements" },
    { to:"/history", icon:<FaHistory/>, text:"History" },
    { to:"/agent", icon:<FaRobot/>, text:"AI Agent" },

  ];

  return (
    <motion.div 
      animate={{ width: open ? 230 : 70 }}
      className="sidebar bg-dark border-end"
    >
      <div className="p-3 d-flex justify-content-between">
        <span className="text-success fw-bold">{open ? "💳 Expense" : "💳"}</span>
        <FaBars className="text-success" style={{cursor:"pointer"}} onClick={()=>setOpen(!open)} />
      </div>

      <ul className="list-unstyled px-2">
        {menu.map((m,i)=>(
          <li key={i} className="my-2">
            <Link to={m.to} className="sidebar-item">
              {m.icon}
              {open && <span className="ms-2">{m.text}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="logout-box">
        <button className="btn btn-danger w-100" onClick={logout}>
          <FaSignOutAlt/> {open && "Logout"}
        </button>
      </div>
    </motion.div>
  );
}
