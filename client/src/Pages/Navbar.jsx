import React, { useContext } from 'react'
import { Link,useLocation } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import '../public/Nav.css'
import axios from 'axios'


const Navbar = () => {
  let useAuth=useContext(AuthContext)
  let user=useAuth.currentUser
  
  
 

  async function handleLogout() {
    

    try {
      
      const logoutServer=async()=>{
      const response=await axios.post('http://localhost:5000/api/logout',{
                         
        user_email:useAuth.currentUser?.email,
        LastSeen:new Date().toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'})
       
      },
      {
        headers:{Authorization: 'Bearer ' + await useAuth.currentUser?.getIdToken(true)}
      }
      )
      
      
       
      
    }
     logoutServer()
     await useAuth.logout()
    

      
    } catch(err) {
      console.log(err,'error')
    }
  }

  const location=useLocation()
  const currentPath=location.pathname
  return (
    <div style={{backgroundColor:'white'}}> 
    <nav style={{height:'3.5rem'}} className="navbar navbar-expand-lg navbar-light ">
    <a className="navbar-brand" href="/"><b className='h3'>L🤝G</b></a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-5"
      aria-controls="navbarSupportedContent-5" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent-5"> 
    {user ? <>
      <ul className="navbar-nav ml-auto mr-2 text-right">
      
        <li className="nav-item active">
          <a className="nav-link" href="/">Home
            <span className="sr-only">(current)</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Features</a>
        </li>
        <li className="hidden-profile d-none nav-item">
          <a className="nav-link" href="#">Profile</a>
        </li>
    
        <li className="hidden-profile d-none nav-item">
         <a className="nav-link" onClick={handleLogout} href="/">Logout</a>
        </li>

     
      </ul>
      
      <ul className="profile navbar-nav nav-flex-icons">
        <li className="nav-item avatar dropdown">
          <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink-5" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false">
            <img src='https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png' 
            style={{width:'3.3rem',height:'3.4rem'}} className="rounded-circle z-depth-0" alt="avatar image" />
          </a>
          <div className="dropdown-menu dropdown-menu-right dropdown-secondary" aria-labelledby="navbarDropdownMenuLink-5">
            <a className="dropdown-item" href="#">Hello</a>
          <a className="dropdown-item" href="#">Profile</a>
            <a className="dropdown-item" href="#">Messages</a>
            <a className="dropdown-item" onClick={handleLogout} href="/">Logout</a>
          </div>
        </li>
      </ul>
       </>: <>
        <ul className="navbar-nav ml-auto mr-2 text-right">
       <li className="nav-item active">
       
       <Link className="nav-link" to={`${currentPath==='/register'? '/':'/register'}`}><p style={{fontSize:'1.4rem', color:'black'}} className='mb-0 mr-3'>{`${currentPath==='/register'? 'Sign-In':'Sign-Up'}`}</p></Link>
       </li>
       </ul>
       </>}
    </div>
</nav>
</div>
  )
}

export default Navbar