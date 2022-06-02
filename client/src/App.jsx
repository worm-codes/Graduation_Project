import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Sign_up from './Pages/Sign_up'
import PasswordReset from './Pages/PassswordReset'
import { AuthProvider } from './context/AuthContext';
import PrivateIndex from './ProtectedRoutes/PrivateIndex';
import PreventForms from './ProtectedRoutes/PreventForms';
import Sign_In from './Pages/Sign_In';
import Search from './Pages/Search';
import Publish from './Pages/Publish';
import MyAds from './Pages/MyAds';
import MyPastAds from './Pages/MyPastAds';
import SearchResult from './Pages/SearchResult';
import AdDetail from './Pages/AdDetail';
import Messenger from './Pages/Messenger';
import Navbar from './components/Navbar';
import Dashboard from './Pages/Dashboard';





const App = () => {
 
  
  
 
  return (
    
    <Router>

    <AuthProvider>
 
      <div style={{height:'100%'}}></div>

    <Navbar  />
    <Routes>
      
       <Route path='/' element={<PreventForms><Sign_In/></PreventForms>}></Route>
       <Route path='/register' element={<PreventForms><Sign_up /></PreventForms>}></Route>
       <Route path='/search' element={<PrivateIndex><Search /></PrivateIndex>}></Route>
       <Route path='/publish' element={<PrivateIndex><Publish /></PrivateIndex>}></Route>
       <Route path='/myads' element={<PrivateIndex><MyAds /></PrivateIndex>}></Route>
       <Route path='/mypastads' element={<PrivateIndex><MyPastAds /></PrivateIndex>}></Route> 
       <Route path='/searchresult' element={<PrivateIndex><SearchResult /></PrivateIndex>}></Route>
       <Route path='/searchresult/:id' element={<PrivateIndex><AdDetail /></PrivateIndex>}></Route>
       <Route path='/resetPassword' element={<PrivateIndex><PasswordReset /></PrivateIndex>}></Route>
       <Route path='/messenger' element={<PrivateIndex><Messenger /></PrivateIndex>}></Route>
       <Route path='/dashboard' element={<PrivateIndex><Dashboard /></PrivateIndex>}></Route>
       {/* <Route path='*' element={ <Errorpage/>}></Route> */}
      
    </Routes>
    
    </AuthProvider>

    </Router>
    
  )
}

export default App