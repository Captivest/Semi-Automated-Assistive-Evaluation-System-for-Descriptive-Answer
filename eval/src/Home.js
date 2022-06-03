//import Student from "./Student"
import Login from "./Login"
import React, { Component } from 'react'
//import { BrowserRouter as Router,Routes, Route, Link , Navigate, useNavigate} from 'react-router-dom';

const Form=(props)=>(
    <div className="home">
        <h1>Semi Automated Assistive Evaluation System</h1>
        <h3>Just copy the text to be evaluated and the model text and tap on evaluate button.Simple!</h3>
        <h2>{props.formSubmitType}</h2>
        <form className='form'>
            <div className="forminput">
            <label for="name">Name- </label>
            <input type="text" name="name" id='name' required></input>
            </div>
            <div className="forminput">
            <label for="username">Username- </label>
            <input type="text" name="username" id='username' required></input>
            </div>
            <div className="forminput">
            <label for="username">Password- </label>
            <input type="password" name="password" id='password' required></input>
            </div>
            <div className="forminput">
            <label for="teacher">Teacher- </label>
            <input type="radio" name="type" id='teacher' value={1} required></input>
            </div>
            <div className="forminput">
            <label for="student">Student- </label>
            <input type="radio" name="type" id='student' value={0} required></input>
            </div>

            <button type="submit" onClick={props.register} className="button">{props.formSubmitType}</button>
        </form>
    </div>
    
)

// const LoginForm=(props)=>(
//     <form className='form'>
//         <label for="username">Username- </label>
//         <input type="text" name="username" id='username' required></input>
//         <label for="username">Password- </label>
//         <input type="password" name="password" id='password' required></input>
//         <button type="submit" onClick={props.login}>{props.formSubmitType}</button>
//     </form>
// )

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state={loginT:0,loginS:0,register:0,home:1,regsuc:0};
        this.register=this.register.bind(this);
    }
    
    register(e){
        e.preventDefault();
        let name=document.getElementById('name').value;
        let username=document.getElementById('username').value;
        let password=document.getElementById('password').value;
        let type=document.querySelector('input[name="type"]:checked').value
        let d={
            name,
            username,
            password,
            type
        };
        return fetch('http://127.0.0.1:5000/register',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(d)
            }
        ).then(()=>{
            this.setState({regsuc:1});
         })
    }

    login(e){
        e.preventDefault();

        let username=document.getElementById('username').value;
        let password=document.getElementById('password').value;
        let d={username,password};
        return fetch('http://127.0.0.1:5000/login_s',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(d)
            }
        ).then(data=>data.json())
        .then(d=>{
            if (d.hasOwnProperty("username"))
                // navigate(`/student/${d.username}`);
                console.log("yes")
            else
                {
                    document.getElementById('username').value='';
                    document.getElementById('password').value='';
                }
        });
        // .then(d=>{
        //     console.log(d)
        //     if(d.hasOwnProperty("username")) {
        //       return <Link to={{
        //             pathname:`/student/${d.username}`,
        //             state:[{"name":d.username}]
        //         }}/>
        //     }
        //     else{
        //         document.getElementById('username').value='';
        //         document.getElementById('password').value='';
        //     }
        // })
    }
    
    render() {
        if(this.state.regsuc===1){
            return (<div className="home">
                <h1>Register Success</h1>
                <button className="button"><a href="/">click to goto homepage</a></button>
             </div>)
        }
        else if (this.state.home===1){
            return (
                <div className="home">
                    <h1>Semi Automated Assistive Evaluation System</h1>
                    <h3>Just copy the text to be evaluated and the model text and tap on evaluate button.Simple!</h3>
                    <div className="buttons">
                        <button onClick={()=>this.setState({loginT:1,home:0})} className="button">Login as Teacher</button>  
                        <button onClick={()=>this.setState({loginS:1,home:0})} className="button">Login as Student</button>  
                        <button onClick={()=>this.setState({register:1,home:0})} className="button">Register</button>
                    </div> 
                </div>
            )
            }    
        else if(this.state.loginT===1){
            return <Login formSubmitType="teacher"/>
        }
        else if(this.state.loginS===1){
            return <Login formSubmitType="student"/>
        }
        else if(this.state.register===1){
            return <Form register={(e)=>this.register(e)} formSubmitType="Register"/>
        }
    }
}
