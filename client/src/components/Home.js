import React from 'react'
import NavBar from './NavBar'
import TopBar from './TopBar'
import "./Home.css"
import Herosection from './Herosection'
const Home = () => {
  return (
    <>
    <div className="container">
    <div className='side-nav-section'>
    <NavBar />
    </div>
    <div className='main-section'>
    <TopBar/>
    <div className='component-section'>
      <Herosection/>
    </div>
    </div>
    </div>
    </>
  )
}

export default Home
