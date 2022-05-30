import React, {  useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdDetailContext } from "../context/AdDetailContext";
import Navbar from "./Navbar";
import axios from "axios";

const AdDetail = () => {
    const [theAd, setTheAd] = useState([]);
    // const { advertisement, setAdvertisement, adOwner, setAdOwner } = useContext(AdDetailContext)
    let { ID } = useParams();
useEffect(() => {
    const getTheAd = async () => {
        const response = await axios.get(`http://localhost:5000/api/searchresult/${ID}`, {
        });
        console.log(response.data)
         setTheAd(response.data)
    }
    getTheAd();
}, [])


  return (
      <>
      <Navbar/>
      
     <div>{`${theAd.adOwner.user_ID}'s ${theAd.foundAd.city} Tour!`}</div>
     {/* <div className='outerContainer'>
         <div className='innerContainer'>
        <h2>{advertisement.city} Tour</h2>
         </div>
     </div> */}
    </>
  )
}

export default AdDetail