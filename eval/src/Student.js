import React, { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

function evaluate(item,user,ind){
  let answer=document.getElementById(`${ind}`).value;
  let body={"username":user.username,"qid":item.qid,"answer":answer,"m_answer":item.m_answer,"l":item.l,"s":item.s,"g":item.g,"k":item.k,"ignr":item.ignr,"marks":item.marks,"leng":item.leng};
  console.log(body)
  axios.post('http://127.0.0.1:5000/evaluate',body)
  .then((res)=>{
    let result={"username":user.username,"result":res.data}
    axios.post('http://127.0.0.1:5000/insertresult',result)
    .then((response)=>{
      document.getElementById(`${ind}`).value=''
      console.log(response.data)
    })

  })
}

function Student(){
    let url=window.location.href;
    let x=url.split("/");
    let username=x[x.length-1];
    const [answers,getAnswers]=useState(null);
    const [data,setData]=useState(null);
    const [load,isLoad]=useState(true);
    useEffect(()=>{
      axios.get('http://127.0.0.1:5000/fetchquestion')
      .then((res)=>{
        getAnswers(res.data)
      })
      axios.get(`http://127.0.0.1:5000/fetchdata_s/${username}`)
       .then((response)=>{
         setData(response.data)
         isLoad(false)
       })
    },[])
       
    const navigate=useNavigate();
    console.log(answers)
    console.log(data)
    if(load) return(<div>
    </div>)
    else
    return (
      <div className='student'>
        <h1>{`Student Name - ${data.name}`}</h1>
        <ul className='formul'>
          <li><h2>Instructions</h2></li>
          <li>Write the answer corresponding to the question ID given and click on evaluate.</li>
          <li>After clicking on evaluate wait for approximately 3 minutes before evaluate the next answer.</li>
          <li>After the evaluation is completed the textbox will become empty.</li>
        </ul>
        <ul>
          {answers.map((item,index)=>{
            if(!data.result.find((j)=>item.qid===j.qid)){
            return (<li>
              <span>{`Question ID = ${item.qid}`}</span>
              <div className='liform'>
                <label for={`${index}`}>Answer </label>
                <input type="text" id={`${index}`}/>
              </div>
              <button onClick={()=>evaluate(item,data,index)} className='button'>Evaluate</button>
            </li>)
            }
        })}
        </ul> 
        <button onClick={()=>navigate("/")} className='button'>Logout</button>
      </div>
    )
}

export default Student;
