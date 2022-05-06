import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'
import { AuthContext } from "../context/AuthContext";
// import { Link, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form'
import axios from "axios";
import Navbar from "./Navbar";
import { Country, State, City }  from 'country-state-city';

const SearchResult = () => {

    let useAuth=useContext(AuthContext)
  
    const [filteredAdState, setFilteredAdState] = useState([])
    const { handleSubmit, watch } = useForm();

    let countryInput = watch().country ? watch().country : '';
    let stateInput = watch().state ? watch().state : '';

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

    

   let filteredCountries = Country.getAllCountries().filter(country => country.name.startsWith(countryInput));

  return (
    <>
        <Navbar/>
        <aside>
            <form onSubmit={handleSubmit(async (data) => {

            })}>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="country"><b>Country</b></label>
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

                    </div>
                </div>
            </form>
        </aside>
    </>
  )
}

export default SearchResult