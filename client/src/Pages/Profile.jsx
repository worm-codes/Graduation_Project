import React,{useState,useEffect} from 'react'
import '../public/profile.css'
const Profile = () => {
    let image=['https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1096&q=80',
'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
'https://images.unsplash.com/photo-1557745133-ee31592739cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80']
  const [pickedImage,setPickedImage]=useState(0);

  useEffect(()=>{ /*state e atama yapmak icin useffect kullanmayi unutmaa !!!!! */
setPickedImage(Math.floor(Math.random() * image.length))



},[])


return (
    <div className="container">
   <div className="row">
      <div className="col-md-12">
         <div id="content" className="content content-full-width">
           
            <div className="profile">
               <div className="profile-header">
             
                  <div  style={{ backgroundImage: `url(${image[pickedImage]})`}} className="profile-header-cover"></div>
                
                
                  <div className="profile-header-content">
                   
                     <div className="profile-header-img">
                        <img src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png" alt=""/>
                     </div>
                   
                
                     <div className="profile-header-info">
                        <h4 className="m-t-10 m-b-5">Current User</h4>
                        <p className="m-b-5">Age:23 </p>
                        <p className="m-b-10 ">Gender: Male</p>
                        
                        <a href="#" className="btn btn-sm btn-info mb-2">Edit Profile</a>
                     </div>
                   
                  </div>
                
                  
                  <ul className="profile-header-tab nav nav-tabs">
                     <li className="nav-item"><a href="#profile-post" className="nav-link active show" data-toggle="tab">ADDS</a></li>
                     <li className="nav-item"><a href="#profile-about" className="nav-link" data-toggle="tab">REVIEWS</a></li>
                     
                     
                  </ul>
                 
               </div>
            </div>
          
         
            <div className="profile-content">
            
               <div className="tab-content p-0">
                  
                  <div className="tab-pane fade active show" id="profile-post">
                 
                     <ul className="timeline">
                        
                        

                        <li>
                              
                           <div className="timeline-time">
                              <span className="date">24 February 2014</span>
                              <span className="time">08:17</span>
                           </div>
                          
                          
                           <div className="timeline-icon">
                              <a href="javascript:;">&nbsp;</a>
                           </div>
                         
                          
                           <div className="timeline-body">
                              <div className="timeline-header">
                                 <span className="userimage">
                                 <img src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png" alt=""/></span>
                                 <span className="username">Current User</span>
                                 <span className="pull-right text-muted">{/*views */}</span>
                              </div>
                              <div className="timeline-content">
                                 <p className="lead">
                                    <i className="fa fa-quote-left fa-fw pull-left"></i>
                                    Quisque sed varius nisl. Nulla facilisi. Phasellus consequat sapien sit amet nibh molestie placerat. Donec nulla quam, ullamcorper ut velit vitae, lobortis condimentum magna. Suspendisse mollis in sem vel mollis.
                                    <i className="fa fa-quote-right fa-fw pull-right"></i>
                                 </p>
                              </div>
                              <div className="timeline-footer">
                                { /*<a href="javascript:;" className="m-r-15 text-inverse-lighter"><i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i> Like</a>
                                    <a href="javascript:;" className="m-r-15 text-inverse-lighter"><i className="fa fa-comments fa-fw fa-lg m-r-3"></i> Comment</a> */}
                                 <a href="#" className="m-r-15 text-inverse-lighter"><i className="fa fa-share fa-fw fa-lg m-r-3"></i> Go to Add</a>
                              </div>
                           </div>
                          
                        </li>







                        
                        
                       
                        <li>
                              
                           <div className="timeline-time">
                              <span className="date">24 February 2014</span>
                              <span className="time">08:17</span>
                           </div>
                          
                          
                           <div className="timeline-icon">
                              <a href="javascript:;">&nbsp;</a>
                           </div>
                         
                          
                           <div className="timeline-body">
                              <div className="timeline-header">
                                 <span className="userimage">
                                 <img src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png" alt=""/></span>
                                 <span className="username">Current User</span>
                                 <span className="pull-right text-muted">{/*views */}</span>
                              </div>
                              <div className="timeline-content">
                                 <p className="lead">
                                    <i className="fa fa-quote-left fa-fw pull-left"></i>
                                    Quisque sed varius nisl. Nulla facilisi. Phasellus consequat sapien sit amet nibh molestie placerat. Donec nulla quam, ullamcorper ut velit vitae, lobortis condimentum magna. Suspendisse mollis in sem vel mollis.
                                    <i className="fa fa-quote-right fa-fw pull-right"></i>
                                 </p>
                              </div>
                              <div className="timeline-footer">
                                { /*<a href="javascript:;" className="m-r-15 text-inverse-lighter"><i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i> Like</a>
                                    <a href="javascript:;" className="m-r-15 text-inverse-lighter"><i className="fa fa-comments fa-fw fa-lg m-r-3"></i> Comment</a> */}
                                 <a href="#" className="m-r-15 text-inverse-lighter"><i className="fa fa-share fa-fw fa-lg m-r-3"></i> Go to Add</a>
                              </div>
                           </div>
                          
                        </li>

                        
                     </ul>
                     
                  </div>
                  
               </div>
               
            </div>
            
         </div>
      </div>
   </div>
</div>
  )
}

export default Profile