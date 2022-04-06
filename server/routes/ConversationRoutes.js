
const express=require('express'),
router=express.Router(),
Conversation=require('../models/Conversation'),
MiddleWare=require('../middleware/CheckAuth');



//new conversation
router.post('/', async(req,res)=>{
    let createCondition=true;
    const newConv=new Conversation({
        members:[req.body.senderId,req.body.receiverId]
    })
  
    const findConv=await Conversation.find({})
    findConv.map(({members})=>{
        if(members.includes(req.body.senderId)&&members.includes(req.body.receiverId)){
            createCondition=false
        }

    })
    console.log('founded',findConv)

    try{
        if(createCondition){
        const savedConv=await newConv.save()
        console.log(savedConv);
        res.json(savedConv)
            
    }
    else{
        
        res.json('already exists')
    }
    }
    catch(err){
        console.log(err)
    }
})


//get conv from user

router.get('/:userId',async(req,res)=>{
    try{
       const currentConversation=await Conversation.find({
           members:{$in:[req.params.userId]}
       })
       res.json(currentConversation)
    }
    catch(err){
        console.log(err);
    }
})


module.exports=router;