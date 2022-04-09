import React,{useContext} from "react"
import {Navigate } from "react-router-dom"
import {AuthContext} from '../context/AuthContext'

const PreventForms=({ children }) =>{
  let useAuth=useContext(AuthContext)
  let currentUser=useAuth.currentUser
  

  return !currentUser ? children: <Navigate to="/search"/>
     

}
export default PreventForms;