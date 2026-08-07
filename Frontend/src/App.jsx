import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import LoginOutPage from './pages/LoginOutPage'

const App = () => {
  return (
    <div>

      <Routes>
        <Route path='/sign-up' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/login-out' element={<LoginOutPage/>}/>
      </Routes>
    </div>
  )
}

export default App
