const admin=require('../config/firebase-config')
const MiddleWare={}
     MiddleWare.decodeValue=null;
     MiddleWare.isAuth= async(req,res,next)=>{
     
      const token=req.headers?.authorization?.split(' ')[1];
     
   
      if(token){
        
      try{
          
      MiddleWare.decodeValue=await admin.auth().verifyIdToken(token);
  
      
      if(MiddleWare.decodeValue){
          return next();
      }
      else{
          res.json({message:'UnAuth'})
      }
    }
    catch(err){
        console.log(err);
    }
}
else{
     res.json({message:'UnAuth'})
}
}


module.exports=MiddleWare;