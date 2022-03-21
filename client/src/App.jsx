import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Sign_in from './sign-in-page/Sign_in'
import Sign_up from './sign-up-page/Sign_up'
import Dashboard from './Dashboard';


const App = () => {
  return (
    <div>
    <Router>
    <Routes>
       <Route path='/' element={<Sign_in/>}></Route>
       <Route path='/register' element={<Sign_up/>}></Route>
       <Route path='/search' element={<Dashboard/>}></Route>
      
    </Routes>
    </Router>
    </div>
  )
}

export default App