import {React,useEffect,useState} from 'react'
import "./NavBar.css"
import user from '../assets/user (1).png'
import dashboard from '../assets/dashboard (1).png'
import openfile from '../assets/open-file (1).png'
import bell from '../assets/bell (1).png'
import logout from '../assets/logout (1).png'
import logo from '../assets/letter-n.png'
import { Link } from 'react-router-dom'
import axios from 'axios'

const NavBar = () => {
  const [loggout,setloggout] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const logoutfunc = async (e) => {
    e.preventDefault()
    if(!loggout){
    const response = await axios.delete('http://localhost:3003/user/logout',{ withCredentials: true });
    console.log(response.status);
    if(response.status===200)
    {
      alert("Logged Out Successfully");
      setloggout(true);
      window.location.href = '/';
      console.log("Logged Out Successfully"); 
    }else{
      alert("can not able to logged out");
    }
  }else{
    setloggout(true);
    alert("already logged out");
  }
  }
  useEffect(()=>{
    fetchProfileImage();
  },[]);

    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/profile/profilepicture`, {
          withCredentials: true,
        });
        console.log("image data:", res.data)
        setProfileImage(res.data.imageUrl); // directly use the URL
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    };
  return (
    <>
    <div className='nav-section'>
        <div className='logo'><img src={logo} alt="User"  className='logo-icon'/></div>
        <div className='nav-items'>
        <div className='item div-item1'><Link to='/profile' ><img src={user} alt="User"  className='icon'/></Link></div> 
        <div className='item div-item2'><Link to='/dashboard' ><img src={dashboard} alt="dashboard" className='icon'/></Link></div> 
        <div className='item div-item3'><img src={openfile} alt="openfile" className='icon'/></div> 
        <div className='item div-item4'><img src={bell} alt="bell" className='icon'/></div>
        <div className='item div-item5' onClick={(e)=>{logoutfunc(e)}}><img src={logout} alt="logout" className='icon'/></div>
        </div>
        <img 
        src={profileImage ? profileImage : logo} 
        alt="User"  
        className='profilephoto'
        />
    </div>
    </>
  )
}

export default NavBar
