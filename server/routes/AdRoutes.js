const express=require('express'),
router=express.Router(),
Ad=require('../models/Ads'),
User=require('../models/User'),
MiddleWare=require('../middleware/CheckAuth');



router.post('/publish', MiddleWare.isAuth, async(req,res) =>{
    try{
        console.log('inside the try block')
        let theEmail = req.body.userToProcess.email;
        let theUser = await User.find({email:theEmail})
        theUserAge = new Date().getFullYear() - theUser.user_date_of_birth.substring(0,4).toString();
        console.log("theEmail variable",theEmail)
        console.log("theUser variable",theUser)

        await Ad.create({
        arriving_date:req.body.arriving,
        city:req.body.city,
        country:req.body.country,
        owner_gender:theUser.user_gender, //buraya req.body.user_gender veya direkt user_gender gelicek
        owner_email:user_email,
        owner_age:theUserAge, 
        owner_id:theUser._id,
        description: req.body.description,
        host: req.body.host,
        leaving_date: req.body.leaving,
        maxPeople: req.body.maxPeople,
        minTime: req.body.minTime,
        maxTime: req.body.maxTime,
        state: req.body.state

    })
        res.json('success')
}
    catch(err){
    console.log(err)
    res.json('error')
}
})


module.exports=router;