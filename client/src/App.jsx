import React, { useContext, useEffect,useState } from 'react'
import {BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom';
import Sign_in from './Pages/Sign_in'
import Sign_up from './Pages/Sign_up'
import PasswordReset from './Pages/PassswordReset'
import Dashboard from './Pages/Dashboard';
import Navbar from './Pages/Navbar';
import Errorpage from './ERRORpage'
import { AuthProvider,AuthContext } from './context/AuthContext';
import PrivateIndex from './ProtectedRoutes/PrivateIndex';
import PreventForms from './ProtectedRoutes/PreventForms';
import Sign_In from './Pages/Sign_In';
import UserProfile from './Pages/UserProfile';






const App = () => {
 
  
  
 
  return (
    
    <Router>
    <div>
    <AuthProvider>

    <Navbar  />
    <Routes>
      
       <Route path='/' element={<PreventForms><Sign_In/></PreventForms>}></Route>
       <Route path='/register' element={<PreventForms><Sign_up /></PreventForms>}></Route>
       <Route path='/search' element={<PrivateIndex><Dashboard /></PrivateIndex>}></Route>
       <Route path='/:userID' element={<PrivateIndex><UserProfile /></PrivateIndex>}></Route>
       <Route path='/resetPassword' element={<PrivateIndex><PasswordReset /></PrivateIndex>}></Route>
       <Route path='*' element={ <Errorpage/>}></Route>
        

      
    </Routes>
    </AuthProvider>
    </div>
    </Router>
    
  )
}

export default App