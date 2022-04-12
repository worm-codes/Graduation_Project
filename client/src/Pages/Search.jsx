import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import '../public/Search.css'
import { Country, State, City }  from 'country-state-city';
import  Slider  from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Navbar from './Navbar';


function valuetext(value) {
  return `${value}`;
}
const minDistance = 0;


const Search = () => {


const [value1, setValue1] = useState([18,80])
const [genderr, setGenderr] = useState('');
const [availableHost, setAvailableHost] = useState(false)



// let handleClick(event) => {

// }




// const updateAge = (e,data) => {
//   setAgeValue(data);
// }

const handleChange1 = (event, newValue, activeThumb) => {
  if (!Array.isArray(newValue)) {
    return;
  }

  if (activeThumb === 0) {
    setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
  } else {
    setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
  }
};




  const { register, handleSubmit, watch, formState: {errors} } = useForm();
  const ageArr = [];
  for(let i = 18; i <= 80; i++){
    ageArr[i-18] = i;
  }
  
  

   

  let countryInput = watch().country ? watch().country : '';
  let stateInput = watch().state ? watch().state : '';
  let cityInput = watch().city ? watch().city : '';
  let arrivalDate = watch().arriving ? watch().arriving : '';
  let leavingDate = watch().leaving ? watch().leaving : '';
  
  let maxPeople = watch().maxPeople ? watch().maxPeople : '';
  // let Gender1 = watch().Gender1 ? watch().Gender1 : '';
  // let Gender2 = watch().Gender2 ? watch().Gender2 : '';
  // let Host = watch().Host ? watch().Host : '';
  //let ageRange = [value1[0], value1[1]];
  //let ageInput = watch().ageRange ? watch().ageRange : '';
  let StateData = {
    minAge: value1[0],
    maxAge: value1[1],
    gender: genderr,
    host: availableHost
  }
  
  
  // let maxAge = watch().maxAge ? watch().maxAge : '';
  let minTime = watch().minTime ? watch().minTime : '';
  let maxTime = watch().maxTime ? watch().maxTime : '';
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
      //console.log("Finally a valid country input by user")
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
	let day = dateToCheck.getDate().toString();
	let hour = dateToCheck.getHours();
	let minutes = dateToCheck.getMinutes();
	let minimumTime = `${hour}:${minutes}`;
	let todayDate = new Date().toISOString().slice(0, 10);
    let isLargerThanNineMonth = '';
    let isLessThanNineMonth = '';
    let finalMonthToUse = '';
    if(month >= 9){
        isLargerThanNineMonth = (month + 1).toString()
        finalMonthToUse = isLargerThanNineMonth;
    }
    else {
        isLessThanNineMonth = '0'+(month + 1).toString()
        finalMonthToUse = isLessThanNineMonth;
    }
    if(parseInt(day) < 10) {
      day = '0'+day
    }

    // console.log("arrival date day",arrivalDate.substring(8,10))
    // console.log(typeof finalMonthToUse);
    let boolVarForMinTime = false;
    // finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10)
    //boolVarForMinTime = finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10)
    if(finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10)){
        boolVarForMinTime = true;
    }
     //console.log(boolVarForMinTime)

    //let dateStringToPass = `${year}-${finalMonth}-${day} ${hour}:${minutes}`;
  

    let selectedStatesIsoCode = chosenStateArr[1];
    let selectedStatesCountryCode = chosenStateArr[2];
    let filteredStates = states.filter(state => state.name.startsWith(stateInput));
    let filteredCountries = Country.getAllCountries().filter(country => country.name.startsWith(countryInput));
    let filteredCities = City.getCitiesOfState(selectedStatesCountryCode, selectedStatesIsoCode).filter(city => city.name.startsWith(cityInput));
    // const [StateDateData, setStateDateData] = useState(arrivalDate)
    
    // useEffect(() => {
    //   setStateDateData(arrivalDate)
      
    // }, [arrivalDate])

    let isLeavingSelected = false;
	  let isDatesSelected = false;
	  if(arrivalDate && leavingDate) {
		  isDatesSelected = true
	  }
	  console.log("isDatesSelected:",isDatesSelected)
	  if(leavingDate){
		  isLeavingSelected = true;
	  }
    
    return (
      <div
        /* important */
        style={{
          display: "flex",
          "flexDirection": "column",
          "justifyContent": "center",
          "alignItems": "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        {/*  important */}
        <Navbar />
        <div className="general">
          <div className="containerr">
            <h1>SEARCH FOR AN AD</h1>
            <p>Let's make new connections along the way!</p>
            <form
              onSubmit={handleSubmit(async (data) => {
                // let readyData = Object.assign(data,HostData)
                // const response = await axios.post("http://localhost:5000/api/publish", {
                //   arriving: data.arriving,
                //   city: data.city,
                //   country: data.country,
                //   // user_gender:currentUser.user_gender,
                //   user_email: currentUser.email,
                //   // user_date_of_birth:currentUser.user_date_of_birth,
                //   // user_objID:currentUser._id,
                //   // user_age: currentUserAge,
                //   description: data.description,
                //   host: data.host,
                //   leaving: data.leaving,
                //   maxPeople: data.maxPeople,
                //   minTime: data.minTime,
                //   maxTime: data.maxTime,
                //   state: data.state,
                //   userToProcess: currentUser,
                // });
                console.log(data);
              })}
            >
              <div className="yusuf-container">
                <div className="roww">
                  <div className="columnn">
                    <label htmlFor="country">Country</label>
                    <input
                      autoComplete="off"
                      placeholder="Type in Country"
                      {...register("country")}
                      list="countries"
                      name="country"
                      id="country"
                      type="text"
                    />
                    <datalist id="countries">
                      {filteredCountries.map((country, key) => (
                        <option key={key} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div className="columnn">
                    <label htmlFor="state">State</label>
                    <input
                      autoComplete="off"
                      placeholder="Type in State"
                      disabled={!isFoundCountry}
                      {...register("state", { required: true })}
                      type="text"
                      name="state"
                      id="state"
                      list="states"
                    />
                    <datalist name="states" id="states">
                      <option selected disabled value="">
                        Choose a State
                      </option>
                      {filteredStates.map((state, key) => (
                        <option key={key} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div className="columnn">
                    <label htmlFor="city">City</label>
                    <input
                      autoComplete="off"
                      placeholder="Type in City"
                      disabled={!isFoundState}
                      {...register("city", { required: true })}
                      type="text"
                      name="city"
                      id="city"
                      list="cities"
                    />
                    <datalist name="cities" id="cities">
                      <option selected disabled value="">
                        Choose a City
                      </option>
                      {filteredCities.map((city, key) => (
                        <option key={key} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="roww">
                  <div className="columnn">
                  <label htmlFor='ageRange'>Age Range:</label>
                    <Box id='slider'>
                      <Slider 
                        value={value1}
                        onChange={handleChange1}
                        getAriaValueText={valuetext}
                        getAriaLabel={() => 'Age value min range'}
                        valueLabelDisplay="auto"
                        min={18}
                        max={80}
                        disableSwap
                      />
                    </Box>
                  </div>
                  <div className="columnn">
                    <label htmlFor="arriving">Arriving in:</label>
                    <input
                      min={todayDate}
                      max={isLeavingSelected === false ? `${new Date().getFullYear() + 1}-${finalMonthToUse}-${day}` : leavingDate}
                      {...register("arriving", { required: "You have to select an arrival date" })}
                      name="arriving"
                      id="arriving"
                      type="date"
                    />
                  </div>
  
                  <div className="columnn">
                    <label htmlFor="leaving">Leaving in:</label>
                    <input min={`${arrivalDate}`} {...register("leaving", { required: true })} id="leaving" name="leaving" type="date" />
                  </div>
                </div>
                <div className="roww">
                  <div className="columnn">
                    <label id="people" htmlFor="maxPeople">
                      For:
                    </label>
                    <select {...register("maxPeople", { required: true })} name="maxPeople" id="maxPeople">
                      <option selected value="1">
                        One People
                      </option>
                      <option value="2">Two People</option>
                      <option value="3">Three People</option>
                      <option value="4">Four People</option>
                    </select>
                  </div>
                  <div className="columnn" id="minTime">
                    <label htmlFor="minTime">From:</label>
                    <input
                      disabled={!isDatesSelected}
                      min={boolVarForMinTime ? minimumTime : ''}
                      {...register("minTime", { required: true })}
                      name="minTime"
                      id="minTime"
                      type="time"
                    />
                  </div>
  
                  <div className="columnn" id="maxTime">
                    <label htmlFor="maxTime">To:</label>
                    <input disabled={!isDatesSelected}
                     {...register("maxTime", { required: true })}
                      name="maxTime"
                       id="maxTime"
                        type="time"
                         />
                  </div>
                </div>
                <div className='roww'>
                  <div className='columnn' id='gender'>
                    <label htmlFor="gender">Gender</label>
                    <select {...register("gender", { required: true })} name="gender" id="gender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Doesn't matter">Doesn't Matter</option>
                      
                    </select>
                  </div>

                  <div className='columnn' id='host'>
                    <label htmlFor="host">Looking for a host?</label>
                    <select {...register("host", { required: true })} name="host" id="host">
                      <option value={true}>Yes</option>
                      <option value={false}>No</option> 
                    </select>
                  </div>
                    <div id='searchButtonDiv' className='columnn searchButton'>
                    <button>Submit</button>
                    </div>
                </div>
              </div>
              {/* <div className="roww">
                <div className="columnn">
                  <label htmlFor="description">Describe your guidance plan</label>
                  <textarea
                    name="description"
                    {...register("description", { required: true })}
                    id="description"
                    placeholder="Describe your guidance plan in detail here"
                    rows="5"
                  ></textarea>
                </div>
              </div> */}
              {/* <button>Submit</button> */}
            </form>
          </div>
        </div>
      </div>
    );
  // return (
  //     <>
  //     <Navbar/>
  //     <div className='searchPage'>
  //     <div className='bodydiv'>
  //         <div className='row'>
  //             <div className='col-sm-6'>
  //             <div id='collapsedstyle' className="container">
  //   <div className="title">Find a Local Guide</div>
  //   <div className="content">
  //     <form onSubmit={handleSubmit((data) => {
  //       let finalData = Object.assign(data,StateData)
  //       console.log(finalData);
  //     })}>
  //       <div className="user-details">
  //         <div className="input-box">
  //           <label className="details" htmlFor='country'>Country</label>
  //           <input autoComplete='off' placeholder='Type in Country'  {...register("country")} list="countries" name="country"  id='country' type="text" />
  //           <datalist id="countries">
  //         {filteredCountries.map((country,key) => (
  //           <option key={key} value={country.name}>{country.name}</option>
  //         ))}
  //       </datalist>
  //         </div>
  //         <div className="input-box">
  //           <label className="details" htmlFor='state'>State</label>
  //           <input autoComplete='off' placeholder='Type in State' disabled={!isFoundCountry}  {...register("state", { required: true })} type="text" name='state' id='state' list='states' />
  //           <datalist name="states" id="states">
  //         <option selected disabled value="">Choose a State</option>
  //         {filteredStates.map((state, key) => (
  //           <option key={key} value={state.name}>{state.name}</option>
  //         ))}
  //       </datalist>
  //         </div>
  //         <div className="input-box">
  //           <label className="details">City</label>
  //           <input autoComplete='off' placeholder='Type in City' disabled={!isFoundState} {...register("city", { required: true })} type="text" name='city' id='city' list='cities' />
  //       <datalist name="cities" id="cities">
  //         <option selected disabled value="">Choose a City</option>
  //         { filteredCities.map((city,key)=> (
  //           <option key={key} value={city.name}>{city.name}</option>
  //         ))}
  //       </datalist>
  //         </div>
  //         <div className="input-box">
  //           <label className="details">Age Range:</label>
  //           {/* <input type="text" placeholder="Enter your number" required /> */}
  //           <Box id='slider'>
  //           <Slider 
  //            value={value1}
  //             onChange={handleChange1}
  //              getAriaValueText={valuetext}
  //               getAriaLabel={() => 'Age value min range'}
  //               valueLabelDisplay="auto"
  //               min={18}
  //               max={80}
  //               disableSwap
  //               />
  //     </Box>
  //         </div>
  //         <div className="input-box">
  //           <label className="details" htmlFor='arriving'>Arriving in:</label>
  //           <input min={todayDate} max={`${new Date().getFullYear()+1}-${finalMonth}-${day}`}  {...register("arriving", { required: 'You have to select an arrival date' })} name="arriving" id="arriving" type="date" />
  //         </div>
  //         <div className="input-box">
  //           <label className="details" htmlFor='leaving'>Leaving in:</label>
  //           <input  min={`${arrivalDate}`}  {...register("leaving", { required: true })} name='leaving' type="date" />
  //         </div>

  //         <div className="input-box" id='lastrow1'>
  //           <label className="details" htmlFor='minTime'>From:</label>
  //           <input min={minimumTime} {...register("minTime", { required: true })} name='minTime' id='minTime' type="time" />
  //         </div>

  //         <div className="input-box" id='lastrow2'>
  //           <label className="details" htmlFor='maxTime'>To:</label>
  //           <input {...register("maxTime", { required: true })} name='maxTime' id='maxTime' type="time" />
  //         </div>

  //         <div className="input-box" id='lastrow3'>
  //           <label className="details" htmlFor='maxPeople'>People:</label>
  //           <select {...register("maxPeople", { required: true })}  name="maxPeople" id="maxPeople">
  //             <option selected value="1">One</option>
  //             <option value="2">Two</option> 
  //             <option value="3">Three</option> 
  //             <option value="4">Four</option> 
  //       </select>
  //         </div>
          
  //       </div>
  //       <div className="gender-details">
  //         <input onClick={() => setGenderr('Male')}  type="radio" name="gender" id="dot-1"/>
  //         <input onClick={() => setGenderr('Female')}  type="radio" name="gender" id="dot-2"/>
  //         <input onClick={() => setAvailableHost(false)} type="checkbox" name="host1" id="host-1" />
  //         <input onClick={() => setAvailableHost(true)} type="checkbox" name="host2" id="host-2" />
  //         <span className="gender-title">Gender</span>
  //         <span className="host-title">You Need Host?</span>
          
  //         <div className="category">
  //           <label  className='details' id='dot11' htmlFor="dot-1">
  //           <span className="dot one"></span>
  //           <span className="gender">Male</span>
  //         </label>
  //         <label className='details' id='dot22' htmlFor="dot-2">
  //           <span className="dot two"></span>
  //           <span className="gender">Female</span>
  //         </label>
         
  //         <label className='details' id='host11' htmlFor="host-1">
  //           <span className='prehost1'></span>
  //           <span className='host1'>Yes</span>
  //         </label>

  //         <label className='details' id='host22' htmlFor="host-2">
  //           <span className='prehost2'></span>
  //           <span className='host2'>No</span>
  //         </label>
  //         </div>
          
  //       </div>
  //       <div className="button">
  //         <input type="submit" value="Find a Guide"/>
  //       </div>
  //     </form>
     
  //       {/* <button><a style={{color:'red'}} href='/publish'>Go</a></button> */}
  //       {/* <Link id='' className='title' to="/publish">Go</Link> */}
  //   </div>
  // </div>
  //             </div>
  //             <div id='photo' className='col-sm-6'>
  //                   <img  className='img-fluid' src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" /> 
  //             </div>
  //         </div>
      
  // </div>
  // </div>
  //     </>
  // )
    
   
    

    
  
}

export default Search