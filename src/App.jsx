import React,{useEffect,useState} from 'react'
import {useForm} from 'react-hook-form'

import './App.css'


const App = () => {
  let image=['https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1096&q=80',
'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
'https://images.unsplash.com/photo-1557745133-ee31592739cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80']
 const [pickedImage,setPickedImage]=useState(0);

useEffect(()=>{ /*burda atama yapmak icin state kullanimi zorunlu */
setPickedImage(Math.floor(Math.random() * image.length))
},[])

const {register ,handleSubmit,formState:{errors} /*watch*/}=useForm()
 /*watch ile butun inputlari alabilirsin anlik olarak guncel bir sekilde,istege bagli kullanabilirsin
 . Burda tercihen submit den sonra alicagimiz icin, handleSubmit kullandik. */
/*errors ile form ile ilgili hatalara ulasabiliriz */



return (
   
    <div className="maincontainer">
        <div class="container-fluid">
            <div class="row no-gutter">
               
    
      
      <div class="col-md-4 bg-light">
          <div class="login d-flex align-items-center py-5">
          
          <div class="container">
              <div class="row">
                  <div class="col-lg-10 col-xl-7 mx-auto">
                      <h3 class="display-4">Split page!</h3>
                      <p class="text-muted mb-4">Create a login split page using Bootstrap 4.</p>
                      <form onSubmit={handleSubmit((data)=>{
                        console.log(data)
                      })}>
                          <div class="form-group mb-3">
                              <input {...register('inputEmail',{required:'Valid Email is Required.',pattern: /^\S+@\S+$/i})}
                              /* {required:true,maxLength:4} da yazilabilir,veya yaninda maxLength gibi sinirlar belirleyebilirsin*/
                             /*{required:true} iken {errors.inputEmail && <p>wrong mail</p>} ekleyip hata bastirilabilir */
                              id="inputEmail" type="email" placeholder="Email address"  class="form-control rounded-pill border-0 shadow-sm px-4" />
                              {errors.inputEmail &&<p style={{color:'red'}} className='pl-3'>{errors.inputEmail.message}</p>}
                          </div>
                          <div class="form-group mb-3">
                              <input {...register('inputPassword',{required:'You must specify a password',minLength:{value:8,message:'Password must have at least 8 characters'}})} 
                              id="inputPassword" type="password"
                               placeholder="Password" class="form-control rounded-pill border-0 shadow-sm px-4 text-primary" />
                                {errors.inputPassword &&<p style={{color:'red'}} className='pl-3'>{errors.inputPassword.message}</p>}
                          </div>
                          <div class="form-group mb-3">
                             <select  {...register("Title", { required: true })} class="form-control rounded-pill border-0 shadow-sm px-4 text-primary">
                                  <option value="Mr">Mr</option>
                                  <option value="Mrs">Mrs</option>
                                  <option value="Miss">Miss</option>
                                  <option value="Dr">Dr</option>
                                  <option value="Mr">Mr</option>
                                  <option value="Mrs">Mrs</option>
                                  <option value="Miss">Miss</option>
                                  <option value="Dr">Dr</option>
                                  
                                  
                                </select>
                          </div>
                          
                          <div class="custom-control custom-checkbox mb-3">
                              <input {...register('customCheck1')} id="customCheck1" type="checkbox"  class="custom-control-input" />
                              <label for="customCheck1" class="custom-control-label">Remember password</label>
                          </div>
                          <button type="submit" class="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Sign in</button>
                          
                      </form>
                  </div>
              </div>
              </div>
          </div>
          
      </div>
        <div class="col-md-8 d-none  d-md-flex  bg-image" style={{ backgroundImage: `url('${image[pickedImage]}')`}} ></div>


            
            
                </div>
        </div>
      </div>
  
  )
}

export default App