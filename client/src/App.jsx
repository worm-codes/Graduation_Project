import React, { useEffect,useState } from 'react'
import {BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom';
import Sign_in from './sign-in-page/Sign_in'
import Sign_up from './sign-up-page/Sign_up'
import Dashboard from './Dashboard';
import Navbar from './Components/Navbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Auth/Firebase-Config';
import Errorpage from './ERRORpage'





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
    <Navbar  user={user} />
    <Routes>
      
       <Route path='/' element={!user ?<Sign_in/>: <Navigate to='/search' />}></Route>
       <Route path='/register' element={!user ?<Sign_up />:<Navigate to='/search' />}></Route>
       <Route path='/search' element={ user?<Dashboard />: <Navigate to='/'  />}></Route>
       <Route path='*' element={ <Errorpage/>}></Route>
        

      
    </Routes>
    </div>
    </Router>
    
  )
}

export default App