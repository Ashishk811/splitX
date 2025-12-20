import { useEffect, useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function GroupsPage(){
  const [groups,setGroups] = useState([]);
  const [loading,setLoading] = useState(true);
  const [g, setG] = useState({name:"",members:""});
  const [gid, setGid] = useState("");

  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [exp,setExp] = useState({desc:"",amt:0,paid:""});
  const [splitType,setSplitType] = useState("EQUAL");
  const [values,setValues] = useState([]);

  async function load(){
    const d = await api("/api/groups/my","GET",null,true);
    setGroups(d);
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  if(loading) return <div className="page"><Loader/></div>;

  async function createGroup(){
    await api("/api/groups/create","POST",{
      groupName:g.name, members:g.members.split(",")
    },true);
    toast.success("Group Created");
    load();
  }

  async function loadMembers(){
    const list = await api(`/api/groups/${gid}/members`,"GET",null,true);
    setMembers(list);
  }

  function toggleUser(uid){
    setSelected(s => s.includes(uid) ? s.filter(x=>x!==uid) : [...s,uid]);
  }

  async function addMember(){
    await api("/api/groups/add-member","POST",{
      groupId: gid,
      email: selectedUser
    }, true);
    toast.success("Member Added!");
    loadMembers();
  }

  async function addExpense(){
    const body = {
      description:exp.desc,
      amount:+exp.amt,
      paidUser:exp.paid,
      users:selected,
      splitType,
      values
    };
    await api(`/api/expenses/group/${gid}`,"POST",body,true);
    toast.success("Expense Added");
  }

  return (
    <div className="page">
      <h2 className="text-neon">👥 Groups + Expenses</h2>

      {groups.map(g=>(
        <div className="alert alert-success" key={g._id}>
          {g.groupName} ({g._id})
        </div>
      ))}

      {/* CREATE GROUP */}
      <div className="card p-3 my-4">
        <h4>Create Group</h4>
        <input className="form-control my-2" placeholder="Name"
          onChange={e=>setG({...g,name:e.target.value})}/>
        <input className="form-control my-2" placeholder="Member email IDs"
          onChange={e=>setG({...g,members:e.target.value})}/>
        <button className="btn btn-success" onClick={createGroup}>Create</button>
      </div>

      {/* ADD MEMBER */}
      <div className="card p-3 my-4">
        <h4>Add Member To Group</h4>
        <input className="form-control my-2" placeholder="Group ID"
          onChange={e=>setGid(e.target.value)}/>
        <input className="form-control my-2" placeholder="User email ID"
          onChange={e=>setSelectedUser(e.target.value)}/>
        <button className="btn btn-info" onClick={addMember}>Add Member</button>
      </div>

      {/* LOAD MEMBERS + ADD EXPENSE */}
      <div className="card p-3 my-4">
        <h4>Add Expense</h4>
        <input className="form-control my-2" placeholder="Group ID"
          onChange={e=>setGid(e.target.value)}/>
        <button className="btn btn-warning" onClick={loadMembers}>Load Members</button>

        {members.length > 0 && (
          <>
            <h5 className="mt-3">Members</h5>
            {members.map(m=>(
              <div className="form-check my-1" key={m._id}>
                <input className="form-check-input" type="checkbox"
                  onChange={()=>toggleUser(m._id)}/>
                <label>{m.name}</label>
              </div>
            ))}

            <input className="form-control my-2" placeholder="Description"
              onChange={e=>setExp({...exp,desc:e.target.value})}/>
            <input className="form-control my-2" placeholder="Amount"
              onChange={e=>setExp({...exp,amt:e.target.value})}/>
            <input className="form-control my-2" placeholder="Paid User ID"
              onChange={e=>setExp({...exp,paid:e.target.value})}/>

            <select className="form-control my-2"
              onChange={e=>setSplitType(e.target.value)}>
              <option>EQUAL</option>
              <option>PERCENT</option>
              <option>EXACT</option>
            </select>

            {splitType!=="EQUAL" && selected.map(uid=>(
              <input key={uid} className="form-control my-2"
                placeholder={splitType==="PERCENT"?"Percent":"Exact Amount"}
                onChange={e=>setValues(v=>[...v,Number(e.target.value)])}/>
            ))}

            <button className="btn btn-primary" onClick={addExpense}>Submit Expense</button>
          </>
        )}
      </div>
    </div>
  );
}
