import React,{useState,useContext,useEffect} from 'react'
import '../public/sign_in.css'
import {useForm} from 'react-hook-form'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import axios from 'axios'




const Sign_In_New = () => {
let image=['https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1096&q=80',
'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
'https://images.unsplash.com/photo-1557745133-ee31592739cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80']
 const [pickedImage,setPickedImage]=useState(0);
  const [pickedQuote,setPickedQuote]=useState(0);
 let quotes=['“A journey is best measured in friends, rather than miles.”','“Friends that travel together, stay together.” '
,'“Life was meant for good friends and great adventures.”','“There is an unspoken bond you create with the friends you travel with.”',
'“Everyone needs a friend that will call and say, ‘Get dressed, we are going on an adventure.',
'“One of the great things about travel is that you find out how many good, kind people there are.”',
'“The best things in life are the people we love, the places we’ve been, and the memories we’ve made along the way.”',
'“True friends never apart maybe in distance never in heart.”',]

const [err,setErr]= useState(false);
let useAuth=useContext(AuthContext);
const [loading, setLoading] = useState(false);
const loginFirebase=async(email,password)=>{


  try {
      setErr("")
      setLoading(true)
      
      await useAuth.login(email, password)
    
    } catch(err){
       let message=err.message.substr(err.message.indexOf('/')+1).replace(')',' ').replace('.',' ').replace(/-/g,' ')
    
       setErr(message) 

     }

    setLoading(false)
  }

 
 

useEffect(()=>{ /*state e atama yapmak icin useffect kullanmayi unutmaa !!!!! */
setPickedImage(Math.floor(Math.random() * image.length))
setPickedQuote(Math.floor(Math.random() * quotes.length))


},[])



    const {register ,handleSubmit,formState:{errors}}=useForm();
    
  
  return (
      <div className="addedStyle">
    <div className="container-fluid">
    <div className="row">
        
        <div className="col-lg-5 col-md-5 form-section">
            <div className="login-wrapper">
                <h3 className="login-title text-center">Sign In</h3>
                <h3 className="display-5 text-center">Local🤝Guide</h3>
                <p className="text-muted text-center mb-4"> {quotes[pickedQuote]} </p>
                {(err) &&<p style={{fontSize:'1rem'}} className='text-center mb-3 pl-3'>{err}</p>}
                <form onSubmit={handleSubmit(async(data,event)=>{
                    event.preventDefault();
                   await loginFirebase(data.user_email,data.user_password)

                })}>
               
     
                    <div className="form-group"> 
                    <label htmlFor="user_email" className="sr-only">Email</label> 
                    <input  id="user_email" className="form-control" placeholder="Email" 
                     {...register('user_email',{required:'Valid Email is Required.', pattern: {value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:'Invalid Email Adress'}})} /> 
                     {errors.user_email &&<p  className='pl-3'>{errors.user_email.message}</p>}</div>
                   

                    <div className="form-group mb-1"> 
                    <label htmlFor="user_password" className="sr-only">Password</label> 
                    <input type="password" id="user_password" className="form-control" placeholder="Password"
                    {...register('user_password',{required:'Enter your password please.'})} /> 
                   {(errors.user_password)  &&<p  className='pl-3'>{errors.user_password.message}</p>}
                    </div>

                  
                    <div className="d-flex justify-content-center align-items-center mb-2"> 
                    
                    <button disabled={loading} name="login" id="login"  className="btn login-btn" type="submit">Submit</button>
                    </div>
                </form>
                <p className="login-wrapper-footer-text ">Don't you have an account?  <Link to="/register" className="text-reset"><b>Sign-Up</b></Link></p>
            </div>
        </div>
        <div   className=" col-lg-7 col-md-7 d-none  d-md-flex  d-lg-flex intro-section-login-page" style={{ backgroundImage: `url('${image[pickedImage]}')`}}>
        </div>
    </div>
</div>
</div>

  )
}

export default Sign_In_New