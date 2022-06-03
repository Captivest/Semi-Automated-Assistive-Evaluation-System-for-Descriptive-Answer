import React, { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

function upload(){
    let ans=document.getElementById('ans').value;
    let qid=document.getElementById('qid').value;
    let l=document.getElementById('l').value;
    let s=document.getElementById('s').value;
    let g=document.getElementById('g').value;
    let k=document.getElementById('k').value;
    let ignr=document.getElementById('ignr').value;
    let marks=document.getElementById('marks').value;
    let leng=document.getElementById('leng').value;
    let body={'qid':qid,'m_answer':ans,'l':l,'s':s,'g':g,'k':k,'ignr':ignr,'marks':marks,'leng':leng};
    axios.post('http://127.0.0.1:5000/uploadquestion',body)
    .then(()=>{
    document.getElementById('ans').value='';
    document.getElementById('qid').value='';
    document.getElementById('l').value='';
    document.getElementById('s').value='';
    document.getElementById('g').value='';
    document.getElementById('k').value='';
    document.getElementById('ignr').value='';
    document.getElementById('marks').value='';
    document.getElementById('leng').value='';
      console.log("upload success")})
}

function Teacher(){
    let url=window.location.href;
    let x=url.split("/");
    let user=x[x.length-1];
    const [data,setData]=useState(null);
    const [t_data,t_setData]=useState(null);
    const [load,isLoad]=useState(true);
    useEffect(()=>{
        axios.get(`http://127.0.0.1:5000/fetchdata_t/${user}`)
       .then((response)=>{
         t_setData(response.data)
       })
        axios.get(`http://127.0.0.1:5000/fetchdatas`)
        .then(res=>{
            setData(res.data);
            isLoad(false)
        })
    },[])
    const navigate=useNavigate();
    console.log(data);
    if(load) return (<div></div>)
    else
    return (
      <div className='teacher'>
        <h1>{`Teacher = ${t_data.name}`}</h1>
        <ul className='formul extra'>
          <li><h2>Instructions</h2></li>
          <li>After successfull question upload input fields will go empty.</li>
          <li>Total sum of semantic, grammar, length and keyword parameters must be exactly equal to 1 else the scores will not be accurate.</li>
        </ul>
        <div className='teachinput'>     
        <label for="ans">Upload Model Answer- </label>
        <input type="text" id='ans'/>
        </div>
        <div className='teachinput'>     
        <label for="qid">Question ID- </label>
        <input type="text" id='qid'/>
        </div>
        <div className='teachinput'>     
        <label for="l">Length percentage- </label>
        <input type="text" id='l'/>
        </div>
        <div className='teachinput'>     
        <label for="s">Semantic percentage- </label>
        <input type="text" id='s'/>
        </div>
        <div className='teachinput'>     
        <label for="g">Grammar percentage- </label>
        <input type="text" id='g'/>
        </div>
        <div className='teachinput'>         
        <label for="k">Keyword percentage- </label>
        <input type="text" id='k'/>
        </div>
        <div className='teachinput'>     
        <label for="ignr">Ignore Words- </label>
        <input type="text" id='ignr'/>
        </div>
        <div className='teachinput'>     
        <label for="marks">Marks- </label>
        <input type="text" id='marks'/>
        </div>
        <div className='teachinput'>     
        <label for="leng">Text Length- </label>
        <input type="text" id='leng'/>
        </div>

        <button onClick={()=>upload()} className='button'>Upload</button>
        <ul className='cardul'>
            {data.map((i)=>(<div className='card'>
              <h3>{i.name}</h3>
              <ul>
                {i.result.map(x=><ul className='answer'>
                                    <li>{`Question ID = ${x.qid}`}</li>
                                    <li>{`Model Answer = ${x.m_answer}`}</li>
                                    <li>{`Submitted Answer = ${x.answer}`}</li>
                                    <li>{`Final Score = ${x.score}`}</li>
                              </ul>)}
              </ul>
            </div> 
            ))}
        </ul>
        <button onClick={()=>navigate("/")} className="button">Logout</button>
      </div>
    )
}

export default Teacher;
