import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import {signOut} from 'firebase/auth'
import { auth } from '../Auth/Firebase-Config'
import '../public/Nav.css'


const Navbar = ({user}) => {

  const location=useLocation()
  const currentPath=location.pathname
  return (
    <div> 
    <nav style={{height:'3.5rem'}} className="navbar navbar-expand-lg navbar-light bg-light ">
    <Link className="navbar-brand" to="/"><b className='h3'>L🤝G</b></Link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-5"
      aria-controls="navbarSupportedContent-5" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent-5"> 
    {user ? <>
      <ul class="navbar-nav ml-auto mr-2 text-right">
      
        <li class="nav-item active">
          <a class="nav-link" href="#">Home
            <span class="sr-only">(current)</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="hidden-profile d-none nav-item">
          <a class="nav-link" href="#">Profile</a>
        </li>
    
        <li class="hidden-profile d-none nav-item">
         <Link class="nav-link" onClick={async ()=>{await signOut(auth)}} to="/">Logout</Link>
        </li>

     
      </ul>
      
      <ul class="profile navbar-nav nav-flex-icons">
        <li class="nav-item avatar dropdown">
          <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink-5" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false">
            <img src='https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png' 
            style={{width:'3.3rem',height:'3.4rem'}} class="rounded-circle z-depth-0" alt="avatar image" />
          </a>
          <div class="dropdown-menu dropdown-menu-right dropdown-secondary" aria-labelledby="navbarDropdownMenuLink-5">
            <a class="dropdown-item" href="#">Hello</a>
          <a class="dropdown-item" href="#">Profile</a>
            <a class="dropdown-item" href="#">Messages</a>
            <Link class="dropdown-item" onClick={async ()=>{await signOut(auth)}} to="/">Logout</Link>
          </div>
        </li>
      </ul>
       </>: <>
        <ul class="navbar-nav ml-auto mr-2 text-right">
       <li class="nav-item active">
       
       <Link class="nav-link" to={`${currentPath==='/register'? '/':'/register'}`}><p style={{fontSize:'1.4rem', color:'black'}} className='mb-0 mr-3'>{`${currentPath==='/register'? 'Sign-In':'Sign-Up'}`}</p></Link>
       </li>
       </ul>
       </>}
    </div>
</nav>
</div>
  )
}

export default Navbar