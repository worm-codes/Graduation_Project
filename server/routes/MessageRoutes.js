const Conversation = require('../models/Conversation');
const User = require('../models/User');

const express=require('express'),
router=express.Router(),
Message=require('../models/Message'),
MiddleWare=require('../middleware/CheckAuth');

//add
router.post('/',MiddleWare.isAuth,async(req,res)=>{
    
    
    const newMessage=new Message(req.body.message)
    console.log(newMessage);
    try{
        const savedMessage=await newMessage.save();
        res.json(savedMessage)
    }
    catch(err){
        res.json('err')
        console.log(err);
    }
})

//get
router.get('/:conversationId/:userId',MiddleWare.isAuth,async(req,res)=>{
    try{
        const messages=await Message.find({
            conversationId:req.params.conversationId
        })
    
     
       await Message.updateMany({receiver: req.params.userId,conversationId:req.params.conversationId}, {$set: {unread: false}})
        
        res.json(messages)
    }
    catch(err){
        res.json('error')
        console.log(err);
    }
})
//get
router.post('/AllUnreadMessages/:mail',async(req,res)=>{
     
    
    try{
        const usertoFind=await User.findOne({user_email:req.params.mail});
   
        const messages=await Message.find({
            receiver:usertoFind._id,unread:true
        })
   
        res.json(messages.length)
        
      
    }
    catch(err){
        res.json('error')
        console.log(err);
    }
})



//get
router.get('/:conversationId',MiddleWare.isAuth,async(req,res)=>{
    try{
        const messages=await Message.find({
            conversationId:req.params.conversationId
        })
        res.json(messages)
      
    }
    catch(err){
        res.json('error')
        console.log(err);
    }
})




module.exports=router;