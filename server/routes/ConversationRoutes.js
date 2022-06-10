const express=require('express'),
router=express.Router(),
Conversation=require('../models/Conversation'),
MiddleWare=require('../middleware/CheckAuth');
const User=require('../models/User');




router.post('/',MiddleWare?.isAuth, async(req,res)=>{
   
    if(req?.body?.senderId!==req?.body?.receiverId){

    let createCondition=true;
    
    const newConv=new Conversation({
        members:[req?.body?.senderId,req?.body?.receiverId]
    })

  
    const allConv=await Conversation?.find({})
    allConv?.map(({members})=>{
        if(members.includes(req?.body?.senderId)&&members?.includes(req?.body?.receiverId)){
            createCondition=false
        }

    })
    

    try{
        if(createCondition){
        const savedConv=await newConv?.save()
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

router.get('/:userId',MiddleWare?.isAuth,async(req,res)=>{
    
    try{
       const currentConversation=await Conversation?.find({
           members:{$in:[req?.params?.userId]}
       })
       console.log('current conv',currentConversation);
       res.json(currentConversation)
    }
    catch(err){
        res.json(err)
        console.log(err);
    }
})

router.get('/getUsersInChat/:convid',async(req,res)=>{
     try{
        
        const currentConversation=await Conversation?.findById({_id:req?.params?.convid}).clone().catch(function(err){ console.log(err)})
        
        res.json(currentConversation?.UsersInChat)
        
    }
    catch(err){
        console.log(err);
    }

})

router.post('/userEntersChat/:convid/:enteredUserId',async(req,res)=>{
    const targetConv=await Conversation?.findById({_id:req?.params?.convid})
        if(!(targetConv?.UsersInChat?.includes(req?.params?.enteredUserId))){
    try{
    
        
         await Conversation?.updateOne(
   { _id:req?.params?.convid}, 
    { "$push": { "UsersInChat": req?.params?.enteredUserId } } )
    await User.findByIdAndUpdate({_id:req?.params?.enteredUserId},{lastCurrentChat:req?.params?.convid})
     res.sendStatus(200)
   
    }
    catch(err){
        console.log(err);
    }
}
else{
 res.sendStatus(200)
}

})

router.post('/userLeavesChat/:convid/:leavingId',async(req,res)=>{
    try{
      
        await Conversation?.updateOne(
   { _id:req.params.convid}, 
    { "$pull": { "UsersInChat": req?.params?.leavingId } } ).clone().catch(function(err){ console.log(err)})
       res.sendStatus(200)  
    }

    catch(err){
        console.log(err);
    }
  
})

router.post('/quitFromChats/',async(req,res)=>{
    try{
        console.log('tring to quit');
   await Conversation?.updateMany(
   { UsersInChat:{$in:[req.body?.leavingId]}}, 
    { "$pull": { "UsersInChat": req?.body?.leavingId } } )
    res.sendStatus(200) 
        
   }
    catch(err){
        console.log(err);
    }
   
})




module.exports=router;