import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from "../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form'
import axios from "axios";
import Navbar from "./Navbar";

const MyPastAds = () => {

    const { currentUser } = useContext(AuthContext);
    let useAuth=useContext(AuthContext)
    //const [adsArrState, setAdsArrState] = useState([])
    const [adArrState, setAdArrState] = useState([])
    const { handleSubmit } = useForm();
    // const [activeAdsArr, setActiveAdsArr] = useState([])
    const [inActiveAdsArr, setInActiveAdsArr] = useState([])
    // const { id } = useParams();
    let generalData = []
    //setAdArrState([])
    useEffect(()=> {
      setAdArrState([])
    }, [])
    useEffect(() => {
        const getAds = async () => {
            const response = await axios.get(`http://localhost:5000/api/myads`,{
                headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
              }) 
              setAdArrState(response.data[0].filter((ads) => ads.isActive === false))
            //   setInActiveAdsArr(response.data[0].filter((ads) => ads.isActive === false));
            //   setActiveAdsArr(response.data[0].filter((ad) => ad.isActive === true));
            //   setInActiveAdsArr(response.data[0].filter((ads) => ads.isActive === false));      
        } 
        getAds();
    }, [])
    console.log(adArrState)
    //setAdArrState([])
    // let allAds = [];
    // for(let i = 0; i < adArrState.length; i++){
    //     allAds.push(adArrState[i]);
    // }
    // console.log("allAds var:", allAds);
    // let acTiveAdsArr = adArrState.filter((ads) => ads.isActive === true);
    // let inActiveAdsArr = adArrState.filter((ad) => ad.isActive === false);
    // console.log("active ads:", activeAdsArr);
    // console.log("inactive ads:", inActiveAdsArr);
  return (
    <>
        <div>
            <Navbar/>
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
      {adArrState.map((ad,key) => (
          <tr key={key}>
              <th scope='row'>{key+1}</th>
              <td>{ad.owner_email}</td>
              <td>{ad.country}</td>
              <td>{ad.state}</td>
              <td>{ad.city}</td>
              <td>
                  <form onSubmit={handleSubmit(async (data) => {
                      const deletedAd = await axios.delete(`http://localhost:5000/api/mypastads/${ad._id}`, {
                        headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                      })
                    //   setActiveAdsArr(changedAd.data.user_ads.filter((ad) => ad.isActive === true));
                    //   setInActiveAdsArr(adArrState.filter((ads) => ads.isActive === false));
                    // console.log(adID)
                    setAdArrState(adArrState.filter((ads) => ads._id !== deletedAd.data._id))
                    console.log("deletedAd var:", deletedAd)
                  })}>
                      <button className='btn btn-danger'>Delete</button>
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

export default MyPastAds