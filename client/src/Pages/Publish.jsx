import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "../public/Publish.css";
import { Country, State, City } from "country-state-city";
import FormComponent from "../components/FormComponent";



const Publish = () => {

	const [countryVar, setCountryVar] = useState([])
	const [cityVar, setCityVar] = useState([])
	const [stateVar, setStateVar] = useState([])
	const [descriptionText, setDescriptionText] = useState('')
	const [canHost, setCanHost] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();


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
				stateNameSelected = state.name;
				chosenState = state;
				cities = City.getCitiesOfState(countryVar.isoCode, state.isoCode);
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
	let filteredStates = states.filter((state) => state.name.toLowerCase().startsWith(stateInput.toLowerCase()));
	let filteredCountries = Country.getAllCountries().filter((country) => country.name.toLowerCase().startsWith(countryInput.toLowerCase()));
    let finalFilteredCities = cities.filter((city) => city.countryCode === countryVar.isoCode && city.stateCode === stateVar.isoCode &&
      city.name.toLowerCase().startsWith(cityInput.toLowerCase()))

	let cityObject = {}
    finalFilteredCities.forEach((city)=> {
      if(city.name === cityInput) {
        cityObject = city;
      }
    })

	
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

	// let handleDescText = event => {
	// 	setDescriptionText(event.target.value);
	// 	console.log(event.target.value);
	// }
	// console.log("descriptionText state:",descriptionText);
	

	return (
		<FormComponent
		publishHost = {
			<div className="columnn">
				<label id="host" htmlFor="host">
		 			I Can Host
		 		</label>
		 		<select onClick={(e) => setCanHost(e.target.value)} {...register("host", { required: true })} name="host" id="host">
		 			<option value={true}>Yes</option>
					<option selected value={false}>No</option>
		 		</select>
		 	</div>
		}

		publishHostVal = {
			canHost
		}

		description = {
			<div className="columnn">
		 		<label htmlFor="description">Describe your guidance plan</label>
		 			<textarea
						onKeyUp={(e) => setDescriptionText(e.target.value)}
						// value={descriptionText}
		 				maxLength={600}
		 				minLength={200}
		 				name="description"
		 				{...register("description", { required: 'Please describe your plan of guidance' })}
		 				id="description"
		 				placeholder="Describe your guidance plan in detail here"
						rows="3"
		 			></textarea>
		 		{(errors.description && !errors.country && !errors.state && !errors.city && !errors.arriving && !errors.leaving && !errors.minTime && !errors.maxTime && isFoundCountry && isFoundState && cityInput && arrivalDate && leavingDate && minTime && maxTime) ? <p style={{color:'red'}}>{errors.description.message}</p> : ''}
		 	</div>
		}
		publishButton = {
			<div id="buttonDiv" className="columnn submitButton">
		 		<button>Submit</button>
			</div>
		}
		desc = {
			descriptionText
		}
		/>
	);
};

export default Publish;