import React, { useContext, useState, useEffect } from "react"
import { auth } from "../Auth/Firebase-Config"
import axios from "axios"
import { createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword,signOut,sendPasswordResetEmail } from 'firebase/auth'

export const AuthContext = React.createContext()

export default function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState('')
  
  const [loading, setLoading] = useState(true)

  async function signup(email, password) {
    return await createUserWithEmailAndPassword(auth,email, password)
  }

  async function login(email, password) {
     /*const loginResponse=await axios.post('http://localhost:5000/api/login',{
           user_email:email
           })
      console.log(loginResponse.data);*/
    return await signInWithEmailAndPassword(auth,email, password)
  }

  async function logout() {
    const logoutServer=async()=>{
      const response=await axios.post('http://localhost:5000/api/logout',{
                         
        user_email:currentUser?.email,
        isOnline:new Date().toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'})
      }  
      )    
    }
    await logoutServer()
    return await signOut(auth)
  }

  async function resetPassword(email) {
    return await sendPasswordResetEmail(auth,email)
  }
   async function getCurrentUserInfo(){
    
    const response=await axios.post('http://localhost:5000/api/getUser',{
                         
        user_email:currentUser?.email,
        user_last_sign_in:currentUser?.metadata.lastSignInTime,
        createdAt:currentUser?.metadata.creationTime,
      },
      {
        headers:{Authorization: 'Bearer ' + await currentUser?.getIdToken(true)}
      }
      )
     
      if(response.data.message!='UnAuth'){
        
        return await response.data
      }
      
                       
  }

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,user => {
      setCurrentUser(user)
      setLoading(false);
    })


    return unsubscribe
  }, [])

  
 
  
 
  

 

  const value = {
    currentUser,
    getCurrentUserInfo,
    login,
    signup,
    logout,
    resetPassword,
    
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
