import React, { useContext, useEffect, useState,useRef } from 'react'
import { Link,useLocation } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import '../public/Nav.css'
import axios from 'axios'
import { io } from "socket.io-client";


const Navbar = () => {
  let useAuth=useContext(AuthContext);
  const [unreadMessages,setUnreadMessages]=useState(0);
  const [user,setUser]=useState(null)
  const [arrivalMessage,setArrivalMessage]=useState(null)
  const location=useLocation();
  const currentPath=location.pathname;
   const socket = useRef();
 

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

   const getCurrentUserInfo=async()=>{
    
    const response=await useAuth.getCurrentUserInfo()
    setUser(response)
            
  }
  useEffect(() => {
    if(!user ){
      getCurrentUserInfo()
    }
    if(currentPath!=='/messenger'){
     socket.current = io("ws://localhost:8900");

      socket.current?.on("getMessage", (data) => {
     console.log(data);
      setArrivalMessage({
        sender: data.senderId,
        receiver:data.receiverId,
        text: data.text,
        createdAt: new Date().toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
      });

       
    })
    }
  
    
  }, [])

  useEffect(() => {
   if(arrivalMessage &&currentPath!=='/messenger'){
    setUnreadMessages(unreadMessages+1)
   }
    
  }, [arrivalMessage])
  

  useEffect(()=>{
    if(user && currentPath!=='/messenger'){
        
      
       const addUserBySocket=async()=>{
         
         let userToSend=user;
         userToSend.boolean='ok'
       socket.current?.emit("addUser", userToSend);
       }
       addUserBySocket()
    

     
     
    const getNumberOfUnreadMessages=async()=>{
    
      const resp=await axios.post('http://localhost:5000/api/message/AllUnreadMessages/'+useAuth.currentUser?.email,
      {
        headers:{Authorization: 'Bearer ' + await useAuth.currentUser?.getIdToken(true)}
      })
     console.log(resp);
      if(!resp.data.message){
      setUnreadMessages(resp.data)
      }
    }
    getNumberOfUnreadMessages()

   
  }
  },[user])

  /* okunmamis mesajlari saymak icin anlik gostermek icin burayi ayarlayabilirim
  useEffect(() => {
   
  
    

    
    
  }, []);

   useEffect(() => {
     if(user){
       const addUserBySocket=async()=>{
         let user={_id:'624cafea3e5ee7aee8cdb1d932323'}
       socket.current.emit("addUser", user);
       }
       addUserBySocket()
    

     }
    
  }, [user]);*/




 
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
 <li className="nav-item">
        {unreadMessages!==0 &&currentPath!='/messenger'? <span className="badge badge-pill badge-danger" style={{float:"right" ,marginBottom:"-6px"}}>{unreadMessages}</span>:''}
						<a className="nav-link" href="/messenger"><i className="fa fa-envelope fa-lg" style={{fontSize:'1.40rem'}} aria-hidden="true"></i> <span className="sr-only">(current)</span></a>
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