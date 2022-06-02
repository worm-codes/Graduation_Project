import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from "../context/AuthContext";
import { useForm } from 'react-hook-form'
import axios from "axios";
import Navbar from '../components/Navbar'

const MyAds = () => {

    const { currentUser } = useContext(AuthContext);
    let useAuth=useContext(AuthContext)
    //const [adsArrState, setAdsArrState] = useState([])
    const [adArrState, setAdArrState] = useState([])
    const { handleSubmit } = useForm();
    const [activeAdsArr, setActiveAdsArr] = useState([])
    // const [inActiveAdsArr, setInActiveAdsArr] = useState([])
    // const { id } = useParams();
    let generalData = []
    //setAdArrState([])
    useEffect(()=> {
      setAdArrState([])
    }, [])
    useEffect(() => {
        const getAds = async () => {
            const response = await axios.get(`http://localhost:5000/api/ad/myads`,{
                headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
              }) 
              setAdArrState(response.data[0])
              setActiveAdsArr(response.data[0].filter((ad) => ad.isActive === true));
            //   setInActiveAdsArr(response.data[0].filter((ads) => ads.isActive === false));      
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
  return (
    <>
        <div>
            {/* <Navbar/> */}
        <div className="table-responsive">
            <table className="table table hover">
                
            <thead className='thead-dark'>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Email</th>
      <th scope="col">Country</th>
      <th scope="col">State</th>
      <th scope="col">City</th>
      <th scope="col">Detail</th>
    </tr>
  </thead>
 
  <tbody>
      {activeAdsArr?.map((ad,key) => (
          <tr key={key}>
              <th scope='row'>{key+1}</th>
              <td>{ad.owner_email}</td>
              <td>{ad.country}</td>
              <td>{ad.state}</td>
              <td>{ad.city}</td>
              <td>
                  <form onSubmit={handleSubmit(async (data) => {
                   
                      const changedAd = await axios.put(`http://localhost:5000/api/ad/myads`, {adID: ad._id})
                    //   console.log("changedAd.data.user_ads var inside form",changedAd.data)
                      setActiveAdsArr(changedAd.data);
                    // console.log("changedAd var:", changedAd)
                  })}>
                      <button className='btn btn-warning'>Cancel</button>
                  </form>
              </td>
          </tr>        
      ))}
    
  </tbody>

            </table>
        </div>
        </div>
    </>
  )
}

export default MyAds