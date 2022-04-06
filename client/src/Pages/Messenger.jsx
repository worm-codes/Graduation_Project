import React, { useEffect, useLayoutEffect, useState,useContext } from 'react'
import axios from 'axios'
import '../public/messenger.css'
import { useParams,Navigate } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

const Messenger = () => {
   let useAuth=useContext(AuthContext)







/********************************************************** */
    const [profileUser,setProfileUser]=useState(null)
    
    
    const {userID}=useParams()

  useEffect(()=>{
       const getProfile=async()=>{
    const response=await axios.get(`http://localhost:5000/api/getContact/${userID}`,{
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
    
    /****************************************************************************** */
  return  (
    <div>hello {userID}
    <div> {profileUser?.user_name} {profileUser?.user_surname}</div>
    </div>
    
  )
}

export default Messenger