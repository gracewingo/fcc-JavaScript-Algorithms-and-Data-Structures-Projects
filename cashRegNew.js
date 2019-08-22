let coinValue = [ ['PENNY', 0.01], ['NICKEL',.05], ['DIME', .10], ['QUARTER', .25], ['ONE', 1], ['FIVE',5],['TEN',10],['TWENTY',20],
['ONE HUNDRED',100]];

function checkCashRegister(price, cash, cid) {
  let changeNeeded = cash - price;
  let cidChange = cid.map(x => x[1]); 
  let totalInReg = cidChange.reduce((acc,v) => acc + v).toFixed(2)
  let changeDue = getChangeDue(changeNeeded,cidChange);
  return getStatus(totalInReg, changeDue, cid,changeNeeded)
}

function getChangeDue (changeNeeded,cidChange){
  let end = coinValue.length-1; 
  let changeDue = [];

  let findChangeDue = function(){
      for (let i = end; i >= 0; i--){
        if (changeNeeded >= coinValue[i][1] && changeNeeded > 0){
            if (subtractChangeFromDrawer(i,cidChange,coinValue[i][1])){
                changeNeeded -= coinValue[i][1]
                changeNeeded = changeNeeded.toFixed(2);
                addToChangeDue(changeDue,i);
                updateChangeDue(changeDue);
                return findChangeDue();
            } 
        }
    }
  }
  findChangeDue();
  return changeDue;
}


function updateChangeDue(changeDue){
  //fix long decimal/floating point stuff on the pennies 
  for (let i = 0; i < changeDue.length; i++){
    changeDue[i][1] = Number(changeDue[i][1].toFixed(2))
  }
  return changeDue; 
}

function subtractChangeFromDrawer(index,cidChange,cv){
  //subtract the change from the drawer & update the amount in drawer 
  for (let i = 0; i < cidChange.length; i++){
    //fix floating point weirdness 
    cidChange[i] = Number(cidChange[i].toFixed(2))
  }
  if ((cidChange[index] - cv) >= 0) {
    cidChange[index] = cidChange[index] - cv;
    return true;
  } else {
    return false; 
  }
}

function addToChangeDue(changeDue,i){
  //update the change (2D array) that you are giving to the customer 
  let copy = coinValue[i].slice();
  if (changeDue.length !== 0 ){
      if (changeDue[changeDue.length-1].includes(copy[0])){
          changeDue[changeDue.length-1][1] += copy[1];
          return changeDue;
      }  else {
        //when we are working with a new currency type & it is more than 1 in changeDue
        changeDue.push(copy);
        return changeDue;
      }
  }  else {
      changeDue.push(copy);
      return changeDue;
  }
}

function getStatus(total,changeDue,cid,changeNeeded){
  let changeDueValue = changeDue.map(x => x[1]).reduce((acc,cv) => acc + cv);
  changeDueValue = changeDueValue.toFixed(2);
  console.log(cid)
  let cashBack = {};
  
  if (total < changeNeeded || changeDueValue < changeNeeded){
    cashBack.status = "INSUFFICIENT_FUNDS";
    cashBack.change = [];
    
  } else if (changeNeeded == total){
    cashBack.status = "CLOSED"
    cashBack.change = cid;
  } else {
    cashBack.status = "OPEN"
    cashBack.change = changeDue;
  }
  return cashBack;
}

console.log(checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));

/*

Return {status: "INSUFFICIENT_FUNDS", change: []} if cash-in-drawer is less than the change due (aka change needed) OR -> if you cannot return the exact change.

//if cash in drawer (total) is equal to the change needed 
Return {status: "CLOSED", change: [...]} with cash-in-drawer as the value for the key change if it is equal to the change due.

Otherwise, return {status: "OPEN", change: [...]}, with the change due in coins and bills, sorted in highest to lowest order, as the value of the change key.

to do: re-factor the getchangedue function so it doesnt need four variables 
*/



