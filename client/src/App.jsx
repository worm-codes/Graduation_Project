import React, { useEffect,useState } from 'react'
import {BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom';
import Sign_in from './Components/Sign_in'
import Sign_up from './Components/Sign_up'
import PasswordReset from './Components/PassswordReset'
import Dashboard from './Dashboard';
import Navbar from './Components/Navbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Auth/Firebase-Config';
import Errorpage from './ERRORpage'
import { AuthProvider } from './context/AuthContext';
import PrivateIndex from './Routes/PrivateIndex';
import PreventForms from './Routes/PreventForms';






const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe=onAuthStateChanged((auth),(curretUser)=>{
    setUser(curretUser)
  })
  
    return unsubscribe
  }, [])
  
  
 
  return (
    
    <Router>
    <div>
    <AuthProvider>

    <Navbar  />
    <Routes>
      
       <Route path='/' element={<PreventForms><Sign_in/></PreventForms>}></Route>
       <Route path='/register' element={<PreventForms><Sign_up /></PreventForms>}></Route>
       <Route path='/search' element={<PrivateIndex><Dashboard /></PrivateIndex>}></Route>
       <Route path='/resetPassword' element={<PrivateIndex><PasswordReset /></PrivateIndex>}></Route>
       <Route path='*' element={ <Errorpage/>}></Route>
        

      
    </Routes>
    </AuthProvider>
    </div>
    </Router>
    
  )
}

export default App