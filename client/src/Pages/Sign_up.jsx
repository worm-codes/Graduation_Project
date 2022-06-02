import React,{useState,useContext} from 'react'
import '../public/sign_up.css'
import {useForm} from 'react-hook-form'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {AuthContext} from '../context/AuthContext'
import Navbar from '../components/Navbar'




const sign_up = () => {
    const {register,watch ,handleSubmit,formState:{errors}}=useForm();
    const [err,setErr]= useState('');
    let useAuth=useContext(AuthContext)
     const [loading, setLoading] = useState(false)
    
    
    

   const registerFirebase=async(email,password)=>{

    try {
     
      setLoading(true)
      await useAuth.signup(email, password)
      setErr("")
       
    } catch(err){
       let message=err.message.substr(err.message.indexOf('/')+1).replace(')',' ').replace('.',' ').replace(/-/g,' ')
    
       setErr(message) 
 
     }
     setLoading(false)

   }
   

  return (
    <>
    {/* <Navbar/> */}
      <div className="addedStyle">
    <div className="container-fluid">
    <div className="row">
        <div className=" col-lg-7 d-none  d-lg-flex intro-section">
        </div>
        <div className="col-lg-5 form-section">
            <div className="login-wrapper">
                <h2 className="login-title text-center">Sign Up</h2>
                {(err) &&<p style={{fontSize:'1rem'}} className='text-center mb-3 pl-3'>{err}</p>}
                <form onSubmit={handleSubmit(async(data,event)=>{
                  event.preventDefault();
                  if(data.user_password===data.user_password_copy){
                  await registerFirebase(data.user_email,data.user_password)
                  
                  if(!err){
                 
                  const response=await axios.post('http://localhost:5000/api/register',{
                           user_ID:data.user_ID,
                           user_name:data.user_name,
                           user_surname:data.user_surname,
                           user_gender:data.user_gender,
                           user_email:data.user_email,
                           user_date_of_birth:data.user_date_of_birth,
                         
                          })
                          console.log(response)

                  
                    
                       if (response.data==='success'){
                         
                         
                            setErr('')
                     
                    
                }
                else if(response.data==='duplicate'){
                  setErr('your ID must be unique')
                }
                
                else if(response.data==='error'){
                  setErr('Something is wrong, Try again...')
                }
              }
            }
                       
                      })}>
                 <div className="form-row mb-0"> 
                  <div className="form-group  col">
                 <label htmlFor="user_ID" className="sr-only">ID</label> 
                 <input type="text"  id="user_ID" className="form-control" placeholder="ID-Nickname" 
                 {...register('user_ID',{required:'You have to enter ID',pattern: {value:/^[\S]+$/,message:'No spaces on ID'}})}/> 
                  {errors.user_ID &&<p  className='pl-3'>{errors.user_ID.message}</p>}
                      </div>
                      
                  <div className="form-group col pl-3" > 
                      
                    <select  {...register("user_gender", { required:true  })}
                       className='form-control pt-1' style={{fontSize:'1rem'}} name="user_gender" id="user_gender">
                     <option selected disabled value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option> 
                    </select>
                    
                      </div>
                      
                      </div>
                      



                 <div className="form-group"> <label htmlFor="user_name" className="sr-only">Name</label> 
                 <input type="text"  id="user_name" className="form-control" placeholder="Name"
                 {...register('user_name',{required:'You have to enter your Name'})} />
                 {errors.user_name &&<p  className='pl-3'>{errors.user_name.message}</p>} </div>
                    
                    <div className="form-group"> 
                    <label htmlFor="user_surname" className="sr-only">Surname</label>
                     <input type="text" id="user_surname" className="form-control" placeholder="Surname"
                    {...register('user_surname',{required:'You have to enter your Surname'})} />
                    {errors.user_surname &&<p  className='pl-3'>{errors.user_surname.message}</p>} </div>
                   
                  


                    <div className="form-group"> 
                    <label htmlFor="user_email" className="sr-only">Email</label> 
                    <input  id="user_email" className="form-control" placeholder="Email" 
                     {...register('user_email',{required:'Valid Email is Required.', pattern: {value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:'Invalid Email Adress'}})} /> 
                     {errors.user_email &&<p  className='pl-3'>{errors.user_email.message}</p>}</div>
                   
                     <div className="form-group"> 
                     <label htmlFor="user_date_of_birth" className="sr-only">Date of Birth</label> 
                     <input type="date" min={`${new Date().getFullYear()-100}-12-31`}  max={`${new Date().getFullYear()-18}-12-31`}   id="user_date_of_birth" className="form-control" placeholder="" 
                      {...register('user_date_of_birth',{required:'You have to select your date of birth'})}/> 
                     {errors.user_date_of_birth &&<p  className='pl-3 mb-2'>{errors.user_date_of_birth.message}</p>}
                     </div>

                     
                             

                    <div className="form-group mb-1"> 
                    <label htmlFor="user_password" className="sr-only">Password</label> 
                    <input type="password" id="user_password" className="form-control" placeholder="Password"
                    {...register('user_password',{required:'You must set a password.'
                    ,pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message:'Your password must include minimum eight characters, at least one uppercase letter, one lowercase letter and one number:'}})} /> 
                   {(errors.user_password)  &&<p  className='pl-3'>{errors.user_password.message}</p>}
                    </div>

                    <div className="form-group mb-1"> 
                    <label htmlFor="user_password_copy" className="sr-only">Password_Copy</label> 
                    <input type="password" id="user_password_copy" className="form-control" placeholder="Password"
                    {...register('user_password_copy',{required:'Type your password again'
                    ,pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message:'Passwords must be same.'}})} /> 
                    </div>

                     {(!errors.user_password&&watch().user_password_copy!=''&&(watch().user_password!=watch().user_password_copy))  &&<p  className='pl-3 mb-2'>Passwords must be the same.</p>}
                      {(errors.user_password_copy &&watch().user_password_copy==='')  &&<p  className='pl-3 mb-2'>{errors.user_password_copy.message}</p>}
                    <div className="d-flex justify-content-center align-items-center mb-2"> 
                    
                    <button disabled={loading} name="login" id="login"  className="btn login-btn" type="submit">Submit</button>
                    </div>
                </form>
                <p className="login-wrapper-footer-text ">Do you have an account? <Link to="/" className="text-reset"><b>Sign-in here</b></Link></p>
            </div>
        </div>
    </div>
</div>
</div>

</>

  )
}

export default sign_up