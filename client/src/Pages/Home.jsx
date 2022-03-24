//WATCH'LADIGIN STATE'IN SEHİRLERİNİ YENİ BİR DROPDWN İCİNDE BAS
//COUNTRY STATE VE CİTY İNPUTLARINI YUKARI AL, DİĞERLERİNİ AŞAĞIDA KONUMLA

import React from 'react'
import { useForm } from 'react-hook-form'
import '../public/Home.css'
import { Country, State, City }  from 'country-state-city';


const Home = () => {



  const { register, handleSubmit, watch, formState: {errors} } = useForm();
  const ageArr = [];
  for(let i = 18; i <= 80; i++){
    ageArr[i-18] = i;
  }
  
  

  // console.log(watch().country)

  let countryInput = watch().country ? watch().country : '';
  let stateInput = watch().state ? watch().state : '';
  let cityInput = watch().city ? watch().city : '';
  let arrivalDate = watch().arriving ? watch().arriving : '';
  let minAge = watch().minAge ? watch().minAge : '';
  let maxAge = watch().maxAge ? watch().maxAge : '';
  // console.log(watch().state)
  // console.log(watch().arriving)
  // console.log(watch().minAge)
  // console.log(watch().maxAge)
  
  let states = [];
  let isFoundCountry = false;
  let isFoundState = false;
  //let isFoundState = false;
  Country.getAllCountries().forEach((country) => {
    if(country.name === countryInput){
      isFoundCountry = true;
      console.log("Finally a valid country input by user")
      states = State.getStatesOfCountry(country.isoCode);

      //  console.log(states);
    }  
  })

  let stateNameSelected = "";
  let chosenState = {};
  let chosenStateArr = [];
  
  

   states.forEach((state) => {
      if(state.name === stateInput){
        isFoundState = true;
        stateNameSelected = state.name;
        chosenState = state;
        chosenStateArr = Object.values(chosenState);
        // console.log("A valid state is selected")
        // console.log("Chosen state as object",chosenState)
        // console.log("Chosen state as array", chosenStateArr)
        // console.log("stateSelected variable", stateNameSelected, stateNameSelected);
        // console.log(typeof chosenState)
        // console.log(City.getCitiesOfState(chosenState.countryCode, chosenState.isoCode))
        // console.log(City.getAllCities());

      }
    })

    let dateToCheck = new Date();
    let year = dateToCheck.getFullYear();
    let month = dateToCheck.getMonth();
    let day = dateToCheck.getDate();
    let strmonth = (month + 1).toString();
    let finalMonth = `0${strmonth}`
    // let hour = dateToCheck.getHours();
    // let minutes = dateToCheck.getMinutes();
    // let seconds = dateToCheck.getSeconds();
    
//     const monthNames = ["January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

    let dateStringToPass = `${year}-${finalMonth}-${day} `;
    let maxAgeArr = [];
    let minAgeArr = [];
    if(maxAge){
      for(let i = 0; i < ageArr.length; i++){
        if(maxAge >= ageArr[i]){
          minAgeArr.push(ageArr[i])
        }
      }
    } else {
      minAgeArr = ageArr;
    }

    for(let i = 0; i < ageArr.length; i++){
      if(minAge <= ageArr[i]){
        maxAgeArr.push(ageArr[i]);
      }
    }

    let selectedStatesIsoCode = chosenStateArr[1];
    let selectedStatesCountryCode = chosenStateArr[2];
    let filteredStates = states.filter(state => state.name.startsWith(stateInput));
    let filteredCountries = Country.getAllCountries().filter(country => country.name.startsWith(countryInput));
    let filteredCities = City.getCitiesOfState(selectedStatesCountryCode, selectedStatesIsoCode).filter(city => city.name.startsWith(cityInput));
    
    
  

  return (
    
      
    <div className='img-bg'>
      <div id='heading'><h2>Search for Ads</h2></div>
      <div>
      <form id="form" onSubmit={handleSubmit((data) => {
        console.log(data);
      })} >

        <div className='row justify-content-md-center'>
        <div className='form-group col col-lg-2'>
        <label htmlFor="country">Type in Country:</label>
        <input autoComplete='off' className='form-control' {...register("country")} list="countries" name="country"  id='country' type="text" />
        <datalist id="countries">
          {filteredCountries.map((country,key) => (
            <option key={key} value={country.name}>{country.name}</option>
          ))}
        </datalist>
        </div>

        <div className='form-group col col-lg-2'>
        <label htmlFor='state'>Choose State:</label>
        <input autoComplete='off' disabled={!isFoundCountry} className='form-control' {...register("state", { required: true })} type="text" name='state' id='state' list='states' />
        <datalist name="states" id="states">
          <option selected disabled value="">Choose a State</option>
          {filteredStates.map((state, key) => (
            <option key={key} value={state.name}>{state.name}</option>
          ))}
          {/* <option value={city}>{city}</option> */}
        </datalist>
        </div>

        <div className='form-group col col-lg-2'>
        <label htmlFor='city'>Choose City:</label>
        <input autoComplete='off' className='form-control' disabled={!isFoundState} {...register("city", { required: true })} type="text" name='city' id='city' list='cities' />
        <datalist name="cities" id="cities">
          <option selected disabled value="">Choose a City</option>
          { filteredCities.map((city,key)=> (
            <option key={key} value={city.name}>{city.name}</option>
          ))}
        </datalist>
        </div>
        </div>

        <div className="w-100"></div>
        
        <div className='row justify-content-md-center'>
        <div className='form-group col col-lg-2'>
        <label htmlFor="arriving">Arriving:</label>
        <input min={`${year}-${finalMonth}-${day}`} max={`${new Date().getFullYear()+1}-${finalMonth}-${day}`} className='form-control' {...register("arriving", { required: 'You have to select an arrival date' })} name="arriving" id="arriving" type="date" />
        </div>
        
        <div className='form-group col col-lg-2'>
        <label htmlFor='leaving'>Leaving:</label>
        <input min={`${arrivalDate}`} className='form-control' {...register("leaving", { required: true })} name='leaving' type="date" />
        </div>
        </div>

        <div className="w-100"></div>
        
        <div className='row justify-content-md-center'>
        <div className='form-group col col-lg-1'>
        <label htmlFor='minAge'>From:</label>
        <select {...register("minAge", { required: 'You have to select minimum age' , min:{value: 18, message:'You have to select minimum age'} })} className='form-control'  name="minAge" id="minAge">
          <option selected disabled value="">Age</option>
          {minAgeArr.map((item,key) => {
            return <option key={key} value={item}>{item}</option>
          })}
        </select>
        </div>

        <div className='form-group col col-lg-1'>
        <label htmlFor='maxAge'>To:</label>
        <select {...register("maxAge", { required: true })} className='form-control' name="maxAge" id="maxAge">
        <option selected disabled value="">Age</option>
        {maxAgeArr.map((item,key) => {
            return <option key={key} value={item}>{item}</option>
          })}
           
        </select>
        </div>
        
        
        <div className='form-group col col-lg-1'>
        <label htmlFor='gender'>Gender:</label>
        <select {...register("gender", { required: true })} className='form-control' name="gender" id="gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option> 
        </select>
        </div>
        <button style={{height:'50%', marginTop:'2em'}} type="submit" className="btn btn-primary">Submit</button>
        </div>
          
      </form>
      </div>
    </div>

    
  )
}

export default Home
