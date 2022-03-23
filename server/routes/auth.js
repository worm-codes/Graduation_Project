const router=require('express').Router();
const passport=require('passport');
const client_URL='http://localhost:3000/'

router.get('/login/success',(req,res)=>{
    if(req.user){
    res.status(200).json({
        success:true,
        message:'DONE!!!',
        user:req.user
      
    })
}
})

router.get('/login/failed',(req,res)=>{
    res.status(401).json({
        success:false,
        message:'something wrong'
    })
})

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect(client_URL);
})

router.get('/google',passport.authenticate('google',{scope:['profile']}));
router.get('/google/callback',passport.authenticate('google',{
successRedirect:client_URL,
failureRedirect:'/login/failed'
}))

module.exports=router;