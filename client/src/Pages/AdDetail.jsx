import React, { useEffect, useState, useLayoutEffect, useContext } from 'react'
import { useParams,Link,useNavigate } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import axios from "axios";
import '../public/AdDetail.css'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { faHourglass } from '@fortawesome/free-solid-svg-icons'
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import { faBed } from '@fortawesome/free-solid-svg-icons'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
// import { Button } from 'semantic-ui-react'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { async } from '@firebase/util';

const AdDetail = () => {
    const [theAd, setTheAd] = useState({});
    const [rating, setRating] = useState(4);
    const [loggedInUser,setLoggedInUser]=useState(null)
    const [buttonText, setButtonText] = useState('Apply')
    let navigate=useNavigate();

    let useAuth=useContext(AuthContext);
    let { id} = useParams();
    console.log('outside',id)

useLayoutEffect(() => {
    const getTheAd = async () => {
        console.log('inside',id)
        const response = await axios.get(`http://localhost:5000/api/ad/searchresult/${id}`, {
        });
        console.log("response.data of theAd",response.data)
         setTheAd(response.data)
    }
    if(id){
    getTheAd();
    }
}, [])


const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

let decideToPutZero = (num) => {
    if(num < 10){
      return '0'+num?.toString();
    } else {
      return num?.toString();
    }
  }

const getCurrentUserInfo=async()=>{   
  const response=await useAuth?.getCurrentUserInfo()
  // console.log("currentUser response",response)
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

let isAdActive = () => {
  let currentDate = new Date().toISOString().slice(0, 10);
  let currentYear = parseInt(currentDate.substring(0,4))
  let currentMonth = parseInt(currentDate.substring(5,7))
  let currentDay = parseInt(currentDate.substring(8,10))
  let currentHour = new Date().getHours();
  let currentMinute = new Date().getMinutes();

  if(theAd?.foundAd?.arriving_date_year > currentYear){
      return true;
  }

  if(theAd?.foundAd?.arriving_date_year === currentYear && theAd?.foundAd?.arriving_date_month > currentMonth){
      return true;
  }

  if(theAd?.foundAd?.arriving_date_year === currentYear && theAd?.foundAd?.arriving_date_month === currentMonth && theAd?.foundAd?.arriving_date_day > currentDay){
      return true;
  }
  
  if(theAd?.foundAd?.arriving_date_year === currentYear && theAd?.foundAd?.arriving_date_month === currentMonth && theAd?.foundAd?.arriving_date_day === currentDay && 
      theAd?.foundAd?.minTimeHour > currentHour) {
          return true;
      }

  if(theAd?.foundAd?.arriving_date_year === currentYear && theAd?.foundAd?.arriving_date_month === currentMonth && theAd?.foundAd?.arriving_date_day === currentDay && 
      theAd?.foundAd?.minTimeHour === currentHour && theAd?.foundAd?.minTimeMinute > currentMinute) {
          return true;
      }
      
      // setTheAd((prevState) =>({
      //   theAd?.foundAd: { ...prevState.theAd?.foundAd, [appliedUsers] : [] }
      // }))
      

  return false;
}
let valueOfIsAdActive = isAdActive();
console.log("value of isAdActive method",valueOfIsAdActive);  

 console.log("logged-in user:", loggedInUser);
let currentYear = new Date().getFullYear();

let acceptedUserRenderFunc = theAd?.foundAd?.acceptedUsers?.map((acceptedUsr)=> {
    return (<div className='acceptedUser'>
      <img
      
      onClick={()=>{navigate('/profile/'+acceptedUsr?._id)}}
        src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
        className="rounded-circle z-depth-0 avatar userAvatar"
        alt="avatar image"/>

        {loggedInUser?._id === theAd?.adOwner?._id ?
          <a onClick={async(e) => {e.preventDefault();
            const response = await axios.put(`http://localhost:5000/api/ad/searchresult/${theAd?.foundAd?._id}/${acceptedUsr._id}/decline`, {
            });
            response.data !== "User has already been rejected for this ad." ?     
                  setTheAd(response.data) : ''
                  console.log(response.data)
        }} href="#" ><i className='fa fa-ban fa-xs' style={{marginBottom:'3.5em', color:'red', fontSize:'1.2rem', marginLeft:'-.8em'}} />
        </a>
        : ''}
          <div><Link to={'/profile/'+acceptedUsr?._id} className='acceptedUserName' ><b>{acceptedUsr?.user_ID}</b></Link></div>
          <p className='acceptedUserStar' ><i className='fa fa-star fa-xs'/> 4,9/5</p>
    </div>
    )
})

let currentlyUnacceptedAppliedUsers = theAd?.foundAd?.appliedUsers?.filter((usr) => !theAd?.foundAd?.acceptedUsers.includes(usr))
console.log("currentlyUnacceptedAppliedUsers var:", currentlyUnacceptedAppliedUsers);

let appliedUserRenderFunc = theAd?.foundAd?.appliedUsers?.map((appliedUsr) => {
  
  return ( valueOfIsAdActive ?
    <>
    <img
   src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
   className="rounded-circle z-depth-0 avatar appliedUserAvatar"
   alt="avatar image"/>
   
           <div className='sideBarAppliedContent'>
           <div>
           <a onClick={async(e) => {e.preventDefault();
            const response = await axios.put(`http://localhost:5000/api/ad/searchresult/${theAd?.foundAd?._id}/${appliedUsr._id}/decline`, {
            });
            response.data !== "User has already been rejected for this ad." ?     
                  setTheAd(response.data) : ''
                  console.log(response.data)
          }} href="#"><FontAwesomeIcon style={{color:'red', marginRight:'.75em'}} size='xl' icon={faXmark} /></a>
           <a onClick={async(e) => {e.preventDefault();
              const response = await axios.put(`http://localhost:5000/api/ad/searchresult/${theAd?.foundAd?._id}/${appliedUsr._id}/accept`, {
              });
              response.data !== "User has already been accepted for this ad or can't apply for this ad." ?
                  
                  setTheAd(response.data) : ''
                  // theAd?.foundAd?.appliedUsers?.filter((usr) => usr._id !== appliedUsr._id)
                  console.log(response.data)
            }} href="#"><FontAwesomeIcon size='xl' style={{color:'blue'}} icon={faCheck} /></a>
            </div>
           <Link to={'/profile/'+appliedUsr?._id} style={{textDecoration:'none'}} className="sideBar-title h2">{appliedUsr?.user_ID}</Link>
           <p>{`Name: ${appliedUsr?.user_name}`}</p>
           <p>{`Surname: ${appliedUsr?.user_surname}`}</p>
           <p>{`Gender: ${appliedUsr?.user_gender}`}</p>
           <p>{`Age: ${currentYear - parseInt(appliedUsr?.user_date_of_birth?.substring(0,4))}`}</p>
           <p><FontAwesomeIcon style={{fontSize:'1.5em', marginBottom:'.1em'}} icon={faStar} size="lg" /> <span style={{fontSize:'1.3em'}}>4,9/5</span></p>
           {loggedInUser?._id !== theAd?.adOwner?._id ? '' : 
             <div>
               <Button style={{marginBottom:'1em'}} onClick={()=>
                 makeConversationAndRedirect(appliedUsr?._id)} variant="contained" endIcon={<SendIcon />}>
                   Send
               </Button>
             </div>
           }
          
           
         </div>
         </>
         : <div></div>
  )
 
})
let borderRadiusConditionalStyle = {};
let decidingOfAppliedUserRenderFunc = loggedInUser?._id === theAd?.adOwner?._id && theAd?.foundAd?.appliedUsers.length > 0 && valueOfIsAdActive;
if(!decidingOfAppliedUserRenderFunc){
  borderRadiusConditionalStyle = {borderRadius: '15px 0px 0px 15px;'};
}
else {
  borderRadiusConditionalStyle = {}
}


console.log("theAd state var:",theAd)

let applyButtonDisplayCondition = true;
if(theAd?.foundAd?.bannedUsers?.some(item => item?._id === loggedInUser?._id) || theAd?.foundAd?.acceptedUsers?.some(item => item?._id === loggedInUser?._id)){
  applyButtonDisplayCondition = false;
}

  return ( theAd?.foundAd ?
      <>
     
     <div  className='outerContainer'>
     
      {decidingOfAppliedUserRenderFunc ?
          <aside class="sideBarAppliedInfo">
          {appliedUserRenderFunc}
          </aside>
             : ''}
            

         <div style={{borderRadius: decidingOfAppliedUserRenderFunc === false ? '15px 0px 0px 15px' : ''}} className='innerContainer'>
        
        <div className='imageHeaderDescContainer'>
        <h2 className='adDetailHeader'>{`${theAd?.adOwner?.user_ID}'s ${theAd?.foundAd?.city} Tour!`}</h2>
        <div className='containerToHoldImageAndText'>
        <img  className='imgBorder' height="250" width="250" src="https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
        {/* <p>{theAd?.foundAd?.description}</p> */}
        <p className='descText'>{theAd?.foundAd?.description}</p>
        </div>
        <div style={{justifyContent:'space-between'}} className='dateAndTimeDivInAdDetail'>
            <p><FontAwesomeIcon style={{marginRight:'.5em'}} icon={faLocationDot} />{`${theAd?.foundAd?.city}`}</p>
            {/* <p><FontAwesomeIcon style={{marginRight:'.5em'}} icon={faLocationDot} />{`State: ${theAd?.foundAd?.state}`}</p>
            <p><FontAwesomeIcon style={{marginRight:'.5em'}} icon={faLocationDot} />{`City: ${theAd?.foundAd?.city}`}</p> */}
            <p><FontAwesomeIcon style={{marginRight:'.5em'}} icon={faPeopleGroup} />{`Max People: ${theAd?.foundAd?.maxPeople}`}</p>
            <p><FontAwesomeIcon style={{marginRight:'.5em'}} icon={faBed} />Host: {theAd?.foundAd?.host === "true" ? 'Available' : 'Not Available'}</p>
            <p><FontAwesomeIcon style={{marginRight:'.5em'}} icon={faHourglass} />{`${decideToPutZero(theAd?.foundAd?.minTimeHour)}:${decideToPutZero(theAd?.foundAd?.minTimeMinute)} -  ${decideToPutZero(theAd?.foundAd?.maxTimeHour)}:${decideToPutZero(theAd?.foundAd?.maxTimeMinute)}`}</p>
            <p><FontAwesomeIcon style={{marginRight:'.5em'}} icon={faCalendarDays} />{`${theAd?.foundAd?.arriving_date_day?.toString()} ${months[theAd?.foundAd?.arriving_date_month-1]} - ${theAd?.foundAd?.leaving_date_day?.toString()} ${months[theAd?.foundAd?.leaving_date_month-1]}`}</p>
            {/* <p style={{marginRight:'3em'}} id='timeTextInAdDetail'>{`From:  ${decideToPutZero(theAd?.foundAd?.minTimeHour)}:${decideToPutZero(theAd?.foundAd?.minTimeMinute)} - To: ${decideToPutZero(theAd?.foundAd?.maxTimeHour)}:${decideToPutZero(theAd?.foundAd?.maxTimeMinute)}`}</p> */}
        </div>
        <hr style={{marginTop:'3em'}} />

        <div className='acceptedUserContainer'>
            {acceptedUserRenderFunc}
   
        </div>

        </div>
         </div>

         <aside class="sideBarInfo">
         <img    onClick={()=>{navigate('/profile/'+theAd?.adOwner?._id)}}
				src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
				className="rounded-circle z-depth-0 avatar OwnerAvatar"
				alt="avatar image"/>
                <div className='sideBarContent'>
                <Link to={`/profile/${theAd?.adOwner?._id}`} style={{textDecoration:'none'}} className="sideBar-title h2">{theAd?.adOwner?.user_ID}</Link>
                <p>{`Name: ${theAd?.adOwner?.user_name}`}</p>
                <p>{`Surname: ${theAd?.adOwner?.user_surname}`}</p>
                <p>{`Gender: ${theAd?.adOwner?.user_gender}`}</p>
                <p style={{marginBottom:'1.5em'}}>{`Age: ${currentYear - parseInt(theAd?.adOwner?.user_date_of_birth?.substring(0,4))}`}</p>
                <p><FontAwesomeIcon style={{fontSize:'3em', marginBottom:'.1em'}} icon={faStar} size="2xl" /> <span style={{fontSize:'2em'}}>4,9/5</span></p>
                {loggedInUser?._id === theAd?.adOwner?._id ? '' : 
                  <div>
                    <Button style={{marginBottom:'1em', marginTop:'.5em'}} onClick={()=>makeConversationAndRedirect(theAd?.adOwner?._id)} variant="contained" endIcon={<SendIcon />}>
                        Send
                    </Button>
                  </div>
                }
                {loggedInUser?._id === theAd?.adOwner?._id && valueOfIsAdActive ?
                  <div onClick={async(e) => {e.preventDefault();
                    const response = await axios.delete(`http://localhost:5000/api/ad/mypastads/${theAd?.foundAd?._id}`, {
                      headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                    }) 
                    if(response.data.message === 'ad has been deleted'){
                      console.log(response.data.message)
                      console.log(response.data)
                      setTheAd(response.data) 
                      window.location.assign(`/profile/${response.data.adOwner._id}`)
                    }
                  
                  }}>
                 <button className='btn btn-danger btn-lg'>Cancel Ad</button>
                 </div> : ''
                 }

                {loggedInUser?._id !== theAd?.adOwner?._id && applyButtonDisplayCondition ?  
                  <div onClick={async(e) => {e.preventDefault();
                    const response = await axios.post(`http://localhost:5000/api/ad/searchresult/${theAd?.foundAd?._id}/${loggedInUser._id}`, {
                  });
                  response.data !== "User has already applied for this ad or can't apply for this ad." ?
                  setTheAd(response.data) : ''
                  console.log(response.data)
                  setButtonText('Pending')
                  
                  }}>
                    <Button style={{width:'7em'}} variant="contained" color="success">{buttonText}</Button>
                  </div>
                  : ''
                }
               
              </div>
            </aside>
     </div>
    </>
    : <> <h1>The Ad Can not be found, probably deleted</h1></>
  )
}

export default AdDetail