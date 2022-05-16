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
const addUser = (userId, socketId) => {
  console.log('dsdsd');
  !users.some((user) => user.userId === userId) &&users.push({ userId, socketId }) ;
   
  !userIds.some((user) => user === userId)&&userIds.push(userId)  
};

 const leaveChats=async(leavingUser)=>{
                 const resp=await axios.post(`http://localhost:5000/api/conversation/quitFromChats/`,{
                   leavingId:leavingUser
                  }) }

const removeUser = (socketId) => {
  
  users = users.filter((user) =>user.socketId !== socketId);

};
const removeId=async(id)=>{
  userIds=userIds.filter((user)=>user!==id)
   await logoutServer(id)
}

const getUser = (userId) => {
  console.log(users);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");
 
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log(userId);
    if(userId!=null){
    addUser(userId, socket.id);
    }
    io.emit("getUsers", userIds);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(user);
    if(user){
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  }
    
  
  });

  //when disconnect
  socket.on("disconnect", async() => {
    console.log("a user disconnected!");
    users.map(async(userInfo)=>{
      console.log(userInfo);
      if(userInfo.socketId==socket.id){
         leaveChats(userInfo.userId)
          console.log('id bu',userInfo.userId);
           removeId(userInfo.userId)
          
           
      }
    })
     removeUser(socket.id);
    await io.emit("getUsers", userIds);
    
 
  });
});
