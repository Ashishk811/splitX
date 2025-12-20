import { useEffect, useState } from "react";
import { api } from "../api";
import Loader from "../components/Loader";

export default function HistoryPage(){
  const [list,setList]=useState(null);

  async function load(){
    setList(await api("/api/users/history","GET",null,true));
  }

  useEffect(()=>{ load(); },[]);

  if(!list) return <div className="page"><Loader/></div>;

  return (
    <div className="page">
      <h2 className="text-neon">📜 History</h2>
      <ul className="list-group">
        {list.map((h,i)=>(
          <li className="list-group-item" key={i}>
            <b>{h.action}</b> ({h.mode}) of ₹{h.amount}<br/>
            <small>{new Date(h.time).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
