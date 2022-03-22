import React from 'react'
import { useNavigate } from 'react-router'
//useNavigate, bir sayfadan diğerine redirect etme işleminde kullanılır.

const ErrorPage = () => {
  let navigate = useNavigate();
  return (
    <>
    <div>ERROR, PAGE NOT FOUND</div>
    <button onClick={() => {navigate("/")}}>Back to Home</button>
    </>
    
  )
}

export default ErrorPage