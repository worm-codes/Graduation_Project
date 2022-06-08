import React, { useRef, useState,useContext, useEffect } from "react"

import { Link } from "react-router-dom"
import {AuthContext} from '../context/AuthContext'
import '../public/passwordReset.css'

export default function ForgotPassword() {
  let useAuth=useContext(AuthContext)
  
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  
 

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await useAuth.resetPassword(useAuth?.currentUser?.email )
      setMessage("Check your inbox for further instructions")
    } catch (err){
      let message=err.message.substr(err.message.indexOf('/')+1).replace(')',' ').replace('.',' ').replace(/-/g,' ')
      setError(message)
    }

    setLoading(false)
  }

  return (
    <div className="addedStyle">
     <div className="wrapper fadeInDown">
     <div id="formContent">
   
    <h2 className="active"> Password Reset </h2>
 
   
    <div className="fadeIn first">
     <b className='h3'>L🤝G</b>
     {error&& <p>{error}</p>}
     {message&& <p>{message}</p>}
    </div>


    <form onSubmit={handleSubmit}>
      <b className='h5'>Your mail is: {useAuth?.currentUser?.email}</b>
      <button disabled={loading}  type="submit" className="fadeIn fourth" value="Log In">Reset</button>
    </form>

  
    <div id="formFooter">
      <a className="underlineHover"  href="/search">Home</a>
    </div>

  </div>
</div>
</div>
  )
}
