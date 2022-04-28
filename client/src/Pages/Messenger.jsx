import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import axios from 'axios'
import '../public/messenger.css'
import {AuthContext} from '../context/AuthContext'
import Conversation from "../components/Conversation";
import Message from "../components/Message";
import CurrentChatComp from '../components/CurrentChat'
import { io } from "socket.io-client";

const Messenger = () => {
   let useAuth=useContext(AuthContext)
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
   const socket = useRef();
  const scrollRef = useRef();
  const [user,setUser]=useState(null)
  const [borderStyle,setBorderStyle]=useState({})
  const [onlineUsers,setOnlineUsers]=useState([])


 //useEffect area
 
   const getCurrentUserInfo=async()=>{
    
    const response=await useAuth.getCurrentUserInfo()
    setUser(response)
            
  }
  const getConversations=async()=>{
    const response=await axios.get('http://localhost:5000/api/conversation/'+user._id,
        {
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        }
      )

     
      if(response?.data.message!='UnAuth'){
        console.log(response.data);
        setConversations(response.data)
        
      }

  }
  
  useEffect(()=>{
     if(useAuth?.currentUser && !user)
          getCurrentUserInfo()
     if(user){
        getConversations();
        setConversations(conversations)

     }
  },[useAuth?.currentUser,user])

  useEffect(()=>{
    const getMessages=async()=>{
      try {
        const res = await axios.get("http://localhost:5000/api/message/" + currentChat?._id,{
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        });
        
        setMessages(res.data);
       
      } catch (err) {
        console.log(err);
      }

    }
    getMessages()

  },[currentChat])
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  const handleSubmit=async(e)=>{
  
    e?.preventDefault();
    
  if(!(!newMessage.replace(/\s/g, '').length)){ //detect blank tab wwhite space
   
      const receiverId = currentChat?.members.find(
      (member) => member !== user?._id
    );
  const message={
    sender:user?._id,
    receiver:receiverId,
    text:newMessage,
    conversationId:currentChat?._id,
    createdAt:new Date().toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'})
  }

 

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
  
  try{
    const res = await axios.post("http://localhost:5000/api/message/" ,{message},{
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        });
        
        setMessages([...messages,res.data]);
    

  }
  catch(err){
    console.log(err);
  }
  setNewMessage('')
  }
}

//socket io
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
  
    socket.current.on("getMessage", (data) => {
      console.log(data);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: new Date().toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
      });
    });
  }, []);
   useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

   useEffect(() => {
     if(user){
    socket.current.emit("addUser", user?._id);
     }
    socket.current?.on("getUsers", (users) => {
      setOnlineUsers(users)

     
    });
  }, [user]);



 /////////////////////////




return (
    <>
     
      <div className="messenger">
        <div className="chatMenu">
          <div  className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" /> 
          
            
             { 
               conversations?.map((c)=>{
              return  <div  key={c?._id+'dsdsds'} onClick={()=> {setCurrentChat(c);  setBorderStyle({border: '1px solid',marginRight:'0.7rem'})} }>
                <Conversation key={c?._id+'dsdsds'}   conversation={c} currentUser={user} />
                </div>
            })}
          
                        
          </div>
        </div>
        <div className="chatBox">
          <div style={borderStyle}  className="chatBoxWrapper">
            {currentChat ? (
              <>
                <CurrentChatComp onlineUsers={onlineUsers}  conversation={currentChat} currentUser={user} />
                
                <div  className="chatBoxTop">
                 {messages.map((m)=>{
                   return <div  key={m?._id+'sdsd'} ref={scrollRef}> 
                  <Message key={m?._id+'sdsd'} message={m} own={m.sender===user._id} />
                 </div>
                 })}

               
                
                    
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => {
                      if(!e.shiftKey){
                      setNewMessage(e.target.value)}
                      if(e.shiftKey){
                        setNewMessage(...newMessage,'\n')
                      }
                       } }
                    value={newMessage}
                    onKeyPress={(event) => {
                    
                      
                    if(event.key==='Enter' && !event.shiftKey){
                     
                      event.preventDefault()
                      handleSubmit()
                    }
           

                    }}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit} >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
       
      </div>
    </>
  );











/********************************************************** */
/*
    const [profileUser,setProfileUser]=useState(null)
    
    
    const {userID}=useParams()

  useEffect(()=>{
       const getProfile=async()=>{
    const response=await axios.get(`http://localhost:5000/api/getContact/${userID}`,{
                            headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                          }
                          
                          )
                          console.log(response.data)
                          if(response.data.message!='UnAuth'){
                           setProfileUser(response.data)
                          }
                       
  }  
      getProfile()
  },[userID,useAuth.currentUser])
    */
    /****************************************************************************** */
  
  
  
  
  
   /* return  (
    <div>hello {userID}
    <div> {profileUser?.user_name} {profileUser?.user_surname}</div>
    </div>
    
  )*/
}

export default Messenger