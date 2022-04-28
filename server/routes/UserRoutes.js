
const express=require('express'),
router=express.Router(),
User=require('../models/User'),
MiddleWare=require('../middleware/CheckAuth');



router.post('/getUser',MiddleWare.isAuth,async (req,res)=>{   
    console.log('--------------------------');
     console.log('girdik ana user');
    console.log('--------------------------');
    
     let foundedUser=null
     
     if(MiddleWare.decodeValue &&req.body.user_email){
      
       foundedUser=await User.findOne({user_email:MiddleWare.decodeValue.email})
      
     
         if(foundedUser){
        let timeSignIn=(req.body.user_last_sign_in?.split(' GMT')[0])
        let timeCreation=(req.body.createdAt?.split(' GMT')[0])
       
        if(!foundedUser.createdAt){
         await User.findByIdAndUpdate({_id:foundedUser._id},{createdAt:timeCreation})
        }
         
        await User.findByIdAndUpdate({_id:foundedUser._id},{lastSignIn:timeSignIn})
        console.log(foundedUser);
        return res.json(foundedUser)
            }
            else{
                res.json('couldnt find')
            }
        }


 })
 router.get('/getUser/:id',MiddleWare.isAuth,async (req,res)=>{  
     console.log('--------------------------');
     console.log('girdik id li user al');
    console.log('--------------------------');
     let foundedUser=null
     
     if(MiddleWare.decodeValue && req.params.id){
       
       foundedUser=await User.findOne({_id:req.params.id})
    
         if(foundedUser){
           res.json(foundedUser)
         }
            }
            else{
                res.json('couldnt find')
            }

 })

router.post('/register',async (req,res)=>{
    let checkForId=await User.findOne({user_ID:req.body.user_ID})

    if(checkForId){
        return res.json('duplicate')
    }
         console.log('yaratmadan once')
        try{
            console.log('yaratiyor')
        await User.create({
            user_ID:req.body.user_ID,
            user_name:req.body.user_name,
            user_surname:req.body.user_surname,
            user_gender:req.body.user_gender,
            user_email:req.body.user_email,
            user_date_of_birth:req.body.user_date_of_birth,
        })
       res.json('success')
    }
    catch(err){
        console.log(err)
        res.json('error')
    }
})

router.get('/getAllUsers',MiddleWare.isAuth,async(req,res)=>{
    console.log('--------------------------');
     console.log('girdik alluser');
    console.log('--------------------------');
    await User.find({},(err,Users)=>{
        if(err){
            throw err
            
        }
        else{
            
            res.json(Users)
            
        }
    }).clone().catch(function(err){ console.log(err)})

})
router.post('/login',async(req,res)=>{
    console.log('--------------------------');
     console.log('girdik loginnnn');
    console.log('--------------------------');
    if(req.body.user_email){
        await User.findOneAndUpdate({user_email:req.body.user_email},{isOnline:'Online'},(err,okey)=>{
        if(err){
            console.log(err);
        }
        else{
            
            res.json('done')
            
        }
    }).clone().catch(function(err){ console.log(err)})
    }
    else if (req.body.userId){
        await User.findByIdAndUpdate({_id:req.body.userId},{isOnline:'Online'},(err,okey)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(okey);
            res.json('done')
            
        }
    }).clone().catch(function(err){ console.log(err)})

    }
  
    
    

})
router.post('/logout',async(req,res)=>{
    console.log('--------------------------');
     console.log('girdik logout');
    console.log('--------------------------');
    if(req.body.user_email){
    await User.findOneAndUpdate({user_email:req.body.user_email},{isOnline:req.body.isOnline},(err,okey)=>{
        if(err){
            console.log(err);
        }
        else{
           
            res.json('done')
            
        }
    }).clone().catch(function(err){ console.log(err)})
}
else if(req.body.userId){
    
     await User.findByIdAndUpdate({_id:req.body.userId},{isOnline:req.body.isOnline},(err,okey)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(okey);
           
                console.log('donneeeeeeee');
            res.json('done')
            
        }
    }).clone().catch(function(err){ console.log(err)})

}
    

})



module.exports=router;
