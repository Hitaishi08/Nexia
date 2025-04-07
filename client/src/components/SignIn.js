import React, { useState } from 'react'
import "./Signin.css"
import axios from 'axios'
import { Link } from 'react-router-dom'
import TopBar from './TopBar'
import NavBar from './NavBar'
const SignIn = () => {
  const [name,checkname] = useState(' ');
  const [password,checkpassword] = useState(' ');
  const submit = async(e) =>{
    e.preventDefault();
    try{
      console.log(name);
      await axios.post('http://localhost:3003/user/login', {name,password},{
        withCredentials: true,  // Ensure cookies are sent with the request
      });
      alert("Login Successful")
    }catch(err){
      console.log(err);
    }
  }
  return (
    <>
    <div className="container">
    <div className='side-nav-section'>
    <NavBar />
    </div>
    <div className='main-section'>
    <TopBar/>
    <div className='component-section'>
    <div className='signin-section'>
    <div className='signin-card'>    
        <h2 className='signin-heading'>Welcome Back!!</h2>
        <p className='signin-desc'>SignIn to start</p>
        <form method="POST" action="">
            <label className='signin-label'>UserName</label><br/>
            <input type="text" required="true" placeholder='username' name='name' className='signin-input' onChange={(e)=>{checkname(e.target.value)}}></input><br/>
            <label className='signin-label'>Password</label><br/>
            <input type="password" required="true" placeholder='password' name='password' className='signin-input' onChange={(e)=>{checkpassword(e.target.value)}}></input><br/>
            <button type="submit" className='signin-button' onClick={submit} value="Submit">SignIn</button><br/>
            <p className='log-in-option' href=''>Don't have an account <Link to='/signup' >Signup</Link></p>
        </form>
    </div>
    </div>
    </div>
    </div>
    </div>
    </>
  )
}

export default SignIn
