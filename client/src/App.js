import React from 'react'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from'react-router-dom'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'

// import SignIn from './components/SignIn'
const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path='/signin' element={<SignIn />}/>
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

