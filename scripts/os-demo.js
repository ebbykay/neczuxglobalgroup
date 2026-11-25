"use strict";
(() => {
 const $ = id => document.getElementById(id);
 let stage=0,paid=3000,done=1;
 const money=n=>new Intl.NumberFormat("en-GH",{style:"currency",currency:"GHS",maximumFractionDigits:0}).format(n);
 function render(){
  $("converted").textContent=stage===2?"2":"1";
  $("lead-status").textContent="Example Training Client — "+["New","Qualified","Converted"][stage];
  $("advance").textContent=["Qualify example lead","Convert example lead","Converted"][stage];
  $("advance").disabled=stage===2;
  $("collected").textContent=money(paid);
  $("balance").textContent=money(5400-paid);
  $("payment").disabled=paid===5400;
  $("payment").textContent=paid===5400?"Example invoice paid":"Record fictional "+money(Math.min(500,5400-paid))+" payment";
  $("progress").value=done;
  $("project-status").textContent=done+" of 2 tasks completed";
  $("complete").disabled=done===2;
 }
 $("advance").addEventListener("click",()=>{stage=Math.min(2,stage+1);render();$("notice").textContent="Example lead updated.";});
 $("payment").addEventListener("click",()=>{paid=Math.min(5400,paid+500);render();$("notice").textContent="Fictional payment recorded.";});
 $("complete").addEventListener("click",()=>{done=2;render();$("notice").textContent="Example project completed.";});
 $("reset").addEventListener("click",()=>{stage=0;paid=3000;done=1;render();$("notice").textContent="Demonstration reset.";});
 render();
})();