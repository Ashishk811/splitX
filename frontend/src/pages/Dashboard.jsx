import { useEffect, useState } from "react";
import { api } from "../api";
import Loader from "../components/Loader";

export default function Dashboard(){
  const [data, setData] = useState(null);

  async function load(){
    const profile = await api("/api/users/profile","GET",null,true);
    const owe = await api("/api/users/owe","GET",null,true);
    const owed = await api("/api/users/owed-by","GET",null,true);
    setData({ profile, owe, owed });
  }

  useEffect(()=>{ load(); },[]);

  if(!data) return <div className="page"><Loader/></div>;

  return (
    <div className="page">
      <h2 className="text-neon mb-3">🚀 Dashboard</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h4>{data.profile.name}</h4>
            <h4>{data.profile.email}</h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h4>Groups</h4>
            <h2 className="text-neon">{data.profile.groupsList.length}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h4>Friends</h4>
            <h2 className="text-neon">{data.profile.friends?.length || 0}</h2>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3 text-center">
            <h4>You Owe</h4>
            <h2 className="text-neon">
              ₹{data.owe.reduce((t,v)=>t+v.amount,0)}
            </h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 text-center">
            <h4>Owed By Others</h4>
            <h2 className="text-neon">
              ₹{data.owed.reduce((t,v)=>t+v.amount,0)}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
