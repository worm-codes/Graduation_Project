import React, {  useEffect, useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from "../components/Navbar";
import axios from "axios";
import '../public/AdDetail.css'

const AdDetail = () => {
    const [theAd, setTheAd] = useState({});
    let { ID } = useParams();
useLayoutEffect(() => {
    const getTheAd = async () => {
        const response = await axios.get(`http://localhost:5000/api/ad/searchresult/${ID}`, {
        });
        console.log(response.data)
         setTheAd(response.data)
    }
    getTheAd();
}, [])

// useEffect(() => {
//     const timer = setTimeout(() => {
//       console.log('This will run after 1 second!')
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, []);

console.log("theAd state var:",theAd)
  return (
      <>
      {/* <Navbar/> */}
      
     {/* <div>{`${theAd.adOwner.user_ID}'s ${theAd.foundAd.city} Tour!`}</div> */}
     
     <div className='outerContainer'>
         <div className='innerContainer'>
        <h3 className='adDetailHeader'>{`${theAd?.adOwner?.user_ID}'s ${theAd?.foundAd?.city} Tour!`}</h3>
        <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad in quaerat, libero quidem tenetur fugiat architecto maiores perspiciatis unde, ab expedita quisquam dolores labore! Sequi architecto ipsam ad necessitatibus commodi.</div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat nemo nihil vel, magni sed porro. Molestiae nihil culpa nobis odio omnis eveniet temporibus, quaerat maiores voluptate. Tempora obcaecati dolorum itaque.</p>
         </div>
     </div>
    </>
  )
}

export default AdDetail