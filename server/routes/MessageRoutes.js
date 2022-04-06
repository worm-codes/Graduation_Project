const Conversation = require('../models/Conversation');

const express=require('express'),
router=express.Router(),
Message=require('../models/Message'),
MiddleWare=require('../middleware/CheckAuth');

//add
router.post('/',async(req,res)=>{
    const newMessage=new Message(req.body)
    try{
        const savedMessage=await newMessage.save();
        res.json(savedMessage)

    }
    catch(err){
        console.log(err);
    }
})

//get
router.get('/:conversationId',async(req,res)=>{
    try{
        const messages=await Message.find({
            conversationId:req.params.conversationId
        })
        res.json(messages)
    }
    catch(err){
        console.log(err);
    }
})


module.exports=router;