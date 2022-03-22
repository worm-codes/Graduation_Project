import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom"
//import Profile from "./Pages/Profile"
import Home from "./Pages/Home"
import ErrorPage from "./Pages/ErrorPage"
import Navbar from "./components/Navbar"
import Sign_in from './Pages/Sign_in'
import Sign_up from './Pages/Sign_up'


const App=()=> {
  let { username } = useParams();
//const profileUrl = `/profile/${username}`;

  return (
    <Router>
     <Navbar/>
       <Routes>
        <Route path="/" element={<Sign_in />}/>
         <Route path="/register" element = {<Sign_up/>}/>
         <Route path="/search" element={<Home/>}/>
         {/* <Route path="/profile/:username" element={<Profile />}/> */}
         {/* <Route path="/profile" element={<Profile />}/> */}
        <Route path="*" element={<ErrorPage />}/>
      </Routes> 
    </Router>
  )
}

export default App
