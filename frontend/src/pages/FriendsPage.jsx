import { useEffect, useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function FriendsPage(){
  const [list,setList] = useState([]);
  const [loading,setLoading] = useState(true);
  const [id,setId] = useState("");
  const [sg,setSg]=useState({gid:"",from:"",to:"",amt:""});
  const [si,setSi]=useState({from:"",to:"",amt:""});
  const [owe,setOwe]=useState([]);
  const [owed,setOwed]=useState([]);

  async function load(){
    setList(await api("/api/users/friends","GET",null,true));
    setOwe(await api("/api/users/owe","GET",null,true));
    setOwed(await api("/api/users/owed-by","GET",null,true));
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  if(loading) return <div className="page"><Loader/></div>;

  async function add(){ await api("/api/users/add-friend","POST",{friendId:id},true); toast.success("Added"); load(); }
  async function remove(){ await api("/api/users/remove-friend","POST",{friendId:id},true); toast.error("Removed"); load(); }

  async function settleGroup(){
    await api("/api/expenses/settle/group","POST",{
      groupId:sg.gid, from:sg.from, to:sg.to, amount:+sg.amt
    },true);
    toast.success("Group Settled");
  }
  async function settleInd(){
    await api("/api/expenses/settle/individual","POST",{
      from:si.from, to:si.to, amount:+si.amt
    },true);
    toast.success("Settled");
  }

  return (
    <div className="page">
      <h2 className="text-neon">🧑‍🤝‍🧑 Friends & Settlements</h2>

      <ul className="list-group">
        {list.map(f=>(
          <li className="list-group-item" key={f._id}>{f.name} ({f.email})</li>
        ))}
      </ul>

      <div className="card p-3 my-3">
        <h4>Manage Friend</h4>
        <input className="form-control my-2" placeholder="Friend ID" onChange={e=>setId(e.target.value)}/>
        <button className="btn btn-success me-2" onClick={add}>Add</button>
        <button className="btn btn-danger" onClick={remove}>Remove</button>
      </div>

      <div className="card p-3 my-3">
        <h4>Group Settlement</h4>
        <input className="form-control my-2" placeholder="Group ID" onChange={e=>setSg({...sg,gid:e.target.value})}/>
        <input className="form-control my-2" placeholder="From" onChange={e=>setSg({...sg,from:e.target.value})}/>
        <input className="form-control my-2" placeholder="To" onChange={e=>setSg({...sg,to:e.target.value})}/>
        <input className="form-control my-2" placeholder="Amount" onChange={e=>setSg({...sg,amt:e.target.value})}/>
        <button className="btn btn-warning" onClick={settleGroup}>Settle</button>
      </div>

      <div className="card p-3 my-3">
        <h4>Individual Settlement</h4>
        <input className="form-control my-2" placeholder="From" onChange={e=>setSi({...si,from:e.target.value})}/>
        <input className="form-control my-2" placeholder="To" onChange={e=>setSi({...si,to:e.target.value})}/>
        <input className="form-control my-2" placeholder="Amount" onChange={e=>setSi({...si,amt:e.target.value})}/>
        <button className="btn btn-danger" onClick={settleInd}>Settle</button>
      </div>

      <div className="card p-3 my-3">
        <h4>Who I Owe</h4>
        {owe.map((x,i)=>(
          <div key={i} className="alert alert-danger">
            You owe {x.user?.name} ₹{x.amount}
          </div>
        ))}
      </div>

      <div className="card p-3 my-3">
        <h4>Who Owes Me</h4>
        {owed.map((x,i)=>(
          <div key={i} className="alert alert-success">
            {x.user?.name} owes you ₹{x.amount}
          </div>
        ))}
      </div>
    </div>
  );
}
