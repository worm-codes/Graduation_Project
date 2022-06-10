import axios from "axios";
import { useEffect, useState,useContext,useRef } from "react";
import {AuthContext} from '../context/AuthContext'
import "../public/conversation.css";


export default function Conversation({ conversation, currentUser,currentChat,socketCur }) {
  const [user, setUser] = useState(null);
  const[messages,setMessages]=useState([]);
  const [unreadMessageCounter,setUnreadMessageCounter]=useState(0)
  const [arrivalMessage,setArrivalMessage]=useState(null)
  

  
  let useAuth=useContext(AuthContext);
  
 const friendId = conversation?.members?.find((m) => m !== currentUser?._id);

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

  useEffect(() => {
  
    socketCur.on("getMessage", (data) => {
    
      if(data?.senderId===friendId){
      
      setArrivalMessage({
        sender: data.senderId,
        receiver:data.receiverId,
        text: data.text,
        createdAt: new Date().toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
      });
    }
    });
  
    
  }, [])

  useEffect(() => {
    if(conversation._id!==currentChat?._id){
    setUnreadMessageCounter(unreadMessageCounter+1)
    }
  
    
  }, [arrivalMessage])
  
  

 
 
  



 
 

  return (
    <div  className="conversation" onClick={()=>setUnreadMessageCounter(0)}>
      <img
        className="conversationImg"
        src='https://cdn-icons-png.flaticon.com/512/1077/1077114.png'
        alt=""  
      />
      <span className="conversationName">{user?.user_name} {unreadMessageCounter!==0?  <span className="badge badge-pill badge-danger" style={{float:"right" ,marginBottom:"-7px"}}>{unreadMessageCounter?.toString()}</span>:''}  </span>
      
    </div>
  ) 
}
