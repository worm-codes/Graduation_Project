import React,{useLayoutEffect,useState} from 'react';
import axios from 'axios';
import { auth } from './Auth/Firebase-Config';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userFromServer,setUserFromServer]=useState({})
  const getCurrentUserInfo=async()=>{
    const response=await axios.post('http://localhost:5000/api/getUser',{
                         
                           user_email:auth.currentUser.email
                          
                          })
                        setUserFromServer(response.data)
                       
  }
  useLayoutEffect(()=>{
   getCurrentUserInfo()
  },[])
  

  return (
    <div>
     <h1>Secret {userFromServer.user_ID} </h1>
     <Link to='/resetPassword'>Reset your password</Link>
     
    </div>
   
  )
}

export default Dashboard