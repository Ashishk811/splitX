import { getToken } from "./auth";

const BASE = "http://localhost:5000";

export async function api(url, method="GET", body=null, auth=false){
  let opt = { method, headers:{ "Content-Type":"application/json" }};
  if(auth) opt.headers.Authorization = "Bearer " + getToken();
  if(body) opt.body = JSON.stringify(body);
  let r = await fetch(BASE+url, opt);
  return r.json();
}
