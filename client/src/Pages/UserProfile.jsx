import React, { useEffect, useLayoutEffect, useState,useContext } from 'react'
import axios from 'axios'
import { useParams,Navigate } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

const UserProfile = () => {
    const [profileUser,setProfileUser]=useState(null)
     let useAuth=useContext(AuthContext)
    
    const {userID}=useParams()

  useEffect(()=>{
       const getProfile=async()=>{
    const response=await axios.get(`http://localhost:5000/api/${userID}`,{
                            headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                          }
                          
                          )
                          console.log(response.data)
                          if(response.data.message!='UnAuth'){
                           setProfileUser(response.data)
                          }
                       
  }
      getProfile()
  },[userID,useAuth.currentUser])
    
    
  return  (
    <div>hello {userID}
    <div> {profileUser?.user_name} {profileUser?.user_surname}</div>
    </div>
    
  )
}

export default UserProfile