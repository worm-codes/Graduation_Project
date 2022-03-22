import React from 'react'
import {useForm} from 'react-hook-form'
import {Link} from 'react-router-dom'
import axios from 'axios'
import '../public/sign_up.css'




const sign_up = () => {
    const {register ,handleSubmit,formState:{errors}}=useForm()
    console.log(errors.user_email)

    //const [err,setErr]= useState(false)

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
      
      
    <div className="container-fluid">
    <div className="row">
        <div className=" col-lg-7 d-none  d-lg-flex intro-section">
        </div>
        <div className="col-lg-5 form-section">
            <div className="login-wrapper">
                <h2 className="login-title">Sign Up</h2>
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
                  
                      console.log(response)

                      if (response.data==='done'){
                        window.location.href='/'
                    }
                    else if(response.data!=='done'){
                        window.location.href = '/register'
                    }
                       
                      })}>
                 <div className="form-group"> 
                 <label htmlFor="user_ID" className="sr-only">ID</label> 
                 <input type="text"  id="user_ID" className="form-control" placeholder="ID-Nickname" 
                 {...register('user_ID',{required:'You have to enter ID',pattern: {value:/^[\S]+$/,message:'No spaces on ID'}})}/> 
                  {errors.user_ID &&<p style={{color:'red'}} className='pl-3'>{errors.user_ID.message}</p>}</div>
                    
                 <div className="form-group"> <label for="user_name" className="sr-only">Name</label> 
                 <input type="text"  id="user_name" className="form-control" placeholder="Name"
                 {...register('user_name',{required:'You have to enter your Name'})} />
                 {errors.user_name &&<p style={{color:'red'}} className='pl-3'>{errors.user_name.message}</p>} </div>
                    
                    <div className="form-group"> 
                    <label htmlFor="user_surname" className="sr-only">Surname</label>
                     <input type="text" id="user_surname" className="form-control" placeholder="Surname"
                    {...register('user_surname',{required:'You have to enter your Surname'})} />
                    {errors.user_surname &&<p style={{color:'red'}} className='pl-3'>{errors.user_surname.message}</p>} </div>
                   
                    <div className="form-group"> 
                    <label htmlFor="user_email" className="sr-only">Email</label> 
                    <input  id="user_email" className="form-control" placeholder="Email" 
                     {...register('user_email',{required:'Valid Email is Required.', pattern: {value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:'Invalid Email Adress'}})} /> 
                     {errors.user_email &&<p style={{color:'red'}} className='pl-3'>{errors.user_email.message}</p>}</div>
                   
                     <div className="form-group"> 
                     <label htmlFor="user_date_of_birth" className="sr-only">Date of Birth</label> 
                     <input type="date" min={`${new Date().getFullYear()-100}-12-31`}  max={`${new Date().getFullYear()-18}-12-31`}   id="user_date_of_birth" className="form-control" placeholder="" 
                      {...register('user_date_of_birth',{required:'You have to select your date of birth'})}/> 
                     {errors.user_date_of_birth &&<p style={{color:'red'}} className='pl-3'>{errors.user_date_of_birth.message}</p>}
                     </div>
                             

                    <div className="form-group mb-1"> 
                    <label htmlFor="user_password" className="sr-only">Password</label> 
                    <input type="password" id="user_password" className="form-control" placeholder="Password"
                    {...register('user_password',{required:'You must set a password.'
                    ,pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message:'Your password must include minimum eight characters, at least one uppercase letter, one lowercase letter and one number:'}})} /> </div>
                     {errors.user_password &&<p style={{color:'red',fontSize:'12px'}} className='pl-3'>{errors.user_password.message}</p>}
                    <div className="d-flex justify-content-center align-items-center mb-2"> 
                    <button name="login" id="login" className="btn login-btn" type="submit">Submit</button>
                    </div>
                </form>
                <p className="login-wrapper-footer-text">Do you have an account? <Link to="/" className="text-reset"><b>Sign-in here</b></Link></p>
            </div>
        </div>
    </div>
</div>

  )
}

export default sign_up