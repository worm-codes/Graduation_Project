import axios from "axios";
import { useEffect, useState,useContext } from "react";
import {AuthContext} from '../context/AuthContext'
import "../public/conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const[messages,setMessages]=useState([]);
  const [unreadMessageCounter,setUnreadMessageCounter]=useState(null)
  let useAuth=useContext(AuthContext);
 const friendId = conversation.members.find((m) => m !== currentUser._id);

  useEffect(() => {
   
    

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

  },[conversation.UsersInChat])

  useEffect(() => {
    let counter=0;
    messages?.map((message)=>{
      if(message.unread===true && message.receiver===currentUser?._id){
      counter++;
      }
    })
    setUnreadMessageCounter(counter)
    
  }, [messages])
  



 
 

  return ((conversation.members[0]===currentUser._id && messages.length==0)||(messages.length!=0))? (
    <div  className="conversation" onClick={()=>setUnreadMessageCounter(null)}>
      <img
        className="conversationImg"
        src='https://cdn-icons-png.flaticon.com/512/1077/1077114.png'
        alt=""  
      />
      <span className="conversationName">{user?.user_name} {unreadMessageCounter? '- ' +unreadMessageCounter?.toString():''}  </span>
      
    </div>
  ) :''
}
