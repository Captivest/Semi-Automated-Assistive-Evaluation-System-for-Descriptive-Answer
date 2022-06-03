import './App.css';
import Home from './Home';
import Teacher from './Teacher';
import Student from './Student';
import React from 'react'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';

function App(){
    return (
      <Router>
        <Routes>
          <Route exact path='/' element={<Home navigate={1+2}/>}></Route>
          <Route exact path='/student/:user' element={<Student navigate={1+2}/>}></Route>
          <Route exact path='/teacher/:teach' element={<Teacher navigate={1*2}/>}></Route>
        </Routes>
      </Router>
    );
  }

export default App;  





// <div className='main'>
      //   <h1>Assistive Evaluation System</h1>
      //   <h3>Just copy the text to be evaluated and the model text and tap on evaluate button.Simple!</h3>
      //   <form className='evalbox'>
      //     <label htmlFor="original">Original Answer- </label>
      //     <input type="text" id='original' name='original'></input>
      //     <label htmlFor="model">Model Answer- </label>
      //     <input type="text" id='model' name='model'></input>
      //     <button type="submit" onClick={(e)=>this.postcont(e)} className='evalbut'>Evaluate</button>
      //   </form>
      //   <div className='result'>
      //     <h2>{`Result-> ${this.state.result}`}</h2>
      //     <button onClick={(e)=>this.showres(e)}>Show Result</button>
      //   </div>
      // </div>

// function postcont(e){
//   e.preventDefault()
//   var data1=document.getElementById('original').value
//   var data2=document.getElementById('model').value
//   var data={"original": data1,"model": data2}
//   console.log("yo")
//   return fetch('http://127.0.0.1:5000/post',{
//     method:'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data)
// }
//   ).then(console.log(data))
// }

// function App() {
//   var result=90;
//   return (
//     <div className='main'>
//       <h1>Assistive Evaluation System</h1>
//       <h3>Just copy the text to be evaluated and the model text and tap on evaluate button.Simple!</h3>
//       <form className='evalbox'>
//         <label htmlFor="original">Original Answer- </label>
//         <input type="text" id='original' name='original'></input>
//         <label htmlFor="model">Model Answer- </label>
//         <input type="text" id='model' name='model'></input>
//         <button type="submit" onClick={(e)=>postcont(e)} className='evalbut'>Evaluate</button>
//       </form>
//       <div className='result'>
//         <h2>{`Result-> ${result}`}</h2>
//       </div>
//     </div>
//   );
// }

// export default App;
