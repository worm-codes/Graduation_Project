import React,{useContext} from "react"
import {Navigate } from "react-router-dom"
import {AuthContext} from '../context/AuthContext'

const PrivateIndex=({ children }) =>{
  let useAuth=useContext(AuthContext)
  let currentUser=useAuth.currentUser
  

  return currentUser ? children: <Navigate to="/"/>
     

}
export default PrivateIndex;