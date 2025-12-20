export function simplifyDebts(balanceMap) {
  const net = {};

  for (const user in balanceMap) net[user] = 0;

  for (const u in balanceMap) {
    for (const v in balanceMap[u]) {
      const amt = balanceMap[u][v];
      if (amt > 0) {
        net[u]+= amt;
        net[v]-= amt;
      }
    }
  }

  const creditors = [];
  const debtors = [];

  Object.entries(net).forEach(([id,val])=>{
    if(val > 0.01) creditors.push([id,val]);
    else if(val < -0.01) debtors.push([id,-val]);
  });

  creditors.sort((a,b)=>b[1]-a[1]);
  debtors.sort((a,b)=>b[1]-a[1]);

  const result = {};

  Object.keys(balanceMap).forEach(u=>result[u]={});

  let i=0,j=0;

  while(i<creditors.length && j<debtors.length) {
    const [c,cVal]=creditors[i];
    const [d,dVal]=debtors[j];
    const settle = Math.min(cVal,dVal);

    result[c][d]=settle;
    result[d][c]=-settle;

    creditors[i][1]-=settle;
    debtors[j][1]-=settle;

    if(creditors[i][1]<0.01) i++;
    if(debtors[j][1]<0.01) j++;
  }

  return result;
}
