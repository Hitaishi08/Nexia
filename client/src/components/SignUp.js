import React, { useState } from 'react'
import "./SignUp.css"
import axios from "axios"
import { Link , useNavigate} from 'react-router-dom'
import NavBar from './NavBar'
import TopBar from './TopBar'
const SignUp = () => {
  const [username,setname] = useState(' ');
  const [email,setemail] = useState(' ');
  const [password,setpassword] = useState(' ');
  const navigate = useNavigate();

  const submit = async(e) =>{
    e.preventDefault();

    try{
        const response = await axios.post('http://localhost:3003/user/signup',{
          username,email,password
        });
        if(response.status === 200)
        {
          alert("Registration Successful");
          navigate('/signin');
        }else if (response.status === 409) {
          alert("User already registered");
        }
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
      <div className='signup-section'>
    <div className='signup-card'>    
        <h2 className='signup-heading'>Welcome</h2>
        <p className='signup-desc'>SignUp to start</p>
        <form action='POST'>
            <label className='signup-label'>UserName</label><br/>
            <input type="text" required="true" placeholder='username' name='username' className='signup-input' onChange={(e)=>{setname(e.target.value)}}></input><br/>
            <label className='signup-label'>Email</label><br/>
            <input type="email" required="true" placeholder='email' name='email' className='signup-input' onChange={(e)=>{setemail(e.target.value)}}></input><br/>
            <label className='signup-label'>Password</label><br/>
            <input type="password" required="true" placeholder='password' name='password' className='signup-input' onChange={(e)=>{setpassword(e.target.value)}}></input><br/>
            <button type="submit" className='signup-button' onClick={submit} value="Submit">SignUp</button><br/>
            <p className='log-in-option' href=''>already have an account <Link to='/signin' >LogIn</Link></p>
        </form>
    </div>
    </div>
    </div>
    </div>
    </div>
    </>
  )
}

export default SignUp
