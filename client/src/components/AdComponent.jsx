import React from 'react'
import '../public/profile.css'
const AdComponent = ({user,showActive,activeAdsArr,disabledAdsArr}) => {

     const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // Function for adding 0 in front of hours & minutes that are 0 - 9.
  let decideToPutZero = (num) => {
    if(num < 10){
      return '0'+num?.toString();
    } else {
      return num?.toString();
    }
  }

  const printProvince=(ad)=>{
    let removedProvince=''
    if(ad?.state?.includes('Province')){
        
      removedProvince=ad?.state?.replace('Province','')
      
    
      if(removedProvince.includes(ad?.city)||ad?.city.includes(removedProvince)){
         
          return ad?.city
      }
      else{
        return removedProvince+'-'+ad?.city
      }
    }
    
    
    else if (removedProvince===''){
          console.log('entered elsse if');
        return ad?.city
    }
    

}

const showActiveAds=activeAdsArr?.map((activeAd)=>{
return (
     <li>
                              
                           <div className="timeline-time">
                              <span className="date">{activeAd?.arriving_date_day?.toString()} {months[activeAd?.arriving_date_month-1]} - {activeAd?.leaving_date_day?.toString()} {months[activeAd?.leaving_date_month-1]}  <span className="date">{activeAd?.leaving_date_year}</span></span>
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


const showDisabledAds=disabledAdsArr?.map((disabledAd)=>{
    return   <li>
                              
                           <div className="timeline-time">
                              <span className="date">{disabledAd?.arriving_date_day?.toString()} {months[disabledAd?.arriving_date_month-1]} - {disabledAd?.leaving_date_day?.toString()} {months[disabledAd?.leaving_date_month-1]} <span className="date">{disabledAd?.leaving_date_year}</span></span>
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



  return (
    <>{showActive?showActiveAds:showDisabledAds}</>
  )
}

export default AdComponent