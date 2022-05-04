import React, { useState, useEffect, useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "../public/Publish.css";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import Navbar from "./Navbar";

const Publish = () => {
	// const [isHost, setIsHost] = useState(false)
	//const isFoundCountryy = useRef(false);
	//const stateRef = useRef('Type in Stateeeee');
	const [countryVar, setCountryVar] = useState([])
	const [cityVar, setCityVar] = useState('')
	const [stateVar, setStateVar] = useState([])
	const [err, setErr] = useState('')
	//const [textInputState, setTextInputState] = useState('')


	const { currentUser } = useContext(AuthContext);
	let useAuth=useContext(AuthContext)
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();
	//currentUserAge = new Date().getFullYear() - currentUser.user_date_of_birth.substring(0,4);
	//console.log(currentUser);

	//const allCountries = Country.getAllCountries();
	//console.log(allCountries.name)
	// for(let ctr of allCountries){
	// 	console.log(ctr.name)
	// }

	let countryInput = watch().country ? watch().country : "";
	let stateInput = watch().state ? watch().state : "";
	let cityInput = watch().city ? watch().city : "";
	let arrivalDate = watch().arriving ? watch().arriving : "";
	let leavingDate = watch().leaving ? watch().leaving : "";
	let maxPeople = watch().maxPeople ? watch().maxPeople : "";
	let host = watch().host ? watch().host : "";
	let minTime = watch().minTime ? watch().minTime : "";
	let maxTime = watch().maxTime ? watch().maxTime : "";
	let description = watch().description ? watch().description : "";

    
	// let HostData = {
	//     host: isHost
	//   }

	let states = [];
	let isFoundCountry = false;
	let isFoundState = false;
	let countryToSetStateObj = {}

	Country.getAllCountries().forEach((country) => {
		if (country.name === countryInput) {
			isFoundCountry = true;
			countryToSetStateObj = country
			states = State.getStatesOfCountry(country.isoCode);
		}	
	});


	let stateNameSelected = "";
	let chosenState = {};
	let chosenStateArr = [];

	let isCountryVarEmpty = Object.keys(countryVar).length === 0;
	let isStateVarEmpty = Object.keys(stateVar).length === 0;

	states.forEach((state) => {
		if(countryVar.name === countryInput && !isCountryVarEmpty){
			if (state.name === stateInput) {
				isFoundState = true;
				//setStateVar(state.name)
				stateNameSelected = state.name;
				chosenState = state;
				chosenStateArr = Object.values(chosenState);
			}
		} else {
			isFoundState = false;
			stateNameSelected = '';
			chosenState = {};
			chosenStateArr.length = 0;
			states.length = 0;
		}
	});

	// if(allCountries.includes(countryInput) === false) {

	// }
	

	//setCityVar(cityInput)

	const objectsEqual = (o1, o2) => {
    Object.keys(o1).length === Object.keys(o2).length 
        && Object.keys(o1).every(p => o1[p] === o2[p])
	};

	useEffect(() => {	
		setCountryVar(countryToSetStateObj)
		setStateVar([])
	}, [countryInput])


	useEffect(() => {
		setStateVar(chosenState)	
	}, [stateInput])

	useEffect(() => {
		setCityVar(cityInput)
	}, [cityInput])

	// console.log(isFoundCountry)
	// console.log("countryVar",countryVar)
	// console.log("countryInput", countryInput);
	
	// console.log("stateInput var",stateInput)
	// console.log("stateVar", stateVar);
	// console.log("textInputState var",textInputState);
	//console.log("countryToSetTheState arr variable:", countryToSetTheStateArr);
	// console.log("stateRef.current after:",stateRef.current)
	//console.log("stateRef var:", stateRef.current.value);

	//console.log("states arr:", states);

	// useEffect(() => {
	// 	if(states.length > 0){
	// 		if(objectsEqual(states, State.getStatesOfCountry(countryVar.isoCode)) === false){
	// 			setStateVar('');
	// 			cityInput = '';
	// 		}
	// 		}		
	// }, [countryVar])

	let dateToCheck = new Date();
	let todayDate = new Date().toISOString().slice(0, 10);
	let year = dateToCheck.getFullYear();
	let month = dateToCheck.getMonth();
	let day = dateToCheck.getDate().toString();
	let hour = dateToCheck.getHours();
	let minutes = dateToCheck.getMinutes();
	let minimumTime = `${hour}:${minutes}`;
    let isLargerThanNineMonth = '';
    let isLessThanNineMonth = '';
    let finalMonthToUse = '';
	let boolVarForMinTime = false;
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

    if(finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10)){
        boolVarForMinTime = true;
    }



	let selectedStatesIsoCode = chosenStateArr[1];
	let selectedStatesCountryCode = chosenStateArr[2];
	let filteredStates = states.filter((state) => state.name.startsWith(stateInput));
	let filteredCountries = Country.getAllCountries().filter((country) => country.name.startsWith(countryInput));
	let filteredCities = City.getCitiesOfState(selectedStatesCountryCode, selectedStatesIsoCode).filter((city) =>
		city.name.startsWith(cityInput)
	);

	
	if(errors.country){
		errors.state.message = ''
		errors.city.message = ''
		errors.arriving.message = ''
		errors.leaving.message = ''
		errors.minTime.message = ''
		errors.maxTime.message = ''
		errors.description.message = ''
	  }
  
	  if(errors.state){
		errors.city.message = ''
		errors.arriving.message = ''
		errors.leaving.message = ''
		errors.minTime.message = ''
		errors.maxTime.message = ''
		errors.description.message = ''
	  }
  
	  if(errors.city){
		errors.arriving.message = ''
		errors.leaving.message = ''
		errors.minTime.message = ''
		errors.maxTime.message = ''
		errors.description.message = ''
	  }
  
	  if(errors.arriving){
		errors.leaving.message = ''
		errors.minTime.message = ''
		errors.maxTime.message = ''
		errors.description.message = ''
	  }
  
	  if(errors.leaving){
		errors.minTime.message = ''
		errors.maxTime.message = ''
		errors.description.message = ''
	  }
  
	  if(errors.minTime){
		errors.maxTime.message = ''
		errors.description.message = ''
	  }

	  if(errors.maxTime){
		errors.description.message = ''
	  }

	let isDatesSelected = false;
	let isLeavingSelected = false;
	
	if(leavingDate){
		isLeavingSelected = true;
	}
	
	if(arrivalDate && leavingDate) {
		isDatesSelected = true
	}

	
	// console.log(currentUser)
	// console.log(useAuth)

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
					<h1>PUBLISH AN AD</h1>
					{/* <p id="subheader">Let's make new connections along the way!</p> */}
					<form
						onSubmit={handleSubmit(async (data,event) => {
							const response = await axios.post("http://localhost:5000/api/publish", {
								arrivingDateYear: parseInt(data.arriving.substring(0,4)),
								arrivingDateMonth: parseInt(data.arriving.substring(5,7)),
								arrivingDateDay: parseInt(data.arriving.substring(8,10)),
								leavingDateYear: parseInt(data.leaving.substring(0,4)),
								leavingDateMonth: parseInt(data.leaving.substring(5,7)),
								leavingDateDay: parseInt(data.leaving.substring(8,10)),
								city: cityVar,
								country: countryVar.name,
								user_email: currentUser.email,
								description: data.description,
								host: data.host,
								maxPeople: data.maxPeople,
								minTimeHour: parseInt(data.minTime.substring(0,2)),
								minTimeMinute: parseInt(data.minTime.substring(3,5)),
								maxTimeHour: parseInt(data.maxTime.substring(0,2)),
								maxTimeMinute: parseInt(data.maxTime.substring(3,5)),
								state: stateVar.name,
								userToProcess: currentUser
							});
							console.log(response);
							if(response.data === 'success'){
								window.location.assign('/myads')							
							}
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
									    //value={textInputState}
										//ref={stateRef}
										//onChange={(e) => setTextInputState(e.target.value)}
										autoComplete="off"
										placeholder="Type in State"
										disabled={!isFoundCountry}
										{...register("state", {required:'Please select a state'})}
										type="text"
										name="state"
										id="state"
										list="states"
									/>
									{(errors.state && !errors.country && isFoundCountry) ? <p style={{color:'red'}}>{errors.state.message}</p> : ''}
									<datalist name="states" id="states">
										{
											filteredStates.map((state, key) => (
												<option key={key} value={state.name}>
													{state.name}
												</option>
											))
										 }
										{/* {filteredStates.map((state, key) => (
											<option key={key} value={state.name}>
												{state.name}
											</option>
										))} */}
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
									<label id="host" htmlFor="host">
										I Can Host
									</label>
									<select {...register("host", { required: true })} name="host" id="host">
										{/* <option value={() => isHost === false ? changeHostStatus(isHost) : changeHostStatus(!isHost)}>Yes</option>
                            <option value={() => isHost === true ? changeHostStatus(isHost) : changeHostStatus(!isHost)}>No</option>  */}
										<option value={true}>Yes</option>
										<option selected value={false}>
											No
										</option>
									</select>
								</div>
								<div className="columnn">
									<label htmlFor="arriving">Available From:</label>
									<input
										
										min={todayDate}
										max={isLeavingSelected === false ? `${new Date().getFullYear() + 1}-${finalMonthToUse}-${day}` : leavingDate}
										{...register("arriving", { required: "You have to select an arrival date" })}
										name="arriving"
										id="arriving"
										type="date"
									/>
									{(errors.arriving && !errors.country && !errors.state && !errors.city && isFoundCountry && isFoundState && cityInput) ? <p style={{color:'red'}}>{errors.arriving.message}</p> : ''}
								</div>

								<div className="columnn">
									<label htmlFor="leaving">Available Until:</label>
									<input
									 min={`${arrivalDate}`}
									 {...register("leaving", { required: "You have to select a leaving date" })}
									 name="leaving"
									 type="date"
									/>
									{(errors.leaving && !errors.country && !errors.state && !errors.city && !errors.arriving && isFoundCountry && isFoundState && cityInput && arrivalDate) ? <p style={{color:'red'}}>{errors.leaving.message}</p> : ''}
								</div>
							</div>
							<div className="roww">
								<div className="columnn">
									<label id="people" htmlFor="maxPeople">
										For:
									</label>
									<select {...register("maxPeople", { required: true })} name="maxPeople" id="maxPeople">
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
										// min={finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10) ? minimumTime : ''}
                                        min={boolVarForMinTime ? minimumTime : ''}
										{...register("minTime", { required: 'Please choose your lower time range' })}
										name="minTime"
										id="minTime"
										type="time"
									/>
									{(errors.minTime && !errors.country && !errors.state && !errors.city && !errors.arriving && !errors.leaving && isFoundCountry && isFoundState && cityInput && arrivalDate && leavingDate) ? <p style={{color:'red'}}>{errors.minTime.message}</p> : ''}
								</div>
								

								<div className="columnn" id="maxTime">
									<label htmlFor="maxTime">To:</label>
									<input disabled={!isDatesSelected}
									  {...register("maxTime", { required: 'Please choose your upper time range' })}
									   name="maxTime"
									    id="maxTime"
										 type="time"
										  />
									{(errors.maxTime && !errors.country && !errors.state && !errors.city && !errors.arriving && !errors.leaving && !errors.minTime && isFoundCountry && isFoundState && cityInput && arrivalDate && leavingDate && minTime) ? <p style={{color:'red'}}>{errors.maxTime.message}</p> : ''}
								</div>
							</div>
							<div className="roww">
							<div className="columnn">
								<label htmlFor="description">Describe your guidance plan</label>
								<textarea
									name="description"
									{...register("description", { required: 'Please describe your plan of guidance' })}
									id="description"
									placeholder="Describe your guidance plan in detail here"
									rows="3"
								></textarea>
								{(errors.description && !errors.country && !errors.state && !errors.city && !errors.arriving && !errors.leaving && !errors.minTime && !errors.maxTime && isFoundCountry && isFoundState && cityInput && arrivalDate && leavingDate && minTime && maxTime) ? <p style={{color:'red'}}>{errors.description.message}</p> : ''}
							</div>
							<div id="buttonDiv" className="columnn submitButton">
								<button>Submit</button>
							</div>
						</div>
						</div>
						
						
					</form>
				</div>
			</div>
		</div>
	);
};

export default Publish;