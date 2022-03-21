import React,{useEffect} from 'react'
import axios from 'axios'

const Dashboard = () => {
  useEffect(()=>{
    const request=async()=>{
       const res=await axios.post('http://localhost:5000/api/search',{});
       console.log(res)

    }
    request()
   
  },[])

  return (
    <h1>Secret</h1>
  )
}

export default Dashboard