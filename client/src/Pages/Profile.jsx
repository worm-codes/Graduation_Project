
import '../public/profile.css'
import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router';
import { AuthContext } from "../context/AuthContext";

import axios from "axios";
import AdComponent from '../components/AdComponent';

const Profile = () => {

   
const { currentUser } = useContext(AuthContext);
const [user,setUser]=useState(null)
const {id}=useParams()
    let useAuth=useContext(AuthContext)
    const getCurrentUserInfo=async()=>{
       
    const response=await axios.get('http://localhost:5000/api/getUser/'+id,{
          headers:{Authorization: 'Bearer ' + await currentUser?.getIdToken(true)}
        })
    setUser(response.data)
            
  }

    const [adArrState, setAdArrState] = useState([])
    const[showActive,setShowActive]=useState(true)
    const [activeAdsArr, setActiveAdsArr] = useState([])
    const [disabledAdsArr, setDisabledAdArr] = useState([])

  

    useEffect(()=> {
      setAdArrState([])
      getCurrentUserInfo()
    }, [])
    useEffect(() => {
        const getAds = async () => {
            const response = await axios.get(`http://localhost:5000/api/ad/myads`,{
                headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
              }) 
              setAdArrState(response.data[0])
              setActiveAdsArr(response.data[0].filter((ad) => ad.isActive === true));
              setDisabledAdArr(response.data[0].filter((ad) => ad.isActive === false));
               
        } 
        getAds();
    }, [])

   

    let image=['https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1096&q=80',
'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
'https://images.unsplash.com/photo-1557745133-ee31592739cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80']
  const [pickedImage,setPickedImage]=useState(0);

  useEffect(()=>{ /*state e atama yapmak icin useffect kullanmayi unutmaa !!!!! */
setPickedImage(Math.floor(Math.random() * image.length))

},[])


return  activeAdsArr && disabledAdsArr?(
    <div className="container">
   <div className="row">
      <div className="col-md-12">
         <div id="content" className="content content-full-width">
           
            <div className="profile">
               <div className="profile-header mt-2">
             
                  <div  style={{ backgroundImage: 'url('+image[pickedImage]+')'}} className="profile-header-cover"></div>
                
                
                  <div className="profile-header-content">
                   
                     <div className="profile-header-img">
                        <img src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png" alt=""/>
                     </div>
                   
                
                     <div className="profile-header-info">
                        <h3 className="m-t-10 m-b-5"><b>{user?.user_ID}</b></h3>
                        <p className="m-b-10 "><b>Name: {user?.user_name} {user?.user_surname}</b></p>
                        <p className="m-b-5"><b>Age:{new Date().getFullYear() - user?.user_date_of_birth.substring(0,4)} </b></p>
                        <p className="m-b-10 "><b>Gender: {user?.user_gender}</b></p>
                        
                        <a href="#" className="btn btn-sm btn-info mb-2">Edit Profile</a>
                     </div>
                   
                  </div>
                
                  <ul className="profile-header-tab nav nav-tabs">
                     <li className="nav-item"><a href="#profile-post" onClick={()=>setShowActive(true)} className="nav-link active show" data-toggle="tab">Active Ads</a></li>
                     <li className="nav-item"><a href="#profile-about"onClick={()=>setShowActive(false)} className="nav-link" data-toggle="tab">Past Ads</a></li>
                     
                  </ul>
                 
               </div>
            </div>
          
            <div className="profile-content">
            
               <div className="tab-content p-0">
                  
                  <div className="tab-pane fade active show" id="profile-post">
                     <ul className="timeline"> 
                        
                         <AdComponent disabledAdsArr={disabledAdsArr} activeAdsArr={activeAdsArr} user={user} showActive={showActive} />
                        
                     </ul>
                     
                  </div>
                  
               </div>
               
            </div> 

 
         </div>
      </div>
   </div>
</div>
  ) :''
}

export default Profile