
import '../public/profile.css'
import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router';
import { AuthContext } from "../context/AuthContext";

import axios from "axios";

const Profile = () => {

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  // console.log("countryInput var:", countryInput);
  // console.log("countryVar state:",countryVar);

  // Function for adding 0 in front of hours & minutes that are 0 - 9.
  let decideToPutZero = (num) => {
    if(num < 10){
      return '0'+num?.toString();
    } else {
      return num?.toString();
    }
  }
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

    // const [inActiveAdsArr, setInActiveAdsArr] = useState([])
    // const { id } = useParams();
    let generalData = []
    //setAdArrState([])
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
    console.log(adArrState)
    
    // let allAds = [];
    // for(let i = 0; i < adArrState.length; i++){
    //     allAds.push(adArrState[i]);
    // }
    // console.log("allAds var:", allAds);
    // let acTiveAdsArr = adArrState.filter((ads) => ads.isActive === true);
    // let inActiveAdsArr = adArrState.filter((ad) => ad.isActive === false);
    console.log("active ads:", activeAdsArr);
    
    // console.log(activeAdsArr[1].isDateActive)







    let image=['https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1096&q=80',
'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
'https://images.unsplash.com/photo-1557745133-ee31592739cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80']
  const [pickedImage,setPickedImage]=useState(0);

  useEffect(()=>{ /*state e atama yapmak icin useffect kullanmayi unutmaa !!!!! */
setPickedImage(Math.floor(Math.random() * image.length))



},[])

const printProvince=(ad)=>{
    let removedProvince=''
    if(ad?.state?.includes('Province')){
        
      removedProvince=ad?.state?.replace('Province','')
      
    
      if(removedProvince.includes(ad?.city)||ad?.city.includes(removedProvince)){
         
          return ad?.city
      }
      else{
        return `${removedProvince}-${ad?.city}`
      }
    }
    
    
    else if (removedProvince===''){
          console.log('entered elsse if');
        return `${ad?.state}-${ad?.city}`
    }
    

}
const showActiveAds=activeAdsArr.map((activeAd)=>{
return (
     <li>
                              
                           <div className="timeline-time">
                              <span className="date">{activeAd?.arriving_date_day?.toString()} {months[activeAd?.arriving_date_month-1]} - {activeAd?.leaving_date_day?.toString()} {months[activeAd?.leaving_date_month-1]}</span>
                              <span className="time">{decideToPutZero(activeAd?.minTimeHour)}:{decideToPutZero(activeAd?.minTimeMinute)} - {decideToPutZero(activeAd?.maxTimeHour)}:{decideToPutZero(activeAd?.maxTimeMinute)}</span>
                           </div>
                          
                          
                           <div className="timeline-icon">
                              <a style={{ pointerEvents: 'none',cursor: 'default'}}>&nbsp;</a>
                           </div>
                         
                          
                           <div className="timeline-body">
                              <div className="timeline-header">
                                 <span className="userimage">
                                 <img src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png" alt=""/></span>
                                 <span className="username">{user?.user_name} {user?.user_surname}</span>
                                 <span className="pull-right text-muted">{/*views */}</span>
                              </div>
                              <div className="timeline-content">
                                 <p className="lead">
                                    <i className="fa fa-quote-left fa-fw pull-left"></i>
                                    <img className='imgBorder' height="200" width="200" src="https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
                                        <div style={{marginLeft:'1.5em'}}>
                                       <p><i class="fa fa-map-marker mr-2" style={{marginTop:'20px'}} aria-hidden="true"></i>{printProvince(activeAd)}</p>
                                       <p><i class="fa-solid fa-people-group mr-2"></i>MaxPeople: {activeAd.maxPeople}</p>
                                       <p><i class="fa-solid fa-bed mr-2"></i>{activeAd.host==='true'? Avaliable:'Not Avaliable'}</p>
                                    </div>
                                    <i className="fa fa-quote-right fa-fw pull-right"></i>
                                 </p>
                              </div>
                              <div className="timeline-footer">
                                { /*<a href="javascript:;" className="m-r-15 text-inverse-lighter"><i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i> Like</a>*/}
                                    <a href="#" className="m-r-15 text-inverse-lighter"><i className="fa fa-share fa-fw fa-lg m-r-3"></i> Go to Ad</a>
                                
                                 
                              </div>
                           </div>
                          
                        </li>
)
})
   

const showDisabledAds=disabledAdsArr.map((disabledAd)=>{
    return   <li>
                              
                           <div className="timeline-time">
                              <span className="date">{disabledAd?.arriving_date_day?.toString()} {months[disabledAd?.arriving_date_month-1]} - {disabledAd?.leaving_date_day?.toString()} {months[disabledAd?.leaving_date_month-1]}</span>
                              <span className="time">{decideToPutZero(disabledAd?.minTimeHour)}:{decideToPutZero(disabledAd?.minTimeMinute)} - {decideToPutZero(disabledAd?.maxTimeHour)}:{decideToPutZero(disabledAd?.maxTimeMinute)}</span>
                           </div>
                          
                          
                           <div className="timeline-icon">
                              <a style={{ pointerEvents: 'none',cursor: 'default'}}>&nbsp;</a>
                           </div>
                         
                          
                           <div className="timeline-body">
                              <div className="timeline-header"> 
                                 <span className="userimage">
                                 <img src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png" alt=""/></span>
                                 <span className="username">{user?.user_name} {user?.user_surname}</span>
                                 <span className="pull-right text-muted">{/*views */}</span>
                              </div>
                              <div className="timeline-content">
                                 <p className="lead">
                                    <i className="fa fa-quote-left fa-fw pull-left"></i>
                                    <img className='imgBorder' height="200" width="200" src="https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
                                     <div style={{marginLeft:'1.5em'}}>
                                    <p><i class="fa fa-map-marker mr-2 " style={{marginTop:'20px'}} aria-hidden="true"></i>{printProvince(disabledAd)}</p>
                                       <p><i class="fa-solid fa-people-group mr-2"></i>MaxPeople: {disabledAd.maxPeople}</p>
                                       <p><i class="fa-solid fa-bed mr-2"></i>{disabledAd.host==='true'? Avaliable:'Not Avaliable'}</p>
                                    </div>
                                    <i className="fa fa-quote-right fa-fw pull-right"></i>
                                 </p> 
                              </div>
                              <div className="timeline-footer">
                                { /*<a href="javascript:;" className="m-r-15 text-inverse-lighter"><i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i> Like</a>*/}
                                    <a href="#" className="m-r-15 text-inverse-lighter"><i className="fa fa-share fa-fw fa-lg m-r-3"></i> Go to Ad</a>
                                
                                 
                              </div>
                           </div>
                          
                        </li>

})


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
          
            {showActive ?
            <div className="profile-content">
            
               <div className="tab-content p-0">
                  
                  <div className="tab-pane fade active show" id="profile-post">
                 
                     <ul className="timeline"> 
                        
                         {showActiveAds}
                           
                        
                     </ul>
                     
                  </div>
                  
               </div>
               
            </div> 

            :

        <div className="profile-content">
            
               <div className="tab-content p-0">
                  
                  <div className="tab-pane fade active show" id="profile-post">
                 
                     <ul className="timeline">

                     {showDisabledAds}

                     </ul>
                     
                  </div>
                  
               </div>
               
            </div>}
            
            
         </div>
      </div>
   </div>
</div>
  ) :''
}

export default Profile