const date = require('date-and-time');
const axios=require('axios');

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const logoutServer=async(userID)=>{
      const response=await axios.post('http://localhost:5000/api/logout',{
                         
        userId:userID,
        LastSeen:date.format(new Date(), 'YYYY/MM/DD HH:mm')
       
      }
      
      )
      console.log('logout',response.data);
      
    }

   
let users = [];
let userIds=[];
let outsideOfTheChat=[]

const addUser = (user, socketId) => {
  
  
  !users.some((listUser) => listUser._id === user._id) &&users.push({ user, socketId }) ;
  
   if(!(user.boolean)){
     console.log('hello');
  !userIds.some((onlineuserId) => onlineuserId === user?._id)&&userIds.push(user._id)
   }
  console.log('userids array',userIds);  
};

 const leaveChats=async(leavingUser)=>{
                 const resp=await axios.post(`http://localhost:5000/api/conversation/quitFromChats/`,{
                   leavingId:leavingUser
                  }) }
 
const getCurrentUsersInChat=async(convId)=>{
  
  const resp=await axios.get('http://localhost:5000/api/conversation/getUsersInChat/'+convId)
      
        return await resp.data        
}   



const removeUser = (socketId) => {
  
  users = users.filter((user) =>user.socketId !== socketId);

};
const removeId=async(id)=>{
  if(userIds.includes(id)){
    await logoutServer(id)
    userIds=userIds.filter((onlineUserId)=>onlineUserId!==id)
    io.emit("getUsers", userIds);
  }
  
  

}

const getUser = (userId) => {

  return users.find((listUser) => listUser.user._id === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");
 
  //take userId and socketId from user
  socket.on("addUser", (user) => {
    console.log(user);
    if(user._id!=null){
    addUser(user, socket.id);
    }
    io.emit("getUsers", userIds);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId,currentConversation, text }) => {
    const user = getUser(receiverId);
 
    if(user?.user){
    io.to(user.socketId).emit("getMessage", {
      senderId,
      receiverId,
      currentConversation,
      text,
    });
  }
    
  
  });
  socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

  //opensChat

  socket.on("openChat", async({convId, senderId, receiverId }) => {
    console.log('entered open chat');
    console.log('receiverId',receiverId)
   
    const receiverUser = getUser(receiverId);
    
    const senderUser=getUser(senderId);
    console.log('sender',senderUser);
     
    

    let usersInChat=await getCurrentUsersInChat(convId)
     console.log('receiver',receiverUser);
    console.log('usersinchat from func',usersInChat)
    if(receiverUser?.user && userIds.includes(receiverId)&&usersInChat?.includes(receiverId)){
    console.log('first if');
     io.to(receiverUser.socketId).to(senderUser.socketId).emit("getCurrentUsersInChat", {
      usersInChat
    });
     
  }
   if(receiverUser?.user &&userIds.includes(receiverId)&& !(usersInChat?.includes(receiverId) )){
     console.log('second if');
     
     await io.to(senderUser.socketId).emit("getCurrentUsersInChat", {
      usersInChat
    });
 
  }
  if(!receiverUser &&!(userIds.includes(receiverId))){
    console.log('not online');
    console.log('currentChat',convId);
    await io.to(senderUser.socketId).emit("getCurrentUsersInChat", {
      usersInChat
    });

  }
    
  
  });


  //close chat
  socket.on("closeChat", async({convId, receiverId }) => {
    console.log('entered close chat');
    const receiverUser = getUser(receiverId);

    
    let usersInChat=await getCurrentUsersInChat(convId)
     console.log('receiver',receiverUser);
    console.log('usersinchat from func leavechat',usersInChat)
    if(receiverUser?.user &&userIds.includes(receiverId)&& usersInChat?.includes(receiverId)){
    console.log('sending that i am leaving');
    io.to(receiverUser.socketId).emit("getCurrentUsersInChat", {
      usersInChat
    });
     
  }
 

    
  
  });





  //when disconnect
  socket.on("disconnect", async() => {
    console.log("a user disconnected!");
    users.map(async(userInfo)=>{
    //ENTERCHAT VE USERSINCHAT CALISIYOR LEAVECHAT TE KALDIN IKI KISILI DENEMEDIN DENE
      if(userInfo.socketId==socket.id){
    
         await leaveChats(userInfo.user._id)
         removeId(userInfo.user._id)
   
         let usersInChat =await getCurrentUsersInChat(userInfo.user?.lastCurrentChat);
         console.log(usersInChat);
        if(usersInChat!==[] && getUser(usersInChat[0])){
          console.log('entered array check');
          console.log('usersinchat 0',getUser(usersInChat[0]));
        io.to(getUser(usersInChat[0]).socketId).emit("getCurrentUsersInChat", {
        usersInChat
    });}
      
      removeUser(socket.id);
      console.log('socketli user array',users)
   
      }
    })
   
      
    
    
 
  });
});