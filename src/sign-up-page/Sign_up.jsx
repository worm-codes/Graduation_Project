import React from 'react'
import './public/sign_up.css'
import {useForm} from 'react-hook-form'


const sign_up = () => {
    const {register ,handleSubmit,formState:{errors}}=useForm()
    console.log(errors.person_email)
  return (
      
    <div class="container-fluid">
    <div class="row">
        <div class=" col-md-7 d-none  d-md-flex intro-section">
        </div>
        <div class=" col-md-5 form-section">
            <div class="login-wrapper">
                <h2 class="login-title">Sign Up</h2>
                <form onSubmit={handleSubmit((data)=>{
                        console.log(data)
                      })}>
                 <div class="form-group"> 
                 <label for="person_ID" class="sr-only">ID</label> 
                 <input type="text"  id="person_ID" class="form-control" placeholder="ID-Nickname" 
                 {...register('person_ID',{required:'You have to enter ID',pattern: {value:/^[\S]+$/,message:'No spaces on ID'}})}/> 
                  {errors.person_ID &&<p style={{color:'red'}} className='pl-3'>{errors.person_ID.message}</p>}</div>
                    
                 <div class="form-group"> <label for="person_name" class="sr-only">Name</label> 
                 <input type="text"  id="person_name" class="form-control" placeholder="Name"
                 {...register('person_name',{required:'You have to enter your Name'})} />
                 {errors.person_name &&<p style={{color:'red'}} className='pl-3'>{errors.person_name.message}</p>} </div>
                    
                    <div class="form-group"> 
                    <label for="person_surname" class="sr-only">Surname</label>
                     <input type="text" id="person_surname" class="form-control" placeholder="Surname"
                    {...register('person_surname',{required:'You have to enter your Surname'})} />
                    {errors.person_surname &&<p style={{color:'red'}} className='pl-3'>{errors.person_surname.message}</p>} </div>
                   
                    <div class="form-group"> 
                    <label for="person_email" class="sr-only">Email</label> 
                    <input  id="person_email" class="form-control" placeholder="Email" 
                     {...register('person_email',{required:'Valid Email is Required.', pattern: {value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:'Invalid Email Adress'}})} /> 
                     {errors.person_email &&<p style={{color:'red'}} className='pl-3'>{errors.person_email.message}</p>}</div>
                   
                     <div class="form-group"> 
                     <label for="person_date_of_birth" class="sr-only">Date of Birth</label> 
                     <input type="date"  max={`${new Date().getFullYear()-18}-12-31`}   id="person_date_of_birth" class="form-control" placeholder="" /> </div>


                    <div class="form-group mb-1"> 
                    <label for="person_password" class="sr-only">Password</label> 
                    <input type="password" id="person_password" class="form-control" placeholder="Password"
                    {...register('person_password',{required:'You must set a password.'
                    ,pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message:'Your password must include minimum eight characters, at least one uppercase letter, one lowercase letter and one number:'}})} /> </div>
                     {errors.person_password &&<p style={{color:'red',fontSize:'12px'}} className='pl-3'>{errors.person_password.message}</p>}
                    <div class="d-flex justify-content-center align-items-center mb-2"> 
                    <button name="login" id="login" class="btn login-btn" type="submit">Submit</button>
                    </div>
                </form>
                <p class="login-wrapper-footer-text">Do you have an account? <a href="/" class="text-reset"><b>Sign-in here</b></a></p>
            </div>
        </div>
    </div>
</div>
  )
}

export default sign_up