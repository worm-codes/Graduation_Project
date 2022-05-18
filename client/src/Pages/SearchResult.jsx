import React, { useState, useContext, useLayoutEffect } from 'react'
import { AuthContext } from "../context/AuthContext";
// import { Link, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form'
import axios from "axios";
import Navbar from "./Navbar";
import { Country, State, City }  from 'country-state-city';
import "../public/SearchResult.css";
import  Slider  from '@mui/material/Slider';
import Box from '@mui/material/Box';



//Age Slider Stuff

function valuetext(value) {
	return `${value}`;
  }
  const minDistance = 0;

  //Age Slider Stuff

const SearchResult = () => {

    let useAuth=useContext(AuthContext)

	// Age Slider Logic Stuff
	const [value1, setValue1] = useState([18,80])

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
	  
	  // Age Slider Logic Stuff

    const [filteredAdState, setFilteredAdState] = useState([])
    const {
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	let countryInput = watch().country ? watch().country : '';
	let stateInput = watch().state ? watch().state : '';
	let cityInput = watch().city ? watch().city : '';
	let arrivalDate = watch().arriving ? watch().arriving : '';
	let leavingDate = watch().leaving ? watch().leaving : '';
	let host = watch().host ? watch().host : "";
	let minTime = watch().minTime ? watch().minTime : '';
	let maxTime = watch().maxTime ? watch().maxTime : '';
	let maxPeople = watch().maxPeople ? watch().maxPeople : '';

    useLayoutEffect(() => {
        const getFilteredAds = async () => {
            const response = await axios.get(`http://localhost:5000/api/searchresult`,{
                headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
              }) 
              console.log("response coming from the backend:", response.data)
              setFilteredAdState(response.data)
        } 
        getFilteredAds();
    }, [])
    

    //COUNTRY --- STATE --- CITY FINDING CODES
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

    let isCityValidForState;

    let stateNameSelected = "";
	let chosenState = {};
	let chosenStateArr = [];

	states.forEach((state) => {
		if(countryVar.name === countryInput && !isCountryVarEmpty){
			if (state.name === stateInput) {
				isFoundState = true;
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


    let cityObj = {}

	City.getAllCities().forEach((city) => {
		if (city.name === cityInput) {
			cityObj = city	
		}	
	});
    //COUNTRY --- STATE --- CITY FINDING CODES
    
   let selectedStatesIsoCode = chosenStateArr[1];
   let selectedStatesCountryCode = chosenStateArr[2];
   let filteredCountries = Country.getAllCountries().filter(country => country.name.startsWith(countryInput));
   let filteredStates = states.filter((state) => state.name.startsWith(stateInput));
   let filteredCities = City.getCitiesOfState(selectedStatesCountryCode, selectedStatesIsoCode).filter((city) =>
		city.name.startsWith(cityInput)
	);

	//DATE LOGIC

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

	let isLeavingSelected = false;
	  let isDatesSelected = false;
	  if(arrivalDate && leavingDate) {
		  isDatesSelected = true
	  }
	
	  if(leavingDate){
		  isLeavingSelected = true;
	  }
   

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    // FONKSIYONUNU YAZ

  //   let finalMinTimeHour = '';
  //   let finalMinTimeMinute = '';
  //   let finalMaxTimeHour = '';
  //   let finalMaxTimeMinute = '';
 
  // for(let i = 0; i < filteredAdState.length; i++){
  //   if(filteredAdState[i].minTimeHour < 10) {
  //     finalMinTimeHour = '0'+filteredAdState[i].minTimeHour;
  //   }
  //   else {
  //     finalMinTimeHour = filteredAdState[i].minTimeHour
  //   }
  //   if(filteredAdState[i].minTimeMinute < 10) {
  //     finalMinTimeMinute = '0'+filteredAdState[i].minTimeMinute;
  //   }
  //   else {
  //     finalMinTimeMinute = filteredAdState[i].minTimeMinute
  //   }
  //   if(filteredAdState[i].maxTimeHour < 10) {
  //     finalMaxTimeHour = '0'+filteredAdState[i].maxTimeHour;
  //   }
  //   else {
  //     finalMaxTimeHour = filteredAdState[i].maxTimeHour
  //   }
  //   if(filteredAdState[i].maxTimeMinute < 10) {
  //     finalMaxTimeMinute = '0'+filteredAdState[i].maxTimeMinute;
  //   }
  //   else {
  //     finalMaxTimeMinute = filteredAdState[i].maxTimeMinute
  //   }
  // }
    
// ASIDE VE SECTION, MAIN'DEN GELEN ROW CLASS'INA SAHİP OLDUKLARI İÇİN FLEX-ITEM OLUCAKLAR
//SECTION'UN KENDİ İÇİNDEKİ BAZI ELEMENTLERİ DE FLEX'E BAGLAMAYI DÜŞÜNÜYORUM, BAZI FİELDLARI
// YANYANA KONUMLANDIRABİLMEK İÇİN. ÖRNEĞİN İMG SOLDA, AYNI HİZADA YANINDA DESCRİPTİON VESAİRE

  return (
    <>
        <Navbar/>
        <main className='main container row'>
        <aside className='sidebar'>
            <form onSubmit={handleSubmit(async (data) => {

            })}>        
                        
                        <div className="col">
                            <label htmlFor="country">Country</label>
                            {/* <button className='btn btn-primary' data-toggle="collapse" data-target="#country">Select Country</button> */}
                            <input
                                autoComplete="off"
                                placeholder="Type in Country"
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

                        <div className="col">
									<label htmlFor="state">State</label>
									<input 
										autoComplete="off"
										placeholder="Type in State"
										type="text"
										name="state"
										id="state"
										list="states"
									/>
									{(!errors.state && !errors.country && isFoundCountry && stateVar.name && !isStateValidForCountry) ? <p style={{color:'red'}}>State does not belong to country</p> : ''}
									<datalist name="states" id="states">
										{
											filteredStates.map((state, key) => (
												<option key={key} value={state.name}>
													{state.name}
												</option>
											))
										 }
									</datalist>
								</div>

						<div className="col">
                    		<label htmlFor="city">City</label>
                    		<input
                     			 autoComplete="off"
                      			placeholder="Type in City"
                      			type="text"
                     			 name="city"
                      			id="city"
                      			list="cities"
                    			/>
                    {(!errors.city && !errors.country && !errors.state && isFoundCountry && isFoundState && cityVar.name && !isCityValidForState) ? <p style={{color:'red'}}>City does not belong to state</p> : ''}
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

				  <div className="col">
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

				  <div className="col">
                    <label htmlFor="arriving">Arriving in:</label>
                    <input
                      min={todayDate}
                      max={isLeavingSelected === false ? `${new Date().getFullYear() + 1}-${finalMonthToUse}-${day}` : leavingDate}
                      name="arriving"
                      id="arriving"
                      type="date"
                    />
                  </div>

				  <div className="col">
                    <label htmlFor="leaving">Leaving in:</label>
                    <input min={`${arrivalDate}`} id="leaving" name="leaving" type="date" />
                  </div>

				  <div className="col">
                    <label id="people" htmlFor="maxPeople">
                      People Count:
                    </label>
                    <select name="maxPeople" id="maxPeople">
                      <option selected value={1}>
                        One People
                      </option>
                      <option value={2}>Two People</option>
                      <option value={3}>Three People</option>
                      <option value={4}>Four People</option>
                    </select>
                  </div>

				  <div className="col" id="minTime">
                    <label htmlFor="minTime">From:</label>
                    <input
                      min={boolVarForMinTime ? minimumTime : ''}
                      name="minTime"
                      id="minTime"
                      type="time"
                    />
                  </div>

				  <div className="col" id="maxTime">
                    <label htmlFor="maxTime">To:</label>
                    <input
                      name="maxTime"
                       id="maxTime"
                        type="time"
                         />
                  </div>

				  <div className='col' id='gender'>
                    <label htmlFor="gender">Gender</label>
                    <select name="gender" id="gender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Doesn't matter">Doesn't Matter</option>
                    </select>
                  </div>

				  <div className='col' id='host'>
                    <label htmlFor="host">Looking for a host?</label>
                    <select name="host" id="host">
                      <option value={true}>Yes</option>
                      <option value={false}>No</option> 
                    </select>
                  </div>

            </form>
        </aside>

                                         
        <section className='query-results'>
        {filteredAdState.map((ad,key) => (
            <div className='query-content'>
                <h2>{`${ad.state} - ${ad.country}`}</h2>
				<div className='query-text'>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp6wPN6-0GRdNKIvLrdx4aVJP-X_QcPy5tjQ&usqp=CAU" alt="" />
				<p id='bigscreentext'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat impedit ad accusamus provident libero animi neque labore, iusto maiores odit. Veniam dolor non reprehenderit necessitatibus debitis architecto repellat ratione ullam.
        Repellendus quisquam voluptatum accusantium, debitis molestias accusamus libero sunt expedita minus aliquam pariatur molestiae voluptatem aperiam doloribus ullam ducimus consectetur! Quod laudantium inventore modi molestiae nesciunt, cupiditate numquam quasi. Odio?</p>
        
        <p id='mediumscreentext'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi autem reiciendis, reprehenderit quae fugit sed excepturi cumque sequi odio voluptate omnis hic accusantium natus minus magni, doloremque, ipsa ab cum?</p>
        <p id='smallscreenemptytext'></p>
				</div>
        <p>{`${ad.city}  ${ad.arriving_date_day.toString()} ${months[ad.arriving_date_month-1]} - ${ad.leaving_date_day.toString()} ${months[ad.leaving_date_month-1]}`}</p>
        <p>{`From:  ${ad.minTimeHour.toString()}:${ad.minTimeMinute.toString()} - To: ${ad.maxTimeHour.toString()}:${ad.maxTimeMinute.toString()}`}</p>
            </div>
        ))}
            
        </section>
        </main>
    </>
  )
}

export default SearchResult