import React from 'react'
import "./Herosection.css"
import { Link } from 'react-router-dom';
const Herosection = () => {
  return (
    <>
    <div className='hero-sec-img'>
        <h1 className='hero-sec-heading'>From Idea to Execution</h1>
        <p className='hero-sec-desc'>Unlock powerful project management tools designed to help you collaborate, track progress, and deliver results—on time, every time. Whether you’re a team leader or a team member, our platform makes it easy to stay organized and focused.</p>
        <Link to="/signup">
        <button className='hero-sec-btn'>Discover Now</button>
        </Link>
    </div>
    </>
  )
}

export default Herosection
