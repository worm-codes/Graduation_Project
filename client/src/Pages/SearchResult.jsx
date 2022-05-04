import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'
import { AuthContext } from "../context/AuthContext";
// import { Link, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form'
import axios from "axios";
import Navbar from "./Navbar";

const SearchResult = () => {

    // const { currentUser } = useContext(AuthContext);
    let useAuth=useContext(AuthContext)
    //const [adsArrState, setAdsArrState] = useState([])
    // const [filteredAdsState, setFilteredAdsState] = useState([])
    const [filteredAdState, setFilteredAdState] = useState([])
    const { handleSubmit } = useForm();
    // const { id } = useParams();
    let generalData = []
    //setAdArrState([])
    // useEffect(()=> {
    //   setFilteredAdState([])
    // }, [])

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

    
    //setAdArrState([])
 {/* <form onSubmit={handleSubmit(async (data) => {
                      const changedAd = await axios.put(`http://localhost:5000/api/myads`,  {adID: ad._id})  
                  })}>
                      
                  </form> */}
  return (
    <>
        <div>
            <Navbar/>
        <div className="table-responsive">
            <table className="table table hover">
            <thead className='thead-dark'>
    <tr>
      <th scope="col">#</th>
     
      <th scope='col'>Arriving Date</th>
      <th scope="col">Country</th>
      <th scope="col">State</th>
      <th scope="col">City</th>
      <th scope="col">Apply</th>
    </tr>
  </thead>
  <tbody>        
          {/* <tr key={1}>
              <th scope='row'>{1}</th>
              <td>{filteredAdState.arriving_date}</td>
              <td>{filteredAdState.country}</td>
              <td>{filteredAdState.state}</td>
              <td>{filteredAdState.city}</td>
              <td>   
                  <button className='btn btn-success'>Apply</button>
              </td>
          </tr>  */}
          {filteredAdState.map((ad,key) => (
        
        <tr key={key}>
            <th scope='row'>{key+1}</th>
            <td>{`${ad.arriving_date_day}/${ad.arriving_date_month}/${ad.arriving_date_year}`}</td>
            <td>{ad.country}</td>
            <td>{ad.state}</td>
            <td>{ad.city}</td>
            <td>  
                <button className='btn btn-success'>Apply</button>
            </td>
        </tr>
    ))}
  </tbody>

            </table>
        </div> 
        {/* <p>{filteredAdState[0].city}</p>
        <p>{filteredAdState[0].owner_age}</p> */}
        </div>
    </>
  )
}


export default SearchResult