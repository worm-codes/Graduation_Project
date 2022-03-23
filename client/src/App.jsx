import React, { useEffect,useState } from 'react'
import {BrowserRouter as Router,Routes,Route, Navigate, useLocation} from 'react-router-dom';
import Sign_in from './sign-in-page/Sign_in'
import Sign_up from './sign-up-page/Sign_up'
import Dashboard from './Dashboard';
import Navbar from './Components/Navbar';
import axios from 'axios';



const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          console.log(resObject.user)
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  return (
    
    <Router>
    <div>
    <Navbar  user={user} />
    <Routes>
       <Route path='/' element={!user ?<Sign_in/>:<Navigate to='/search'/>}></Route>
       <Route path='/register' element={!user ?<Sign_up/>:<Navigate to='/search'/>}></Route>
       <Route path='/search' element={ user?<Dashboard/>: <Navigate to='/' />}></Route>
        

      
    </Routes>
    </div>
    </Router>
    
  )
}

export default App