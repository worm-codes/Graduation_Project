import React,{useLayoutEffect,useState,useContext} from 'react';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext'
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userFromServer,setUserFromServer]=useState({})
  let useAuth=useContext(AuthContext)
  const getCurrentUserInfo=async()=>{
    const response=await axios.post('http://localhost:5000/api/getUser',{
                         
                           user_email:useAuth.currentUser.email,
                           user_last_sign_in:useAuth.currentUser.metadata.lastSignInTime,
                           createdAt:useAuth.currentUser.metadata.creationTime
                          
                          })
                        setUserFromServer(response.data)
                       
  }
  useLayoutEffect(()=>{
   getCurrentUserInfo()
  },[])
  

  return (
    <div>
     <h1> {userFromServer.user_ID} </h1>
     <h1> {useAuth.currentUser.email} </h1>
     
     <Link to='/resetPassword'>Reset your password</Link>
     
    </div>
   
  )
}

export default Dashboard