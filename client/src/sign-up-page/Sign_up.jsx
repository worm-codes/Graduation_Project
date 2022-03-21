import React,{useState} from 'react'
import './public/sign_up.css'
import {useForm} from 'react-hook-form'
import {Link} from 'react-router-dom'
import axios from 'axios'




const sign_up = () => {
    const {register ,handleSubmit,formState:{errors}}=useForm();
    const [err,setErr]= useState('');
   

    /*const submitOperation=(event)=>{
      event.preventDefault();
      handleSubmit(async (data)=>{ 
        
        const response=await fetch('http://localhost:5000/api/register',{
          headers:{
            'Content-Type':'application/json'
          },
          body:data
        })
        const info=await response.json();
        console.log(info)
        })

    }*/


  return (
      
    <div class="container-fluid">
    <div class="row">
        <div class=" col-lg-7 d-none  d-lg-flex intro-section">
        </div>
        <div class="col-lg-5 form-section">
            <div class="login-wrapper">
                <h2 class="login-title text-center">Sign Up</h2>
                {err&&<p style={{color:'red'}} className='text-center pl-3'>{err}</p>}
                <form onSubmit={handleSubmit(async(data,event)=>{
                  event.preventDefault();
                
                  const response=await axios.post('http://localhost:5000/api/register',{
                           user_ID:data.user_ID,
                           user_name:data.user_name,
                           user_surname:data.user_surname,
                           user_email:data.user_email,
                           user_date_of_birth:data.user_date_of_birth,
                           user_password:data.user_password
                           
                          })
                  
                    
                       if (response.data==='success'){
                      setErr('')
                    window.location.href='/'
                }
                else if(response.data==='duplicate'){
                 setErr('This User is already Signed Up.')
                    
                }
                else if(response.data==='error'){
                  setErr('Something is wrong, Try again...')
                }
                       
                      })}>
                 <div class="form-group"> 
                 <label for="user_ID" class="sr-only">ID</label> 
                 <input type="text"  id="user_ID" class="form-control" placeholder="ID-Nickname" 
                 {...register('user_ID',{required:'You have to enter ID',pattern: {value:/^[\S]+$/,message:'No spaces on ID'}})}/> 
                  {errors.user_ID &&<p style={{color:'red'}} className='pl-3'>{errors.user_ID.message}</p>}</div>
                    
                 <div class="form-group"> <label for="user_name" class="sr-only">Name</label> 
                 <input type="text"  id="user_name" class="form-control" placeholder="Name"
                 {...register('user_name',{required:'You have to enter your Name'})} />
                 {errors.user_name &&<p style={{color:'red'}} className='pl-3'>{errors.user_name.message}</p>} </div>
                    
                    <div class="form-group"> 
                    <label for="user_surname" class="sr-only">Surname</label>
                     <input type="text" id="user_surname" class="form-control" placeholder="Surname"
                    {...register('user_surname',{required:'You have to enter your Surname'})} />
                    {errors.user_surname &&<p style={{color:'red'}} className='pl-3'>{errors.user_surname.message}</p>} </div>
                   
                    <div class="form-group"> 
                    <label for="user_email" class="sr-only">Email</label> 
                    <input  id="user_email" class="form-control" placeholder="Email" 
                     {...register('user_email',{required:'Valid Email is Required.', pattern: {value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:'Invalid Email Adress'}})} /> 
                     {errors.user_email &&<p style={{color:'red'}} className='pl-3'>{errors.user_email.message}</p>}</div>
                   
                     <div class="form-group"> 
                     <label for="user_date_of_birth" class="sr-only">Date of Birth</label> 
                     <input type="date" min={`${new Date().getFullYear()-100}-12-31`}  max={`${new Date().getFullYear()-18}-12-31`}   id="user_date_of_birth" class="form-control" placeholder="" 
                      {...register('user_date_of_birth',{required:'You have to select your date of birth'})}/> 
                     {errors.user_date_of_birth &&<p style={{color:'red'}} className='pl-3'>{errors.user_date_of_birth.message}</p>}
                     </div>
                             

                    <div class="form-group mb-1"> 
                    <label for="user_password" class="sr-only">Password</label> 
                    <input type="password" id="user_password" class="form-control" placeholder="Password"
                    {...register('user_password',{required:'You must set a password.'
                    ,pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message:'Your password must include minimum eight characters, at least one uppercase letter, one lowercase letter and one number:'}})} /> </div>
                     {errors.user_password &&<p style={{color:'red',fontSize:'12px'}} className='pl-3'>{errors.user_password.message}</p>}
                    <div class="d-flex justify-content-center align-items-center mb-2"> 
                    <button name="login" id="login" class="btn login-btn" type="submit">Submit</button>
                    </div>
                </form>
                <p class="login-wrapper-footer-text">Do you have an account? <Link to="/" class="text-reset"><b>Sign-in here</b></Link></p>
            </div>
        </div>
    </div>
</div>
  )
}

export default sign_up