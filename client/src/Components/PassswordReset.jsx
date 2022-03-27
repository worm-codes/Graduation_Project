import React, { useRef, useState,useContext } from "react"

import { Link } from "react-router-dom"
import {AuthContext} from '../context/AuthContext'
import '../public/passwordReset.css'

export default function ForgotPassword() {
  let useAuth=useContext(AuthContext)
  const emailRef = useRef()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await useAuth.resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch (err){
      let message=err.message.substr(err.message.indexOf('/')+1).replace(')',' ').replace('.',' ').replace(/-/g,' ')
      setError(message)
    }

    setLoading(false)
  }

  return (
    
     <div class="wrapper fadeInDown">
     <div id="formContent">
   
    <h2 class="active"> Password Reset </h2>
 
   
    <div class="fadeIn first">
     <b className='h3'>L🤝G</b>
     {error&& <p>{error}</p>}
     {message&& <p>{message}</p>}
    </div>


    <form onSubmit={handleSubmit}>
      <input ref={emailRef} type="email" id="login" class="fadeIn second" required name="login" placeholder="Ehter Your E-Mail"/>
      <button disabled={loading}  type="submit" class="fadeIn fourth" value="Log In">Submit </button>
    </form>

  
    <div id="formFooter">
      <Link class="underlineHover"  to="/search">Home</Link>
    </div>

  </div>
</div>
  )
}
