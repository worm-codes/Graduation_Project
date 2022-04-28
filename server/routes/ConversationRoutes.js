
const express=require('express'),
router=express.Router(),
Conversation=require('../models/Conversation'),
MiddleWare=require('../middleware/CheckAuth');



//new conversation  ///CONTACT MANTIGINI BIRAK TIKLANINCA OLUSAN ID ILE CONVERSATION AC DENE
router.post('/',MiddleWare.isAuth, async(req,res)=>{
   
    if(req.body.senderId!==req.body.receiverId){

    let createCondition=true;
    
    const newConv=new Conversation({
        members:[req.body.senderId,req.body.receiverId]
    })

  
    const allConv=await Conversation.find({})
    allConv.map(({members})=>{
        if(members.includes(req.body.senderId)&&members.includes(req.body.receiverId)){
            createCondition=false
        }

    })
    

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
}
else{
    res.json('sender id and receiver id can not be the same')
}
})


//get conv from user

router.get('/:userId',MiddleWare.isAuth,async(req,res)=>{
    
    try{
       const currentConversation=await Conversation.find({
           members:{$in:[req.params.userId]}
       })
       console.log(currentConversation);
       res.json(currentConversation)
    }
    catch(err){
        res.json(err)
        console.log(err);
    }
})


module.exports=router;