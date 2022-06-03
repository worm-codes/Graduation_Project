import React, { useContext, useEffect, useState,useRef, useLayoutEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import '../public/Nav.css'
import axios from 'axios'
import { io } from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'


const Navbar = () => {
	let useAuth=useContext(AuthContext);
  const [unreadMessages,setUnreadMessages]=useState(0);
  const [user,setUser]=useState(null)
  const [arrivalMessage,setArrivalMessage]=useState(null)
  const location=useLocation();
  const currentPath=location.pathname;
   const socket = useRef();
//    console.log("currently logged in user:", useAuth.currentUser);

	useEffect(() => {
		console.log("clear logic useeffect in navbar before if");
		if(currentPath.length < 25 && currentPath !== '/searchresult'){
			localStorage.clear()
			console.log("clear logic useeffect in navbar in if");
		}
		
	}, [currentPath])

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
    if(currentPath==='/messenger'){
     logoutServer()
    }
	 localStorage.clear();
     await useAuth.logout()
    

      
    } catch(err) {
      console.log(err,'error')
    }
  }

   const getCurrentUserInfo=async()=>{
    
    const response=await useAuth?.getCurrentUserInfo()
    if(response){
    setUser(response)
    }
            
  }
  useLayoutEffect(() => {
    if(!user&&useAuth.currentUser ){
      getCurrentUserInfo()
    }
    if(currentPath!=='/messenger' && useAuth.currentUser){
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
  
    
  }, [useAuth.currentUser])

  useEffect(() => {
   if(arrivalMessage && useAuth.currentUser&&currentPath!=='/messenger'){
    setUnreadMessages(unreadMessages+1)
   }
    
  }, [arrivalMessage])
  

  useEffect(()=>{
    if(user &&useAuth.currentUser&& currentPath!=='/messenger'){
        
      
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
    //  console.log(resp);
      if(!resp.data.message){
      setUnreadMessages(resp.data)
      }
    }
    getNumberOfUnreadMessages()

   
  }
  },[user,useAuth.currentUser])


	return (
		/* important */
		<div className="nav-bar" style={{ backgroundColor: "bisque", width: "100%" }}>
			<nav className="navbar navbar-expand-lg navbar-light">
			{currentPath!=='/messenger'?<Link className='navbar-brand ' to='/'><b className='h3'>L🤝G</b></Link>
      			: <a className="navbar-brand " href="/"><b className='h3'>L🤝G</b></a>}
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarSupportedContent-5"
					aria-controls="navbarSupportedContent-5"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent-5">
					{user&&useAuth.currentUser ? (
						<>
							<ul className="navbar-nav ml-auto mr-2 text-right">
							<li className="nav-item ">
								{currentPath !== '/messenger' ? 
									<NavLink className="nav-link" to="/myads">
									My Ads
								</NavLink> :
								<a className="nav-link" href="/myads">
										My Ads
									</a>
								}
									
								</li>
								<li className="nav-item ">
								{currentPath !== '/messenger' ? 
									<NavLink className="nav-link" to="/search">
									Search for an Ad
								</NavLink> :
								<a className="nav-link" href="/search">
										Search for an Ad
									</a>
								}
								</li>
								<li className="nav-item ">
								{currentPath !== '/messenger' ? 
									<NavLink className="nav-link" to="/publish">
									Create an Ad
								</NavLink> :
								<a className="nav-link" href="/publish">
										Create an Ad
									</a>
								}
								</li>
								
								<li className="hidden-profile d-none nav-item">
								{currentPath !== '/messenger' ? 
									<Link className="nav-link" to="/profile">
									Profile
								</Link> :
								<a className="nav-link" href="/profile">
										Profile
									</a>
								}
								</li>

								<li className="nav-item">
        							{unreadMessages!==0 &&currentPath!='/messenger'? <span className="badge badge-pill badge-danger" style={{float:"right" ,marginBottom:"-6px"}}>{unreadMessages}</span>:''}
          							{currentPath!=='/messenger'?	<a className="nav-link" href="/messenger"><FontAwesomeIcon style={{fontSize:'1.40rem'}} icon={faEnvelope} size="lg" /> <span className="sr-only">(current)</span></a>
      								: 	<FontAwesomeIcon style={{fontSize:'1.40rem', paddingTop:'9px'}} icon={faEnvelope} size="lg" /> }					
    							</li>

								<li className="hidden-profile d-none nav-item">
									<a className="nav-link" onClick={handleLogout} href="/">
										Logout
									</a>
								</li>
							</ul>

							<ul className="profile navbar-nav nav-flex-icons">
								<li className="nav-item avatar dropdown">
									<a
										className="nav-link dropdown-toggle"
										id="navbarDropdownMenuLink-5"
										data-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false"
									>
										<img
											src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
											style={{ width: "3.3rem", height: "3.4rem" }}
											className="rounded-circle z-depth-0"
											alt="avatar image"
										/>
									</a>

									<div  className="dropdown-menu dropdown-menu-right dropdown-secondary" aria-labelledby="navbarDropdownMenuLink-5">
            							{currentPath!=='/messenger'?<Link className='nav-link' to='#'>Profile</Link>
      									: <a  className="nav-link" href="#">Profile
            							<span className="sr-only">(current)</span>
          							</a>}

            						<a  className="nav-link" onClick={handleLogout} href="/">Logout</a>
          							</div>
								</li>
							</ul>
						</>): <>
							<ul className="navbar-nav ml-auto mr-2 text-right">
       						<li className="nav-item active">
       
       						<Link className="nav-link" to={`${currentPath==='/register'? '/':'/register'}`}><p style={{fontSize:'1.4rem', color:'black'}} className='mb-0 mr-3'>{`${currentPath==='/register'? 'Sign-In':'Sign-Up'}`}</p></Link>
       						</li>
       						</ul>
							   </>}
				</div>
			</nav>
		</div>
	);
};

export default Navbar;