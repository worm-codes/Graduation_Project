import React, {  useEffect, useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from "../components/Navbar";
import axios from "axios";
import '../public/AdDetail.css'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const AdDetail = () => {
    const [theAd, setTheAd] = useState({});
    const [rating, setRating] = useState(4);
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

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

let decideToPutZero = (num) => {
    if(num < 10){
      return '0'+num.toString();
    } else {
      return num.toString();
    }
  }

let currentYear = new Date().getFullYear();

console.log("theAd state var:",theAd)
  return (
      <>
      {/* <Navbar/> */}
      
     {/* <div>{`${theAd.adOwner.user_ID}'s ${theAd.foundAd.city} Tour!`}</div> */}
     
     <div className='outerContainer'>
         <div className='innerContainer'>
        
        <div className='imageHeaderDescContainer'>
        <h2 className='adDetailHeader'>{`${theAd?.adOwner?.user_ID}'s ${theAd?.foundAd?.city} Tour!`}</h2>
        <div className='containerToHoldImageAndText'>
        <img  className='imgBorder' height="250" width="250" src="https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
        {/* <p>{theAd?.foundAd?.description}</p> */}
        <p className='descText'>naberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlannaberlan</p>
        </div>
        <div style={{justifyContent:'space-between'}} className='dateAndTimeDivInAdDetail'>
            <p>{theAd?.foundAd?.city}</p>
            <p>{`Date: ${theAd?.foundAd?.arriving_date_day.toString()} ${months[theAd?.foundAd?.arriving_date_month-1]} - ${theAd?.foundAd?.leaving_date_day.toString()} ${months[theAd?.foundAd?.leaving_date_month-1]}`}</p>
            {/* <p style={{marginRight:'3em'}} id='timeTextInAdDetail'>{`From:  ${decideToPutZero(theAd?.foundAd?.minTimeHour)}:${decideToPutZero(theAd?.foundAd?.minTimeMinute)} - To: ${decideToPutZero(theAd?.foundAd?.maxTimeHour)}:${decideToPutZero(theAd?.foundAd?.maxTimeMinute)}`}</p> */}
        </div>
        
        
        </div>
         </div>
         <aside class="sideBarInfo">
         <img
				src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
				style={{ width: "5rem", height: "5rem", marginLeft:'1em' }}
				className="rounded-circle z-depth-0 avatar"
				alt="avatar image"/>

                <h2 class="sideBar-title">{theAd?.adOwner?.user_name}</h2>
                <p>{`Name: ${theAd?.adOwner?.user_name}`}</p>
                <p>{`Surname: ${theAd?.adOwner?.user_surname}`}</p>
                <p>{`Gender: ${theAd?.adOwner?.user_gender}`}</p>
                <p>{`Age: ${currentYear - parseInt(theAd?.adOwner?.user_date_of_birth.substring(0,4))}`}</p>

                <h2 class="sideBar-title">Quality</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                <Typography component="legend">{`${theAd?.adOwner?.user_name}'s Rating`}</Typography>
                <Rating name="read-only" value={rating} readOnly />
                <div class="button" onclick="void(0);">
                    <span>Message</span>
                    <svg width="180px" height="60px" viewBox="0 0 180 60" class="border">
                        <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
                        <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
                    </svg> 
                </div>
            </aside>
     </div>
    </>
  )
}

export default AdDetail