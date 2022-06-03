import React, { useEffect, useState, useLayoutEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import axios from "axios";
import '../public/AdDetail.css'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'semantic-ui-react'

const AdDetail = () => {
    const [theAd, setTheAd] = useState({});
    const [rating, setRating] = useState(4);
    const [loggedInUser,setLoggedInUser]=useState(null)
    let useAuth=useContext(AuthContext);
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

const getCurrentUserInfo=async()=>{   
  const response=await useAuth?.getCurrentUserInfo()
    if(response){
    setLoggedInUser(response)
    }            
  }

  const makeConversationAndRedirect=async(id)=>{
    const response=await axios.post(`http://localhost:5000/api/conversation/`,{
                     senderId:loggedInUser._id,
                     receiverId:id
    },{
                       headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                     }
                     
                     )
                     console.log(response.data)
                     if(response.data.message!='UnAuth'){
                      window.location.href='/messenger'
                     }
 }

useEffect(() => {
  getCurrentUserInfo();
}, [])

console.log("logged-in user:", loggedInUser);
let currentYear = new Date().getFullYear();

console.log("theAd state var:",theAd)
  return (
      <>
     
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
                <p style={{marginBottom:'1.5em'}}>{`Age: ${currentYear - parseInt(theAd?.adOwner?.user_date_of_birth.substring(0,4))}`}</p>
                <p><FontAwesomeIcon icon={faStar} size="lg" /> 4,9/5</p>
                {loggedInUser?._id === theAd?.adOwner?._id ? '' : 
                  <div>
                    <button onClick={()=>makeConversationAndRedirect(theAd?.adOwner?._id)} style={{marginBottom:'1em', marginTop:'.5em'}} type="button" class="btn btn-info">Contact</button>                
                  </div>
                }
               

                <h2 class="sideBar-title">Quality</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                {/* <Typography component="legend">{`${theAd?.adOwner?.user_name}'s Rating`}</Typography>
                <Rating name="read-only" value={rating} readOnly /> */}
                
                {/* <div class="button" onclick="void(0);">
                    <span>Message</span>
                    <svg width="180px" height="60px" viewBox="0 0 180 60" class="border">
                        <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
                        <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
                    </svg> 
                </div> */}

            </aside>
     </div>
    </>
  )
}

export default AdDetail