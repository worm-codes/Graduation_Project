import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "../public/Publish.css";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import Navbar from "./Navbar";

const Publish = () => {
	// const [isHost, setIsHost] = useState(false)
	const { currentUser } = useContext(AuthContext);
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();
	//currentUserAge = new Date().getFullYear() - currentUser.user_date_of_birth.substring(0,4);
	console.log(currentUser);

	let countryInput = watch().country ? watch().country : "";
	let stateInput = watch().state ? watch().state : "";
	let cityInput = watch().city ? watch().city : "";
	let arrivalDate = watch().arriving ? watch().arriving : "";
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

	Country.getAllCountries().forEach((country) => {
		if (country.name === countryInput) {
			isFoundCountry = true;
			states = State.getStatesOfCountry(country.isoCode);
		}
	});

	let stateNameSelected = "";
	let chosenState = {};
	let chosenStateArr = [];

	states.forEach((state) => {
		if (state.name === stateInput) {
			isFoundState = true;
			stateNameSelected = state.name;
			chosenState = state;
			chosenStateArr = Object.values(chosenState);
		}
	});

	let dateToCheck = new Date();
	let year = dateToCheck.getFullYear();
	let month = dateToCheck.getMonth();
	let day = '0'+dateToCheck.getDate().toString();
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

	let dateStringToPass = `${year}-${finalMonthToUse}-${day} ${hour}:${minutes}`;
    // console.log("arrival date day",arrivalDate.substring(8,10))
    // console.log(typeof finalMonthToUse);
    let boolVarForMinTime = false;
    // finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10)
    //boolVarForMinTime = finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10)
    if(finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10)){
        boolVarForMinTime = true;
    }
     console.log(boolVarForMinTime)
    // console.log(day)
    // console.log(arrivalDate.substring(8,10))


	let selectedStatesIsoCode = chosenStateArr[1];
	let selectedStatesCountryCode = chosenStateArr[2];
	let filteredStates = states.filter((state) => state.name.startsWith(stateInput));
	let filteredCountries = Country.getAllCountries().filter((country) => country.name.startsWith(countryInput));
	let filteredCities = City.getCitiesOfState(selectedStatesCountryCode, selectedStatesIsoCode).filter((city) =>
		city.name.startsWith(cityInput)
	);

	// useEffect(()=> {

	// }, [isHost])
	// let changeHostStatus = (host) => {
	// 	setIsHost(!host);
	// };

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
					<p>Let's make new connections along the way!</p>
					<form
						onSubmit={handleSubmit(async (data) => {
							// let readyData = Object.assign(data,HostData)
							const response = await axios.post("http://localhost:5000/api/publish", {
								arriving: data.arriving,
								city: data.city,
								country: data.country,
								// user_gender:currentUser.user_gender,
								user_email: currentUser.email,
								// user_date_of_birth:currentUser.user_date_of_birth,
								// user_objID:currentUser._id,
								// user_age: currentUserAge,
								description: data.description,
								host: data.host,
								leaving: data.leaving,
								maxPeople: data.maxPeople,
								minTime: data.minTime,
								maxTime: data.maxTime,
								state: data.state,
								userToProcess: currentUser,
							});
							console.log(response);
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
									<label htmlFor="arriving">Arriving in:</label>
									<input
										min={todayDate}
										max={`${new Date().getFullYear() + 1}-${finalMonthToUse}-${day}`}
										{...register("arriving", { required: "You have to select an arrival date" })}
										name="arriving"
										id="arriving"
										type="date"
									/>
								</div>

								<div className="columnn">
									<label htmlFor="leaving">Leaving in:</label>
									<input min={`${arrivalDate}`} {...register("leaving", { required: true })} name="leaving" type="date" />
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
										// min={finalMonthToUse === arrivalDate.substring(5,7) && day === arrivalDate.substring(8,10) ? minimumTime : ''}
                                        min={boolVarForMinTime ? minimumTime : ''}
										{...register("minTime", { required: true })}
										name="minTime"
										id="minTime"
										type="time"
									/>
								</div>

								<div className="columnn" id="maxTime">
									<label htmlFor="maxTime">To:</label>
									<input {...register("maxTime", { required: true })} name="maxTime" id="maxTime" type="time" />
								</div>
							</div>
						</div>
						<div className="roww">
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
						</div>
						<button>Submit</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Publish;