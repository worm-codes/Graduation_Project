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
      
      console.log(response.data)
        if(response.data.message!='UnAuth'){
        setUsers(response.data)
        }                 
  }
 
  
  
   const getCurrentUserInfo=async()=>{
    
    const response=await useAuth.getCurrentUserInfo()
    setUserFromServer(response)
   
            
  }
 
  
  
  
      useLayoutEffect(()=>{
        
        if(useAuth.currentUser)
          getCurrentUserInfo()
        return setUserFromServer({})
      },[useAuth.currentUser])
      
      useEffect(()=>{
        if(userFromServer)
           getAllUsers()
           return setUsers([])
      },[])

      const makeConversationAndRedirect=async(id)=>{
         const response=await axios.post(`http://localhost:5000/api/conversation/`,{
                          senderId:userFromServer._id,
                          receiverId:id
         },{
                            headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                          }
                          
                          )
                          console.log(response.data)
                          if(response.data.message!='UnAuth'){
                           window.location.href='/messenger'
                          }

      }
      
  
  const showUsers=users.map((userDB)=>{
      return (<div key={userDB.user_ID}>
      <a href='#' onClick={()=>makeConversationAndRedirect(userDB._id)}> {userDB.user_ID}</a>
      </div>)
    })
  
   

  return (
    <div>
     <h1> {userFromServer.user_ID} </h1>
     <h1> {useAuth.currentUser.email} </h1>
     <div>
     {showUsers}
     </div>
     
     
     <a href='/resetPassword'>Reset your password</a>

     
    </div>
   
  )
}

export default Dashboard