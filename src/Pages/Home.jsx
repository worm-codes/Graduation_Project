//WATCH'LADIGIN STATE'IN SEHİRLERİNİ YENİ BİR DROPDWN İCİNDE BAS
//COUNTRY STATE VE CİTY İNPUTLARINI YUKARI AL, DİĞERLERİNİ AŞAĞIDA KONUMLA

import axios from 'axios'
import React, { useState, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import '../Home.css'
import { Country, State, City }  from 'country-state-city';


const Home = () => {



  const { register, handleSubmit, watch, formState: {errors} } = useForm();
  const ageArr = [];
  for(let i = 18; i <= 80; i++){
    ageArr[i-18] = i;
  }
  
  console.log(Country.getAllCountries());

  console.log(watch().country)

  let countryInput = watch().country ? watch().country : '';
  let stateInput = watch().state ? watch().state : '';
  console.log(watch().state)
  
  
  let states = [];
  let isFoundCountry = false;
  let isFoundState = false;
  //let isFoundState = false;
  Country.getAllCountries().forEach((country) => {
    if(country.name === countryInput){
      isFoundCountry = true;
      console.log("Finally a valid country input by user")
      states = State.getStatesOfCountry(country.isoCode);
      console.log(states);
    }  
  })

  let stateNameSelected = "";
  let chosenState = {};

   states.forEach((city) => {
      if(city.name === stateInput){
        isFoundState = true;
        stateNameSelected = city.name;
        chosenState = city;
        console.log("A valid state is selected")
        // console.log("stateSelected variable", stateNameSelected, stateNameSelected);
        // console.log(typeof chosenState)
        console.log(City.getCitiesOfState(chosenState.countryCode, chosenState.isoCode))
        // console.log(City.getAllCities());

      }
    })

  
  

  return (
    <div className='img-bg'>
      <div style={{display:'flex', justifyContent:'center'}}><h2 style={{paddingTop:'5%'}}>Search for Ads</h2></div>
      <div>
      <form onSubmit={handleSubmit((data) => {
        console.log(data);
      })} style={{display:'flex', justifyContent:'center', marginTop:'3%'}}>

        <div className='form-group'>
        <label htmlFor="country">Type in Country:</label>
        <input  className='form-control' {...register("country")} name="country"  id='country' type="text" />
        </div>

        <div className='form-group'>
        <label htmlFor='state'>Choose State:</label>
        <select disabled={!isFoundCountry} {...register("state", { required: true })} className='form-control'  name="state" id="state">
          {/* The options will be created by mapping over the data that
          comes back from the state api, for each city. */}
          <option selected disabled value="">Choose a State</option>
          {/* <option value="Berlin">Berlin</option>
          <option value="Rome">Rome</option>
          <option value="Prague">Prague</option> */}
          {states.map((state) => (
            <option value={state.name}>{state.name}</option>
          ))}
          {/* <option value={city}>{city}</option> */}
        </select>
        </div>

        <div className='form-group'>
        <label htmlFor='city'>Choose City:</label>
        <select disabled={!isFoundState} {...register("city", { required: true })} className='form-control'  name="city" id="city">
          {/* The options will be created by mapping over the data that
          comes back from the state api, for each city. */}
          <option selected disabled value="">Choose a City</option>
          {/* <option value="Berlin">Berlin</option>
          <option value="Rome">Rome</option>
          <option value="Prague">Prague</option> */}
          { City.getCitiesOfState(chosenState.countryCode,chosenState.isoCode).map((city,key)=> (
            <option key={key} value={city.name}>{city.name}</option>
          ))}
          {/* <option value={city}>{city}</option> */}
        </select>
        </div>

        
        
        <div className='form-group'>
        <label htmlFor="arriving">Arriving:</label>
        <input className='form-control' {...register("arriving", { required: 'You have to select an arrival date' })} name="arriving" type="date" />
        </div>
        
        <div className='form-group'>
        <label htmlFor='leaving'>Leaving:</label>
        <input className='form-control' {...register("leaving", { required: true })} name='leaving' type="date" />
        </div>
        
        <div style={{display:'flex'}} className='form-group'>
        <div>
        <label htmlFor='minAge'>From:</label>
        <select {...register("minAge", { required: 'You have to select minimum age' , min:{value: 18, message:'You have to select minimum age'} })} className='form-control'  name="minAge" id="minAge">
          <option selected disabled value="">Age</option>
          {ageArr.map((item,key) => {
            return <option key={key} value={item}>{item}</option>
          })}
        </select>
        </div>

        <div>
        <label htmlFor='maxAge'>To:</label>
        <select {...register("maxAge", { required: true })} className='form-control' name="maxAge" id="maxAge">
        <option selected disabled value="">Age</option>
          {ageArr.map((item,key) => {
            return <option key={key} value={item}>{item}</option>
          })}
        </select>
        </div>
        </div>
        
         <div className='form-group'>
        <label htmlFor='gender'>Gender:</label>
        <select {...register("gender", { required: true })} className='form-control' name="gender" id="gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option> 
        </select>
        </div>
        
        {/* {...required("gender", { required: true })} */}
         <button style={{height:'50%', marginTop:'2em'}} type="submit" className="btn btn-primary">Submit</button>
         
      </form>
      </div>
    </div>
    
  )
}

export default Home
