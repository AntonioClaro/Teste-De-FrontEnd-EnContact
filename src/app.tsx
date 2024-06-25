import React from "react";


import "./app.css";
import Axios from "axios";
import useState from "react-usestateref";
import { useEffect, useRef } from "react";

export default function App() {

  let [stateData,setStateData,refData] = useState<any>([]);
  let [stateTasks, setStateTasks, refTasks] = useState<number>(0);
  let [stateId, setStateId, refId] = useState<number>(0);
  let inputRef:any = useRef();

  let FirstCall = () => {
    useEffect(()=>{
      Axios.get("https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos")
      .then(res => {setStateData(res.data); setStateTasks(res.data.length-1); setStateId(res.data.length+1)});
    }, []);
  }
  FirstCall();

  let setSubBlock = () => {
    if(refId.current-1!=0) {
    return [(
        <div id="subBlock">
          <span id="counter">{refTasks.current} items left!</span>
          <ul id="functions">
            <li>
              <a href="#/">All</a>
            </li>
            <li>
              <a href="#/active">Active</a>
            </li>
            <li>
              <a href="#/completed">Completed</a>
            </li>
          </ul>
          <button id="clear">Clear completed</button>
        </div>
      )]
    }
  }

  let changeStatus = (val:string) =>{
    let li = document.getElementById(val);
    let exclude = document.getElementById(val+"-exclude");
    //exclude.removeEventListener("click", ()=>{ExcludeStateItem(val, false);});

    if(li!.className == "item") {
      li!.className = "item done"
      exclude!.onclick = null;
      if(refTasks.current>0){
        setStateTasks(refTasks.current-1);
      }
      exclude!.onclick = ()=>{ExcludeStateItem(val); setStateId(stateId-1)};
    }
    else {
      if(li!.className == "item done"){
        li!.className = "item";
        exclude!.onclick = null;
        setStateTasks(refTasks.current+1);
        exclude!.onclick = ()=>{ExcludeStateItem(val); setStateId(stateId-1); if(refTasks.current>0){setStateTasks(stateTasks-1)};};
      }
      
    }
  }

  let AddItem = (val:any) => {
    let idName = val.id;
    let name:string = "";
    let check:boolean = false;
    let excludeBTN:string = val.id+"-exclude";
    let clickEvent = ()=>{}

    if(val.isDone) {
      name = "item done";
      check = true;
      clickEvent = ()=>{
        ExcludeStateItem(idName);
        setStateId(stateId-1);
      }
    }
    else {
      name = "item";
      check = false;
      clickEvent = ()=>{
        ExcludeStateItem(idName);
        setStateId(stateId-1);
        if(refTasks.current>0){
          setStateTasks(stateTasks-1)
        }
      }
    }
    return(
      <li id={idName} className={name}>
        <div className="itemComponents">
          <input className="toggleCheckbox" type="checkbox" defaultChecked={check} onClick={()=>{changeStatus(idName)}}/>
          <label contentEditable="true">{val.title}</label>
          <button className="excludeBTN" id={excludeBTN} onClick={clickEvent}></button>
        </div>
      </li>
    )
    // itemCheckRef.current.checked
  }

  let AddStateItem = (val:string) => {
      setStateData([...stateData, {id:String(stateId), title:val, isDone:false}]);
      setStateId(stateId+1);
      setStateTasks(stateTasks+1);
  }

  let ExcludeStateItem = (val:string) => {
    if(document.getElementById(val)!=null){
      document.getElementById(val)!.remove();
      //setStateData((newArr:any) => {return newArr.filter((i:any)=> (i!==val))});
    }
    
    
  }
  
  return (
    <>
    <div id="block">

      <div id="headerBlock">
        <h1>todos</h1>
        <input id="addInput" type="text" placeholder="What needs to be done?" ref={inputRef} onKeyPress={(e)=>{if(e.key=="Enter"){AddStateItem(e.currentTarget.value); inputRef.current.value=""}}}/>
      </div>

      <div id="mainBlock">
        <div id="toggle">
            <input id="toggleBTN" type="checkbox" />
            <label htmlFor="toggleBTN"></label>
        </div>
          <ul id="items">
            {refData.current.map((val:any)=>(
              AddItem(val)
            ))}
          </ul>
      </div>

      {setSubBlock()}

    </div>

    <div id="footerBlock">
      <p>Double-click to edit a todo</p>
      <p>Created by the TodoMVC Team</p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </div>
    </>

  );
}