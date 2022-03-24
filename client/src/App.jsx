import React, { useLayoutEffect,useState } from 'react'
import {BrowserRouter as Router,Routes,Route, Navigate, useLocation} from 'react-router-dom';
import Sign_in from './sign-in-page/Sign_in'
import Sign_up from './sign-up-page/Sign_up'
import Dashboard from './Dashboard';
import Navbar from './Components/Navbar';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Auth/Firebase-Config';






const App = () => {
  const [user, setUser] = useState(null);

  onAuthStateChanged((auth),(curretUser)=>{
    setUser(curretUser)
  })
  
  
 
  return (
    
    <Router>
    <div>
    <Navbar  user={user} />
    <Routes>
       <Route path='/' element={!user ?<Sign_in/>:<Navigate to='/search'/>}></Route>
       <Route path='/register' element={!user ?<Sign_up />:<Navigate to='/search'/>}></Route>
       <Route path='/search' element={ user?<Dashboard />: <Navigate to='/' />}></Route>
        

      
    </Routes>
    </div>
    </Router>
    
  )
}

export default App