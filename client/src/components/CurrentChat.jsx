import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import {AuthContext} from '../context/AuthContext'
import "../public/currentchat.css";

export default function Conversation({ conversation, currentUser,onlineUsers }) {
  const [user, setUser] = useState(null);
  let useAuth=useContext(AuthContext)
  const friendId = conversation?.members?.find((m) => m !== currentUser._id);
  let navigate=useNavigate();

 
  const getUser = async () => {
        if(friendId){
      try {
      
        
        const res = await axios.get("http://localhost:5000/api/getUser/" + friendId,{
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        });
    
        setUser(res.data);
      
      
        
      } catch (err) {
        console.log(err);
      }
    }

    };

  

  useEffect(() => {
    
    

    getUser();
  }, [currentUser, conversation,onlineUsers]);

  useEffect(()=>{
    getUser()
  },[onlineUsers])

  

 




  
  


  return user?(
    <div className="Currentconversation" onClick={()=>{navigate(`/profile/${friendId}`)}} >
      <img
        className="conversationImg"
        src='https://cdn-icons-png.flaticon.com/512/1077/1077114.png'
        alt=""  
      />
      <span style={{fontWeight:'900',fontSize:'1.3rem'}}>{user?.user_name}  
      <span style={{display:'flex',fontWeight:'900',fontSize:'0.8rem'}}> {onlineUsers.includes(user._id)?'Online':'Last Seen: '+user.LastSeen+''} </span> </span>
      
    </div>
  ):''
}