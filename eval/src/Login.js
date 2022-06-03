import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function login(props) {
    const formlogin=(e)=>{
        e.preventDefault();

        let username=document.getElementById('username').value;
        let password=document.getElementById('password').value;
        let d={username,password};
        var type;
        if (props.formSubmitType==='student') type='login_s'
        else type='login_t'
        fetch(`http://127.0.0.1:5000/${type}`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(d)
            }
        ).then(data=>data.json())
        .then(d=>{
            if (d.hasOwnProperty("username")){
                navigate(`/${props.formSubmitType}/${d.username}`);
                console.log(d.username);
            }
            else
                {
                    document.getElementById('username').value='';
                    document.getElementById('password').value='';
                }
        });
    }
    const navigate=useNavigate();      
  return (
    <div className='form'>
        <h2>Login Page</h2>
        <form className='form1'>
            <div className='forminput'>
                <label for="username">Username </label>
                <input type="text" name="username" id='username' placeholder='Username' required></input>
            </div>
            <div className='forminput'>
                <label for="username">Password </label>
                <input type="password" name="password" id='password' placeholder='Password' required></input>
            </div>
            <button type="submit" onClick={(e)=>formlogin(e)} className="button">Login</button>
        </form>
        <ul className='formul'>
            <li><h2>Instructions</h2></li>
            <li>If after tapping login button the input field goes blank then either the username or the password or both are wrong.</li>
        </ul>
    </div>
  )
}
