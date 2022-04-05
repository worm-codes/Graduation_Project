import React,{useLayoutEffect,useState,useContext, useEffect} from 'react';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext'
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userFromServer,setUserFromServer]=useState({})
  const [users,setUsers]=useState([])
  let useAuth=useContext(AuthContext)
  
      const getAllUsers=async()=>{
    const response=await axios.get('http://localhost:5000/api/getAllUsers',
                          {
                            headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                          }
                          )
                          console.log('usersssssss');
                          console.log(response.data)
                           if(response.data.message!='UnAuth'){
                            setUsers(response.data)
                           }
                         
                       
                       
  }
 
  
  const getCurrentUserInfo=async()=>{
    const response=await axios.post('http://localhost:5000/api/getUser',{
                         
                           user_email:useAuth.currentUser.email,
                           user_last_sign_in:useAuth.currentUser.metadata.lastSignInTime,
                           createdAt:useAuth.currentUser.metadata.creationTime,
                          },
                          {
                            headers:{Authorization: 'Bearer ' + useAuth.currentToken}
                          }
                          )
                          console.log(response.data)
                          if(response.data.message!='UnAuth'){
                           setUserFromServer(response.data)
                          }
                       
  }
 
  
  
  
  useLayoutEffect(()=>{
    if(useAuth.currentUser,useAuth.currentToken)
      getCurrentUserInfo()
     
  },[useAuth.currentUser,useAuth.currentToken])
  
  useEffect(()=>{
    if(userFromServer)
      getAllUsers()
  },[userFromServer])
  
  
  const showUsers=users.map((userDB)=>{
      return (<div key={userDB.user_ID}>
      <Link to={`/${userDB._id}`}> {userDB.user_ID}</Link>
      </div>)
    })
  
   

  return (
    <div>
     <h1> {userFromServer.user_ID} </h1>
     <h1> {useAuth.currentUser.email} </h1>
     <div>
     {showUsers}
     </div>
     
     
     <Link to='/resetPassword'>Reset your password</Link>

     
    </div>
   
  )
}

export default Dashboard