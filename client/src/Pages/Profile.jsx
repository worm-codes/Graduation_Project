import React from 'react'
import { useParams } from 'react-router'

const Profile = () => {
    //useParams, Route componentindeki path variable'ında yani urldeki
    //':' karakterinden sonraki değeri yakalar. Bu örneğin bir username
    //veya ID olabilir. Kişiye özgü content renderlamak için kullanılır.
    let { username } = useParams();
    // if(username) {
    //     return (
    //         <div>
    //              This is the profile page for {username}!
    //         </div>
    //       )
    // }
    // return (
    //     <div>Generic Profile Page!</div>
    // );
    return (
        <div>This is the profile page for {username}</div>
    )
  
}

export default Profile