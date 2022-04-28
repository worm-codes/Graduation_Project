import axios from "axios";
import { useEffect, useState,useContext } from "react";
import {AuthContext} from '../context/AuthContext'
import "../public/conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const[messages,setMessages]=useState([])
  let useAuth=useContext(AuthContext)
 const friendId = conversation.members.find((m) => m !== currentUser._id);

  useEffect(() => {
   
    

    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getUser/" + friendId,{
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        });
    
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  useEffect(()=>{
    const getMessages=async()=>{
      try {
        const res = await axios.get("http://localhost:5000/api/message/" + conversation?._id,{
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        });
        
        setMessages(res.data);
       
      } catch (err) {
        console.log(err);
      }

    }
    getMessages()

  },[conversation])



 
 

  return ((conversation.members[0]===currentUser._id && messages.length==0)||(messages.length!=0))? (
    <div className="conversation">
      <img
        className="conversationImg"
        src='https://cdn-icons-png.flaticon.com/512/1077/1077114.png'
        alt=""  
      />
      <span className="conversationName">{user?.user_name}  </span>
      
    </div>
  ) :''
}