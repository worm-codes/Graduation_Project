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
  const [usersInChat,setUsersInChat]=useState([])
  const [inComingMessageFromAnotherChat,setInComingMessageFromAnotherChat]=useState(null)





 //useEffect area
 
   const getCurrentUserInfo=async()=>{
    
    const response=await useAuth.getCurrentUserInfo()
    setUser(response)
            
  }
  const getConversations=async()=>{
    const response=await axios.get('http://localhost:5000/api/conversation/'+user?._id,
        {
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        }
      )

     
      if(response?.data.message!='UnAuth'){
        console.log(response.data);
        setConversations(response.data)
        
      }

  }
   useLayoutEffect(() => {
    socket.current = io("ws://localhost:8900");
   console.log('workingggg');
    socket.current?.on("getMessage", (data) => {
     console.log(data);
      setArrivalMessage({
        sender: data.senderId,
        receiver:data.receiverId,
        text: data.text,
        createdAt: new Date().toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
      });

       
    });

    

    
    
  }, []);
  
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
      if(user &&currentChat){
        
      try {
     
      
        const res = await axios.get('http://localhost:5000/api/message/'+currentChat?._id+'/'+user?._id,{
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        });
        
        setMessages(res.data);


        
      } catch (err) {
        console.log(err);
      }

      
    }

   
      

    }

    getMessages()


    
       try{
         console.log('entered chat current',currentChat);
         console.log(socket.current);
         if(socket.current){
       socket?.current?.on("getCurrentUsersInChat", async(data) => {
    
       if(data!==undefined){
       setUsersInChat(data?.usersInChat);
      console.log('boolean',data?.usersInChat.length===2);
      if(data?.usersInChat.length===2){
        const getMessages=async()=>{
    
      if(user &&currentChat && messages){
      try {
     
      
        const res = await axios.get('http://localhost:5000/api/message/'+currentChat?._id+'/'+user?._id,{
          headers:{Authorization: 'Bearer ' + await useAuth?.currentUser?.getIdToken(true)}
        });
        if(JSON.stringify(messages)!=JSON.stringify(res.data)){
        setMessages(res.data);
        console.log('messages updated!');
        }
        
      } catch (err) {
        console.log(err);
      }
    }
      

    }

    await getMessages()
      }
    }
    })};

    }
    catch(err){
      console.log(err);
    }
    if(currentChat){
     setBorderStyle({border: '1px solid',marginRight:'0.7rem'})
    }

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
  let message={
    sender:user?._id,
    receiver:receiverId,
    text:newMessage,
    conversationId:currentChat?._id,
    createdAt:new Date().toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
  
  }
 
  if(!(usersInChat?.includes(receiverId))){
    message.unread=true
  }
  else{
    message.unread=false
  }


 

    socket.current.emit("sendMessage", {
      senderId: user?._id,
      currentConversation:currentChat?._id,
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
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  

  

   useEffect(() => {
     if(user){
       const addUserBySocket=async()=>{
       socket.current?.emit("addUser", user);
       }
       addUserBySocket()
    

     }
    socket.current?.on("getUsers", (users) => {
      setOnlineUsers(users)

     
    });
  }, [user]);

 

  console.log(onlineUsers);
  console.log('usersinchat',usersInChat);





return (
    <>
     
      <div className="messenger">
        <div className="chatMenu">
          <div  className="chatMenuWrapper">
            {/*<input placeholder="Search for friends" className="chatMenuInput" /> */}
          
            
             { 
               conversations?.map((c)=>{
              return  <div  key={c?._id+'dsdsds'} style={currentChat?._id===c?._id?{pointerEvents: 'none'}:{}} onClick={async()=> {
                if(user){
                if(currentChat===null){
               
                  const enterChat=async()=>{
                   const resp=await axios.post(`http://localhost:5000/api/conversation/userEntersChat/${c._id}/`+user?._id,{
                            headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                          })
                          
                         setCurrentChat(c);
                       let receiver=await c.members.find((dbuser) => dbuser!== user?._id)
                        console.log('receiver socket',receiver);
                        socket.current?.emit("openChat", {
                        senderId: user._id,
                        receiverId:receiver,
                        convId: c._id,
                      });
                  
               }
               setCurrentChat(c);
                await enterChat()
                 
                  

                }
            
                 if(currentChat!==null && currentChat._id!==c._id){
             
                  let leaveChat=async()=>{
                    
                 let resp=await axios.post('http://localhost:5000/api/conversation/userLeavesChat/'+currentChat._id+'/'+user?._id,{
                            headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                          })
                     

                          let receiver=currentChat.members.find((dbuser) => dbuser!== user?._id)
                          socket.current?.emit("closeChat", {
                       
                        receiverId:receiver,
                        convId: currentChat._id,
                      }); 
                
                 
                }
                  
                  let enterChat=async()=>{
                 
                   let resp=await axios.post(`http://localhost:5000/api/conversation/userEntersChat/${c._id}/`+user?._id,{
                            headers:{Authorization: 'Bearer ' + await useAuth.currentUser.getIdToken(true)}
                          })
                         

                         let receiver=c.members.find((dbuser) => dbuser!== user?._id)
                        console.log('receiver socket',receiver);
                        socket.current?.emit("openChat", {
                        senderId: user._id,
                        receiverId:receiver,
                        convId: c._id,
                      });
                          
                       
             
                  
                   
                
               }
                  await leaveChat()
      
                 await  enterChat()
                  setCurrentChat(c) 
                  
                 
                  
                  
                }
            
               }} }>
                <Conversation key={c?._id+'dsdsds'}  socketCur={socket.current} currentChat={currentChat} conversation={c} currentUser={user} />
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
                   
                   return <div  key={m?._id+Math.floor(Math.random() * 1000).toString()} ref={scrollRef}> 
                  <Message key={m?._id+'sdsd'}  message={m} bothInChat={usersInChat==2}  own={m.sender===user._id} />
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



}

export default Messenger