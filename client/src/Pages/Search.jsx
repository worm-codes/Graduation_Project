import React, {useState, useEffect, useContext} from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from "../context/AuthContext";
import '../public/Search.css'
import { Country, State, City }  from 'country-state-city';
import axios from "axios";
import  Slider  from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'


function valuetext(value) {
  return `${value}`;
}
const minDistance = 0;


const Search = () => {

 

  const { currentUser } = useContext(AuthContext);
	let useAuth=useContext(AuthContext)

const [value1, setValue1] = useState([18,80])
const [countryVar, setCountryVar] = useState([])
const [cityVar, setCityVar] = useState([])
const [stateVar, setStateVar] = useState([])


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
   

  let countryInput = watch().country ? watch().country : '';
  let stateInput = watch().state ? watch().state : '';
  let cityInput = watch().city ? watch().city : '';
  let arrivalDate = watch().arriving ? watch().arriving : '';
  let leavingDate = watch().leaving ? watch().leaving : '';
  let host = watch().host ? watch().host : "";
  let minTime = watch().minTime ? watch().minTime : '';
  let maxTime = watch().maxTime ? watch().maxTime : '';
  let maxPeople = watch().maxPeople ? watch().maxPeople : '';
 
  
  let states = [];
  let isFoundCountry = false;
  let isFoundState = false;
  let countryToSetStateObj = {}
  let isStateValidForCountry;
  
  Country.getAllCountries().forEach((country) => {
		if (country.name === countryInput) {
			isFoundCountry = true;
			countryToSetStateObj = country
			states = State.getStatesOfCountry(country.isoCode);

      if(State.getStatesOfCountry(country.isoCode).includes(stateVar)){
				isStateValidForCountry = true;
			}
			else {
				isStateValidForCountry = false;
			}
		}	
	});

  let stateNameSelected = "";
  let chosenState = {};
  let chosenStateArr = [];
  
  let isCountryVarEmpty = Object.keys(countryVar).length === 0;
	let isStateVarEmpty = Object.keys(stateVar).length === 0;
  let isCityValidForState;
  let cities = [];

  states.forEach((state) => {
		if(countryVar.name === countryInput && !isCountryVarEmpty){
			if (state.name === stateInput) {
				isFoundState = true;
        cities = City.getCitiesOfState(countryVar.isoCode, state.isoCode);
				stateNameSelected = state.name;
				chosenState = state;
				chosenStateArr = Object.values(chosenState);

        if(City.getCitiesOfState(countryVar.isoCode, chosenState.isoCode).includes(cityVar)){
					isCityValidForState = true;
				}
				else {
					isCityValidForState = false;
				}
			}
  } else {
    isFoundState = false;
    stateNameSelected = '';
    chosenState = {};
    chosenStateArr.length = 0;
    states.length = 0;
  }
});

console.log("countryVar variable:", countryVar)
	console.log("countryInput variable:", countryInput)
	console.log("stateVar variable:", stateVar);
	console.log("stateInput variable", stateInput);
	console.log("Country state'i içeriyor:",State.getStatesOfCountry(countryVar.isoCode).includes(stateVar))
	console.log("State city'i içeriyor:",City.getCitiesOfState(countryVar.isoCode, stateVar.isoCode).includes(cityVar))
	console.log("cityVar variable:", cityVar);


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


    let boolVarForMinTime = false;
  
    if(finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10)){
        boolVarForMinTime = true;
    }

    if(errors.country){
      errors.state.message = ''
      errors.city.message = ''
      errors.arriving.message = ''
      errors.leaving.message = ''
      errors.minTime.message = ''
      errors.maxTime.message = ''
    }

    if(errors.state){
      errors.city.message = ''
      errors.arriving.message = ''
      errors.leaving.message = ''
      errors.minTime.message = ''
      errors.maxTime.message = ''
    }

    if(errors.city){
      errors.arriving.message = ''
      errors.leaving.message = ''
      errors.minTime.message = ''
      errors.maxTime.message = ''
    }

    if(errors.arriving){
      errors.leaving.message = ''
      errors.minTime.message = ''
      errors.maxTime.message = ''
    }

    if(errors.leaving){
      errors.minTime.message = ''
      errors.maxTime.message = ''
    }

    if(errors.minTime){
      errors.maxTime.message = ''
    }

    let selectedStatesIsoCode = chosenStateArr[1];
    let selectedStatesCountryCode = chosenStateArr[2];
    let filteredStates = states.filter(state => state.name.toLowerCase().startsWith(stateInput.toLowerCase()));
    let filteredCountries = Country.getAllCountries().filter(country => country.name.toLowerCase().startsWith(countryInput.toLowerCase()));
    let finalFilteredCities = cities.filter((city) => city.countryCode === countryVar.isoCode && city.stateCode === stateVar.isoCode &&
      city.name.toLowerCase().startsWith(cityInput.toLowerCase()))

      let isLeavingSelected = false;
      let isDatesSelected = false;
      let isArrivingDateSelected = false;
      let isMinTimeSelected = false;
      let isTimeSelected = false;
  
      if(arrivalDate && leavingDate) {
        isDatesSelected = true
      }
      
      if(arrivalDate){
        isArrivingDateSelected = true;
      }
    
      if(leavingDate){
        isLeavingSelected = true;
      }
  
      if(minTime){
        isMinTimeSelected = true;
      }
  
      if(minTime && maxTime){
        isTimeSelected = true;
      }

    let cityObject = {}
    finalFilteredCities.forEach((city)=> {
      if(city.name === cityInput) {
        cityObject = city;
      }
    })

    useEffect(() => {
      localStorage.clear()
    }, [])
  
      useEffect(() => {	
        setCountryVar(countryToSetStateObj)
      }, [countryInput])
    
      useEffect(() => {
        setStateVar(chosenState)
        isStateValidForCountry = true;
      }, [stateInput])
    
      useEffect(() => {
        setCityVar(cityObject)
        isCityValidForState = true;
      }, [cityInput])

    console.log("countryVar",countryVar);
    console.log("stateVar", stateVar);
    console.log("cityVar", cityVar);
    
    return (
      <div
        /* important */
        style={{
          display: "flex",
          "flexDirection": "column",
          "justifyContent": "center",
          "alignItems": "center",
          height: "88.5vh",
          width: "100vw",
        }}
      >
        {/*  important */}
        {/* <Navbar /> */}
        <div className="generall">
          <div className="containerr">
            <h1>SEARCH FOR AN AD</h1>
            <p>Let's make new connections along the way!</p>
            <form
              onSubmit={handleSubmit(async (data,event) => {
                event.preventDefault();
                const response = await axios.post("http://localhost:5000/api/ad/searchresult", {
                  arrivingDateYear: parseInt(data.arriving?.substring(0,4)),
								  arrivingDateMonth: parseInt(data.arriving?.substring(5,7)),
								  arrivingDateDay: parseInt(data.arriving?.substring(8,10)),
								  leavingDateYear: parseInt(data.leaving?.substring(0,4)),
								  leavingDateMonth: parseInt(data.leaving?.substring(5,7)),
								  leavingDateDay: parseInt(data.leaving?.substring(8,10)),
                  city: cityVar?.name,
                  country: countryVar?.name,
                  host: data.host,
                  maxPeopleToPass: data.maxPeople,
                  minTimeHourToPass: parseInt(data.minTime?.substring(0,2)),
								  minTimeMinuteToPass: parseInt(data.minTime?.substring(3,5)),
								  maxTimeHourToPass: parseInt(data.maxTime?.substring(0,2)),
								  maxTimeMinuteToPass: parseInt(data.maxTime?.substring(3,5)),
                  state: stateVar?.name,
                  gender: data.gender,
                  minAge: value1[0],
                  maxAge: value1[1]
                });
                 console.log(data);
                //  if(response.data === 'success'){
                //   window.location.assign('/searchresult')
                  
                // }
                window.location.assign('/searchresult')
              })}
            >
              <div className="yusuf-container">
                <div className="roww">
                  <div className="columnn">
                    <label htmlFor="country">Country</label>
                    <input
                      autoComplete="off"
                      placeholder="Type in Country"
                      {...register("country", {required:'Please select a country'})}
                      list="countries"
                      name="country"
                      id="country"
                      type="text"
                    />
                    {errors.country &&<p style={{color:'red'}}>{errors.country.message}</p>}
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
                      {...register("state", {required:'Please select a state'})}
                      //value={stateInput}
                      //ref={inputEl}
                      type="text"
                      name="state"
                      id="state"
                      list="states"
                    />
                    {(errors.state && !errors.country && isFoundCountry) ? <p style={{color:'red'}}>{errors.state.message}</p> : ''}
                    {(!errors.state && !errors.country && isFoundCountry && stateVar.name && !isStateValidForCountry) ? <p style={{color:'red'}}>State does not belong to country</p> : ''}
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
                      {...register("city", {required:'Please select a city'})}
                      type="text"
                      name="city"
                      id="city"
                      list="cities"
                    />
                    {(errors.city && !errors.country && !errors.state && isFoundCountry && isFoundState) ? <p style={{color:'red'}}>{errors.city.message}</p> : ''}
                    {(!errors.city && !errors.country && !errors.state && isFoundCountry && isFoundState && cityVar.name && !isCityValidForState) ? <p style={{color:'red'}}>City does not belong to state</p> : ''}
                    <datalist name="cities" id="cities">
                      <option selected disabled value="">
                        Choose a City
                      </option>
                      {finalFilteredCities.map((city, key) => (
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
                      {...register("arriving")}
                      name="arriving"
                      id="arriving"
                      type="date"
                    />
                    {/* {(errors.arriving && !errors.country && !errors.state && !errors.city && isFoundCountry && isFoundState && cityInput) ? <p style={{color:'red'}}>{errors.arriving.message}</p> : ''} */}
                  </div>
  
                  <div className="columnn">
                    <label htmlFor="leaving">Leaving in:</label>
                    <input min={`${arrivalDate}`} {...register("leaving")} disabled={!isArrivingDateSelected}
                    required={isArrivingDateSelected} id="leaving" name="leaving" type="date" />
                    {/* {(errors.leaving && !errors.country && !errors.state && !errors.city && !errors.arriving && isFoundCountry && isFoundState && cityInput && arrivalDate) ? <p style={{color:'red'}}>{errors.leaving.message}</p> : ''} */}
                  </div>
                </div>
                <div className="roww">
                  <div className="columnn">
                    <label id="people" htmlFor="maxPeople">
                      For:
                    </label>
                    <select {...register("maxPeople")} name="maxPeople" id="maxPeople">
                      <option selected value={1}>
                        One People
                      </option>
                      <option value={2}>Two People</option>
                      <option value={3}>Three People</option>
                      <option value={4}>Four People</option>
                    </select>
                  </div>
                  <div className="columnn" id="minTime">
                    <label htmlFor="minTime">From:</label>
                    <input
                      disabled={!isDatesSelected}
                      {...register("minTime")}
                      name="minTime"
                      id="minTime"
                      type="time"
                    />
                    {/* {(errors.minTime && !errors.country && !errors.state && !errors.city && !errors.arriving && !errors.leaving && isFoundCountry && isFoundState && cityInput && arrivalDate && leavingDate) ? <p style={{color:'red'}}>{errors.minTime.message}</p> : ''} */}
                  </div>
  
                  <div className="columnn" id="maxTime">
                    <label htmlFor="maxTime">To:</label>
                    <input
                     disabled={!isDatesSelected && !isMinTimeSelected}
                     required={isMinTimeSelected}
                     {...register("maxTime")}
                      name="maxTime"
                       id="maxTime"
                        type="time"
                         />
                    {/* {(errors.maxTime && !errors.country && !errors.state && !errors.city && !errors.arriving && !errors.leaving && !errors.minTime && isFoundCountry && isFoundState && cityInput && arrivalDate && leavingDate && minTime) ? <p style={{color:'red'}}>{errors.maxTime.message}</p> : ''} */}
                  </div>
                </div>
                <div className='roww'>
                  <div className='columnn' id='gender'>
                    <label htmlFor="gender">Gender</label>
                    <select {...register("gender")} name="gender" id="gender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value={undefined}>Doesn't Matter</option>
                      
                    </select>
                  </div>

                  <div className='columnn' id='host'>
                    <label htmlFor="host">Looking for a host?</label>
                    <select {...register("host")} name="host" id="host">
                      <option value={true}>Yes</option>
                      <option value={false}>No</option> 
                    </select>
                  </div>
                    <div id='searchButtonDiv' className='columnn searchButton'>
                    <button>Submit</button>
                    </div>
                </div>
              </div>
             
            </form>
          </div>
        </div>
      </div>
    );
  
}

export default Search