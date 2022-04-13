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
import Search from './Pages/Search';
import Publish from './Pages/Publish';
import MyAds from './Pages/MyAds';





const App = () => {
 
  
  
 
  return (
    
    <Router>

    <AuthProvider>
      <div style={{height:'100%'}}></div>

    {/* <Navbar  /> */}
    <Routes>
      
       <Route path='/' element={<PreventForms><Sign_In/></PreventForms>}></Route>
       <Route path='/register' element={<PreventForms><Sign_up /></PreventForms>}></Route>
       <Route path='/search' element={<PrivateIndex><Search /></PrivateIndex>}></Route>
       <Route path='/publish' element={<PrivateIndex><Publish /></PrivateIndex>}></Route>
       <Route path='/myads' element={<PrivateIndex><MyAds /></PrivateIndex>}></Route>
       <Route path='/resetPassword' element={<PrivateIndex><PasswordReset /></PrivateIndex>}></Route>
       {/* <Route path='*' element={ <Errorpage/>}></Route> */}
        

      
    </Routes>
    </AuthProvider>

    </Router>
    
  )
}

export default App