import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import Navbar from '../components/Navbar'

import '../public/sign_in.css'


const App = () => {
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

const [err,setErr]= useState(false)
 

useEffect(()=>{ /*burda atama yapmak icin state kullanimi zorunlu */
setPickedImage(Math.floor(Math.random() * image.length))
setPickedQuote(Math.floor(Math.random() * quotes.length))
},[])

const {register ,handleSubmit,formState:{errors} /*watch*/}=useForm()
 /*watch ile butun inputlari alabilirsin anlik olarak guncel bir sekilde,istege bagli kullanabilirsin
 . Burda tercihen submit den sonra alicagimiz icin, handleSubmit kullandik. */
/*errors ile form ile ilgili hatalara ulasabiliriz */

console.log(errors.user_password)

return (

   
    <div className="maincontainer">
        <div className="container-fluid">
            <div className="row no-gutter">
               
    
      
      <div className="col-lg-4 bg-light">
          <div className="login d-flex align-items-center py-5">
          
          <div className="container">
              <div className="row">
            <div className="col-lg-10 col-xl-7 mx-auto">
                <h3 className="display-5 text-center">Local🤝Guide</h3>
                <p className="text-muted text-center mb-4"> {quotes[pickedQuote]} </p>
                {err&&<p style={{color:'red'}} className='text-center pl-3'>Please Check Your Email or Password</p>}
                
                <form onSubmit={handleSubmit(async(data,event)=>{
                    event.preventDefault();
                    const response=await axios.post('http://localhost:5000/api/login',{
                    user_email:data.user_email,
                    user_password:data.user_password
                    
                    })
            
                console.log(response)
                
                if (response.data==='done'){
                    setErr(false)
                    window.location.href='/search'
                }
                else if(response.data==='error'){
                    setErr(true)
                }
                
                })}>
                    <div className="form-group mb-3">
                        <input {...register('user_email',{required:'Valid Email is Required.',pattern: {value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:'Invalid Email Adress'}})}
                        /* {required:true,maxLength:4} da yazilabilir,veya yaninda maxLength gibi sinirlar belirleyebilirsin*/
                        /*{required:true} iken {errors.user_email && <p>wrong mail</p>} ekleyip hata bastirilabilir */
                        id="user_email"  placeholder="Email address"  className="form-control rounded-pill border-0 shadow-sm px-4" />
                        { errors.user_email &&<p style={{color:'red'}} className='pl-3'>{errors.user_email.message}</p>}
                    </div>
                    <div className="form-group mb-3">
                        <input {...register('user_password',{required:'Enter your password please.'})} 
                        id="user_password" type="password"
                        placeholder="Password" className="form-control rounded-pill border-0 shadow-sm px-4 text-primary" />
                        {errors.user_password &&<p style={{color:'red'}} className='pl-3'>{errors.user_password.message}</p>}
                        
                    </div>
                    
                    
                    <div className="custom-control custom-checkbox mb-3">
                        <input {...register('customCheck1')} id="customCheck1" type="checkbox"  className="custom-control-input" />
                        <label htmlFor="customCheck1" className="custom-control-label">Remember password</label>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Sign in</button> <br />
                    
                </form>
                <p className="login-wrapper-footer-text" style={{fontSize:'1.1rem'}}>Don't you have an account? <Link to="/register" style={{textDecoration:'none'}} className="text-reset"><b>Sign-Up</b></Link></p>
            </div>
        </div>
        </div>
    </div>
          
      </div>
        <div className="col-lg-8 d-none  d-lg-flex  bg-image" style={{ backgroundImage: `url('${image[pickedImage]}')`}} ></div>


            
            
                </div>
        </div>
      </div>
    
  )
}

export default App