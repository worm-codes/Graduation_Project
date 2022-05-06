import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'
import { AuthContext } from "../context/AuthContext";
// import { Link, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form'
import axios from "axios";
import Navbar from "./Navbar";
import { Country, State, City }  from 'country-state-city';
import "../public/SearchResult.css";


const SearchResult = () => {

    let useAuth=useContext(AuthContext)
  
    const [filteredAdState, setFilteredAdState] = useState([])
    const {
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

    let countryInput = watch().country ? watch().country : '';
    let stateInput = watch().state ? watch().state : '';
    let cityInput = watch().city ? watch().city : "";

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
    console.log(filteredAdState.length)

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
									{/* {(errors.state && !errors.country && isFoundCountry) ? <p style={{color:'red'}}>{errors.state.message}</p>  : ''} */}
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
            </form>
        </aside>

                                         
        <section className='query-results'>
        {filteredAdState.map((ad,key) => (
            <div className='query-content'>
                <h2>{`${ad.state} - ${ad.country}`}</h2>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp6wPN6-0GRdNKIvLrdx4aVJP-X_QcPy5tjQ&usqp=CAU" alt="" />
                <p>{ad.description}</p>
            </div>
        ))}
            
        </section>
        </main>
    </>
  )
}

export default SearchResult