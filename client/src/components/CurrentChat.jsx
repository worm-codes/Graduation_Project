import axios from "axios";
import { useEffect, useState,useContext } from "react";
import {AuthContext} from '../context/AuthContext'
import "../public/currentchat.css";

export default function Conversation({ conversation, currentUser,onlineUsers }) {
  const [user, setUser] = useState(null);
  let useAuth=useContext(AuthContext)
  const friendId = conversation.members.find((m) => m !== currentUser._id);
  const [lastSeen,setLastSeen]=useState('')
 
  const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getUser/" + friendId,{
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        });
    
        setUser(res.data);
        console.log(res.data);
        setLastSeen(res.data.LastSeen)
        
      } catch (err) {
        console.log(err);
      }
    };

  

 console.log(onlineUsers);
 console.log(onlineUsers.includes(user?._id));
  useEffect(() => {
    
    
   console.log(friendId);
   
    getUser();
  }, [currentUser, conversation]);

  useEffect(()=>{
    getUser()
  },[onlineUsers])

  

 




  
  
 //user mesajlar (gorulmemis mesajlar) ve anlik last  seen buguna bak ************************************************

  return user?(
    <div className="Currentconversation" >
      <img
        className="conversationImg"
        src='https://cdn-icons-png.flaticon.com/512/1077/1077114.png'
        alt=""  
      />
      <span style={{fontWeight:'900',fontSize:'1.3rem'}}>{user?.user_name}  
      <span style={{display:'flex',fontWeight:'900',fontSize:'0.8rem'}}> {onlineUsers.includes(user._id)?'Online':'Last Seen: '+lastSeen+''} </span> </span>
      
    </div>
  ):''
}
