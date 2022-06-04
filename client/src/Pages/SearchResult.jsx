import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { AuthContext } from "../context/AuthContext";
import { useForm } from 'react-hook-form'
import axios from "axios";
import Navbar from '../components/Navbar'
import { Country, State, City }  from 'country-state-city';
import "../public/SearchResult.css";
import  Slider  from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';



//Age Slider Stuff

function valuetext(value) {
	return `${value}`;
  }
  const minDistance = 0;

  //Age Slider Stuff

const SearchResult = () => {

    let useAuth=useContext(AuthContext)
    let navigate = useNavigate();

	// Age Slider Logic Stuff
	const [value1, setValue1] = useState([18,80])
  const [countryVar, setCountryVar] = useState([])
	const [cityVar, setCityVar] = useState([])
	const [stateVar, setStateVar] = useState([])
  const [refresh, setRefresh] = useState()

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
    const [prevAdState, setprevAdState] = useState(null)
    const myQueryResults = useMemo(() => ({ filteredAdState }), [filteredAdState])
    const {
    register,
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




  

    useEffect(() => {      
      const getFilteredAds = async () => {
              const response = await axios.get(`http://localhost:5000/api/ad/searchresult`,{
            headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
            }) 
              console.log("response coming from the backend inside if:", response.data)
              
              if(response.data !== "undefined string"){
                localStorage.clear();
                localStorage.setItem('ads',JSON.stringify(response.data))
                console.log("first if getItem result",JSON.parse(localStorage.getItem('ads')))
                console.log("localstorage length'i, setledikten sonra", localStorage.length);
                setFilteredAdState(response.data)
                
              }
               else if(response.data === 'undefined string' && localStorage.length !== 0){
              console.log("localStorage length inside else if", localStorage.length);
              console.log("localStorage getItem inside else if", JSON.parse(localStorage.getItem('ads')));
              setFilteredAdState(JSON.parse(localStorage.getItem('ads')))
            }                                   
        };
        if(localStorage.length === 0){
          getFilteredAds(); 
        }
        else {
          setFilteredAdState(JSON.parse(localStorage.getItem('ads')))
        }       
           
    }, [])

   

         //BURAYA [filteredAdState] yazınca, sürekli re-render oluyor defalarca ve en sonunda firebase error auth quota exceeded hatası alıyorum
        //BURAYA BOŞ ARRAY ATARSAM, INFINITE LOOP'A GİRMİYOR FAKAT DEĞİŞİMİ GÖRMEM İÇİN SAYFAYI REFRESHLEMEM GEREKIYOR
        //setFilteredAdState yollamak ile boş array yollamak aynı sonuca ulaştırdı.
        //LATEST: BURAYA filteredAdState yollayınca, refreshe gerek kalmadan content yenilendi ama
        // infinite request atıyor hala backend'e, useMemo'dan sonra bile

    // useEffect(() => {
    //   getFilteredAds();
    //   setRefresh(refresh)
    // }, [refresh])
    

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

  let isCountryVarEmpty = Object.keys(countryVar).length === 0;
  let isStateVarEmpty = Object.keys(stateVar).length === 0;

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
   let filteredCountries = Country.getAllCountries().filter(country => country.name.toLowerCase().startsWith(countryInput.toLowerCase()));
   let filteredStates = states.filter((state) => state.name.toLowerCase().startsWith(stateInput.toLowerCase()));
   let filteredCities = City.getCitiesOfState(selectedStatesCountryCode, selectedStatesIsoCode).filter((city) =>
   city.name.toLowerCase().startsWith(cityInput.toLowerCase()));
  //  let statesArrToUse = [];
  //  if(isCountryVarEmpty){
  //    statesArrToUse = State.getAllStates();
  //  }
  //  else {
  //    statesArrToUse = filteredStates;
  //  }

  // let funcToDecideStates = (condition) => {
  //   if(condition) {
  //     return State.getAllStates().filter((state) => state.name.startsWith(stateInput));;
  //   } else {
  //     return filteredStates;
  //   }
  // }

  // let funcToDecideCities = (condition) => {
  //   if(condition) {
  //     return City.getAllCities().filter((city) =>city.name.startsWith(cityInput));;
  //   } else {
  //     return filteredCities
  //   }
  // }



  // let citiesArrToUse = [];
  // if(isStateVarEmpty){
  //   citiesArrToUse = City.getAllCities();
  // } else {
  //   citiesArrToUse = filteredCities;
  // }

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
   
    useEffect(() => {	
      setCountryVar(countryToSetStateObj)	
      // console.log("countryVar state inside useEffect:",countryVar);
    }, [countryInput])
  
  
    useEffect(() => {
      setStateVar(chosenState)
      isStateValidForCountry = true;	
    }, [stateInput])
  
    useEffect(() => {
      setCityVar(cityObj)
      isCityValidForState = true;
    }, [cityInput])

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  // console.log("countryInput var:", countryInput);
  // console.log("countryVar state:",countryVar);

  // Function for adding 0 in front of hours & minutes that are 0 - 9.
  let decideToPutZero = (num) => {
    if(num < 10){
      return '0'+num.toString();
    } else {
      return num.toString();
    }
  }

  let adIDToPass = [];

  for(let i = 0; i < filteredAdState.length; i++){
    adIDToPass.push(`/searchresult/${filteredAdState[i]._id}`)
  }
// ASIDE VE SECTION, MAIN'DEN GELEN ROW CLASS'INA SAHİP OLDUKLARI İÇİN FLEX-ITEM OLUCAKLAR
//SECTION'UN KENDİ İÇİNDEKİ BAZI ELEMENTLERİ DE FLEX'E BAGLAMAYI DÜŞÜNÜYORUM, BAZI FİELDLARI
// YANYANA KONUMLANDIRABİLMEK İÇİN. ÖRNEĞİN İMG SOLDA, AYNI HİZADA YANINDA DESCRİPTİON VESAİRE
  
 let tempStateVar = [];

  return (
    <>
        {/* <Navbar/> */}
        <main className='main container row'>
        <aside className='sidebar'>
            <form onSubmit={handleSubmit(async (data,event) => {
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
                  minTimeTotal: ((parseInt(data.minTime?.substring(0,2)) * 60) + (parseInt(data.minTime?.substring(3,5)))),
                  maxTimeTotal: ((parseInt(data.maxTime?.substring(0,2)) * 60) + (parseInt(data.maxTime?.substring(3,5)))),
                  state: stateVar?.name,
                  gender: data.gender,
                  minAge: value1[0],
                  maxAge: value1[1]
                });

                 setFilteredAdState(response.data);
                 console.log(response.data)
                 localStorage.clear();
                 localStorage.setItem('ads', JSON.stringify(response.data));
                 tempStateVar.push(response.data);
            })}>        
                        
                        <div className="col">
                            <label htmlFor="country">Country</label>
                            {/* <button className='btn btn-primary' data-toggle="collapse" data-target="#country">Select Country</button> */}
                            <input
                                autoComplete="off"
                                placeholder="Type in Country"
                                {...register("country", {required:'Please select a country'})}
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
                    disabled={!isFoundCountry}
                    {...register("state", {required:'Please select a state'})}
										type="text"
										name="state"
										id="state"
										list="states"
									/>
                  {(errors.state && !errors.country && isFoundCountry) ? <p style={{color:'red'}}>{errors.state.message}</p>  : ''}
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
                            {...register("city")}
                            disabled={!isFoundState}
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
                      {...register("arriving")}
                      name="arriving"
                      id="arriving"
                      type="date"
                    />
                  </div>

				          <div className="col">
                    <label htmlFor="leaving">Leaving in:</label>
                    <input
                     min={`${arrivalDate}`}
                    {...register("leaving")}
                    disabled={!isArrivingDateSelected}
                    required={isArrivingDateSelected}
                     id="leaving"
                     name="leaving"
                     type="date" />
                  </div>

				  <div className="col">
                    <label id="people" htmlFor="maxPeople">
                      People Count:
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

				  <div className="col" id="minTime">
                    <label htmlFor="minTime">From:</label>
                    <input
                      {...register("minTime")}
                      name="minTime"
                      id="minTime"
                      type="time"
                    />
                  </div>

				  <div className="col" id="maxTime">
                    <label htmlFor="maxTime">To:</label>
                    <input
                      name="maxTime"
                      {...register("maxTime")}
                      disabled={!isMinTimeSelected}
                      required={isMinTimeSelected}
                       id="maxTime"
                        type="time"
                         />
                  </div>

				  <div className='col' id='gender'>
                    <label htmlFor="gender">Gender</label>
                    <select {...register("gender")} name="gender" id="gender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value={undefined}>Doesn't Matter</option>
                    </select>
                  </div>

				  <div className='col' id='host'>
                    <label htmlFor="host">Looking for a host?</label>
                    <select {...register("host")} name="host" id="host">
                      <option value={true}>Yes</option>
                      <option value={false}>No</option> 
                    </select>
                  </div>

                  <div id='searchResultButtonDiv' className='col searchResultButton'>
                    <button className='btn btn-primary'>Search Ads</button>
                    </div>
            </form>
        </aside>

                                         
        <section className='query-results'>
        {filteredAdState.length > 0 ? filteredAdState.map((ad,key) => (
            <div className='query-content'>
              <div onClick={async(e) => {e.preventDefault();
                const response = await axios.post(`http://localhost:5000/api/ad/searchresult/${ad._id}`, {
                });
                console.log(response.data)
                navigate(`/searchresult/${ad._id}`)
              }}><h2> {`${ad.state} - ${ad.country}`}</h2></div>

        <div className='conditionalFlex'>      
				<div className='query-text'>
                <img className='imgBorder' height="200" width="200" src="https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
				<p id='bigscreentext'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat impedit ad accusamus provident libero animi neque labore, iusto maiores odit. Veniam dolor non reprehenderit necessitatibus debitis architecto repellat ratione ullam.
        Repellendus quisquam voluptatum accusantium, debitis molestias accusamus libero sunt expedita minus aliquam pariatur molestiae voluptatem aperiam doloribus ullam ducimus consectetur! Quod laudantium inventore modi molestiae nesciunt, cupiditate numquam quasi. Odio?</p>
        
        <p id='mediumscreentext'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi autem reiciendis, reprehenderit quae fugit sed excepturi cumque sequi odio voluptate omnis hic accusantium natus minus magni, doloremque, ipsa ab cum?</p>
        <p id='smallscreenemptytext'></p>
				</div>
        <div style={{justifyContent:'space-between'}} className='dateAndTimeDiv'>
        <p>{ad.city}</p>
        <p>{`Date: ${ad.arriving_date_day.toString()} ${months[ad.arriving_date_month-1]} - ${ad.leaving_date_day.toString()} ${months[ad.leaving_date_month-1]}`}</p>
        <p style={{marginRight:'3em'}} id='timeText'>{`From:  ${decideToPutZero(ad.minTimeHour)}:${decideToPutZero(ad.minTimeMinute)} - To: ${decideToPutZero(ad.maxTimeHour)}:${decideToPutZero(ad.maxTimeMinute)}`}</p>
        </div>
        </div> 
            </div>
)) : tempStateVar.map((ad,key) => (
    <div className='query-content'>
      <div onClick={async(e) => {e.preventDefault();
                const response = await axios.post(`http://localhost:5000/api/ad/searchresult/${ad._id}`, {
                });
                console.log(response.data)
                navigate(`/searchresult/${ad._id}`)
              }}><h2> {`${ad.state} - ${ad.country}`}</h2>
      </div>

      <div className='conditionalFlex'>      
				<div className='query-text'>
                <img className='imgBorder' height="200" width="200" src="https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
				<p id='bigscreentext'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat impedit ad accusamus provident libero animi neque labore, iusto maiores odit. Veniam dolor non reprehenderit necessitatibus debitis architecto repellat ratione ullam.
        Repellendus quisquam voluptatum accusantium, debitis molestias accusamus libero sunt expedita minus aliquam pariatur molestiae voluptatem aperiam doloribus ullam ducimus consectetur! Quod laudantium inventore modi molestiae nesciunt, cupiditate numquam quasi. Odio?</p>
        
        <p id='mediumscreentext'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi autem reiciendis, reprehenderit quae fugit sed excepturi cumque sequi odio voluptate omnis hic accusantium natus minus magni, doloremque, ipsa ab cum?</p>
        <p id='smallscreenemptytext'></p>
				</div>
        <div style={{justifyContent:'space-between'}} className='dateAndTimeDiv'>
        <p>{ad.city}</p>
        <p>{`Date: ${ad.arriving_date_day.toString()} ${months[ad.arriving_date_month-1]} - ${ad.leaving_date_day.toString()} ${months[ad.leaving_date_month-1]}`}</p>
        <p style={{marginRight:'3em'}} id='timeText'>{`From:  ${decideToPutZero(ad.minTimeHour)}:${decideToPutZero(ad.minTimeMinute)} - To: ${decideToPutZero(ad.maxTimeHour)}:${decideToPutZero(ad.maxTimeMinute)}`}</p>
        </div>
        </div>
    </div>
))}
            
        </section>
        </main>
    </>
  )
}

export default SearchResult