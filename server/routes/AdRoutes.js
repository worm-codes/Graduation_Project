const express = require('express'),
router = express.Router(),
Ad = require('../models/Ads'),
User = require('../models/User'),
MiddleWare = require('../middleware/CheckAuth');
var store = require('store')


router.post('/publish', async(req,res) =>{
    try{
        let theEmail = req.body.userToProcess.email;
        const { arrivingDateYear, arrivingDateMonth, arrivingDateDay,
                leavingDateYear, leavingDateMonth, leavingDateDay,
             city, country, description, host, maxPeopleToPass,
              minTimeHourToPass, minTimeMinuteToPass, maxTimeHourToPass, maxTimeMinuteToPass, minTimeTotal, maxTimeTotal, state, userToProcess } = req.body;
        let theUser = await User.findOne({user_email:theEmail})
        theUserAge = new Date().getFullYear() - parseInt(theUser.user_date_of_birth.substring(0,4).toString());

        console.log("Inside try block of /publish")
    
    const theAd = await new Ad({ arriving_date_year: arrivingDateYear, arriving_date_month: arrivingDateMonth,
            arriving_date_day: arrivingDateDay, city: city, country, description, host, leaving_date_year:leavingDateYear,
            leaving_date_month: leavingDateMonth, leaving_date_day: leavingDateDay, maxPeople: maxPeopleToPass, minTimeHour: minTimeHourToPass,
            maxTimeHour: maxTimeHourToPass, minTimeMinute: minTimeMinuteToPass, maxTimeMinute: maxTimeMinuteToPass,state,
            owner_gender:theUser.user_gender,owner_email: theUser.user_email, owner_age: theUserAge, owner_id: theUser._id,
            minTimeOfAd: minTimeTotal, maxTimeOfAd: maxTimeTotal})

        console.log("Newly created theAd variable", theAd)
    theUser.user_ads.push(theAd);
    await theAd.save();
    await theUser.save();
    res.json(theAd)

}
    catch(err){
    console.log(err)
    res.json('error')
}
})

router.post('/searchresult', async(req,res) => {
    try {

        const { arrivingDateYear, arrivingDateMonth, arrivingDateDay, leavingDateYear, leavingDateMonth, leavingDateDay,
             city, country, host, maxPeopleToPass, minTimeHourToPass, minTimeMinuteToPass, maxTimeHourToPass, maxTimeMinuteToPass,
              state, gender, minAge, maxAge, minTimeTotal, maxTimeTotal } = req.body;
              let theAds = [];
              let finalAds = [];
              

                if(minTimeHourToPass !== null && arrivingDateDay !== null){
                    theAds = await Ad.find({
                        $and: [
                            { owner_age: {$gte : minAge}, owner_age: {$lte: maxAge},  arriving_date_day: {$gte:arrivingDateDay}, 
                            minTimeOfAd : {$gte: minTimeTotal}, maxTimeOfAd: {$lte: maxTimeTotal}, leaving_date_day: {$lte: leavingDateDay} }
                        ],
                        arriving_date_year: arrivingDateYear, arriving_date_month: arrivingDateMonth,leaving_date_year: leavingDateYear,
                         leaving_date_month: leavingDateMonth,city: city, state: state, country: country, host: host, maxPeople: maxPeopleToPass, owner_gender: gender
                    })
                }
                if(minTimeHourToPass === null && arrivingDateDay !== null){
                    theAds = await Ad.find({
                        $and: [
                            { owner_age: {$gte : minAge}, owner_age: {$lte: maxAge}, arriving_date_day: {$gte:arrivingDateDay},leaving_date_day: {$lte: leavingDateDay} }
                        ],
                        arriving_date_year: arrivingDateYear, arriving_date_month: arrivingDateMonth,leaving_date_year: leavingDateYear,
                         leaving_date_month: leavingDateMonth,city: city, state: state, country: country, host: host, maxPeople: maxPeopleToPass, owner_gender: gender
                    })
                }
                if(arrivingDateDay === null && minTimeHourToPass !== null){
                    theAds = await Ad.find({
                        $and: [
                            { owner_age: {$gte : minAge}, owner_age: {$lte: maxAge},
                            minTimeOfAd: {$gte: minTimeTotal}, maxTimeOfAd: {$lte: maxTimeTotal}
                            }
                        ],
                       city: city, state: state, country: country, host: host, maxPeople: maxPeopleToPass, owner_gender: gender
                    })
                }
                if(arrivingDateDay === null && minTimeHourToPass === null){
                    theAds = await Ad.find({
                        $and: [
                            { owner_age: {$gte : minAge}, owner_age: {$lte: maxAge} }
                        ],
                        city: city, state: state, country: country, host: host, maxPeople: maxPeopleToPass, owner_gender: gender
                    })
                }
                  for(let ad of theAds){
                    if(ad.isActive === true && ad.isDateActive() === true){
                        finalAds.push(ad);
                    }
                  }
                  //store.clearAll();
                  store.set('advertisements', JSON.stringify(finalAds))
                console.log("theAds variable:", finalAds)     
                res.json(finalAds);    
     }
    catch(e) {
        console.log("error occured!", e)
    }
})


router.get('/searchresult', async(req,res) => {

    if(store.get('advertisements') === undefined){
        return res.json('undefined string')
    }
    let searchedAds = JSON.parse(store.get('advertisements'));

    res.json(searchedAds);

    store.clearAll(); // this code prevents other users from seeing the filtered advertisements of other users.

})


router.get('/myads', MiddleWare.isAuth, async(req,res) => {
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    let userAdArr = []
    for(let ad of user.user_ads){
         let temp = await Ad.findById(ad._id)
         if(temp !== null && temp.isDateActive() === true){
            userAdArr.push(temp)
         }      
    }
    res.send([userAdArr])
})

router.put('/myads', async(req,res) => {
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    const { adID } = req.body;
    // console.log("adID to update isActive status",adID)
    await Ad.findByIdAndUpdate({_id: adID}, { isActive : false});
    let adsToReturn = await user.populate('user_ads');
    let arrayToReturn = []
    
    for(let ads of adsToReturn.user_ads) {
        if(ads.isActive === true && ads.isDateActive() === true){
            arrayToReturn.push(ads)
         }    
    }
    // console.log("arrayToReturn var in myads put:",arrayToReturn)
     res.json(arrayToReturn)

})

router.get('/mypastads', MiddleWare.isAuth, async(req,res) => {
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    let userAdArr = []
    let arrayToPass = []
    userAdArr = await user.populate('user_ads');
    for(let ad of userAdArr.user_ads){
        let temp = await Ad.findById(ad._id)
         if(temp.isActive === false || temp.isDateActive() === false){
            arrayToPass.push(temp)
         }          
    }
    //console.log(userAdArr.user_ads)
    // console.log("userAdArr var in mypastads",userAdArr)
    res.send([arrayToPass])
})

router.delete('/mypastads/:adid', MiddleWare.isAuth, async(req,res) => {
    try{
        const { adid } = req.params;
    
        let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
        let adToBeDeleted = await Ad.findById(adid);

        if(adToBeDeleted.isDateActive()){

        let adToBeDeletedPopulatedAppliedUsers = await adToBeDeleted.populate('appliedUsers');
        let adToBeDeletedPopulatedAcceptedUsers = await adToBeDeletedPopulatedAppliedUsers.populate('acceptedUsers');
        let adToBeDeletedPopulatedBannedUsers = await adToBeDeletedPopulatedAcceptedUsers.populate('bannedUsers');

        console.log("adToBeDeleted var:", adToBeDeleted)
        console.log("adToBeDeletedPopulatedBannedUsers var:", adToBeDeletedPopulatedBannedUsers)
        let adToBeDeletedsAcceptedUsers = [];
        for(let i = 0; i < adToBeDeletedPopulatedBannedUsers.acceptedUsers.length; i++){
            adToBeDeletedsAcceptedUsers.push(await User.findById(adToBeDeletedPopulatedBannedUsers.acceptedUsers[i]._id))
        }
        
        for(let i = 0; i < adToBeDeletedsAcceptedUsers.length; i++){
            await User.findByIdAndUpdate({_id : adToBeDeletedsAcceptedUsers[i]._id}, {$pull: { acceptedAds: adid  }})
        }

        let adToBeDeletedsAppliedUsers = [];
        for(let i = 0; i < adToBeDeletedPopulatedBannedUsers.appliedUsers.length; i++){
            adToBeDeletedsAppliedUsers.push(await User.findById(adToBeDeletedPopulatedBannedUsers.appliedUsers[i]._id))
        }

        for(let i = 0; i < adToBeDeletedsAppliedUsers.length; i++){    
            await User.findByIdAndUpdate({_id : adToBeDeletedsAppliedUsers[i]._id}, {$pull: { appliedAds: adid  }})
        }

        let adToBeDeletedsBannedUsers = [];
        for(let i = 0; i < adToBeDeletedPopulatedBannedUsers.bannedUsers.length; i++){
            adToBeDeletedsBannedUsers.push(await User.findById(adToBeDeletedPopulatedBannedUsers.bannedUsers[i]._id))
        }

        for(let i = 0; i < adToBeDeletedsBannedUsers.length; i++){    
            await User.findByIdAndUpdate({_id : adToBeDeletedsBannedUsers[i]._id}, {$pull: { bannedAds: adid  }})
        }

        await User.findByIdAndUpdate({_id : user._id}, {$pull: { user_ads: adid}})
        await Ad.findByIdAndUpdate({_id : adToBeDeleted._id}, {$pull: { acceptedUsers: { $exists: true } }})
        await Ad.findByIdAndUpdate({_id : adToBeDeleted._id}, {$pull: { appliedUsers: { $exists: true } }})
        await Ad.findByIdAndUpdate({_id : adToBeDeleted._id}, {$pull: { bannedUsers: { $exists: true } }})
        
        let deletedOne = await Ad.findByIdAndDelete(adid);

        //store.clearAll() fonksiyonunu çalıştırmam gerekebilir. Çünkü store'da en son bu silinen advertisement vardı.
        let adOwner = user;
        res.json({adOwner, message:'ad has been deleted'})
    }
    } catch {
        res.json("Could not delete the ad")
    }
   
})

router.post('/searchresult/:adid', async(req,res) => {
    const { adid } = req.params;
    let foundAd = await Ad.findById(adid);
    foundAd = await foundAd.populate('appliedUsers');
    await foundAd.save();
    let adOwner = await User.findById(foundAd.owner_id)
    // res.json({adver: foundAd, owner: adOwner})
    store.clearAll();
    store.set('theAdvertisement', JSON.stringify({foundAd, adOwner}))
    res.sendStatus(200);
})

router.get('/searchresult/:adid', async(req,res) => {	
    //let theAdToShow = JSON.parse(store.get('theAdvertisement'));	
    // console.log(req.params.adid);	
    let theTrueAd = await Ad.findById(req.params.adid);	
    let theAdToPass = await theTrueAd.populate('acceptedUsers');	
    let finalTheAdToPass = await theAdToPass.populate('appliedUsers');	
    let realFinalTheAdToPass = await finalTheAdToPass.populate('bannedUsers');	
    let foundAd = realFinalTheAdToPass;	
    let adOwner = await User.findById(theTrueAd.owner_id);	
    // console.log(theTrueAd);	
    	
    res.json({foundAd, adOwner});	
    // store.clearAll();	
    	
})

router.post('/searchresult/:adid/:userid', async(req,res) => {
    const { adid, userid} = req.params;
    let theFoundAd = await Ad.findById(adid);
    let adOwner = await User.findById(theFoundAd.owner_id);
    let appliedUser = await User.findById(userid);

    if(theFoundAd.appliedUsers.length <= theFoundAd.maxPeople && !theFoundAd.bannedUsers.includes(userid) &&
        !theFoundAd.appliedUsers.includes(userid) && !appliedUser.appliedAds.includes(adid)) {

        let populatedAppliedUser = await appliedUser.populate('appliedAds');
        let foundAd = await theFoundAd.populate('appliedUsers')
     
        appliedUser.appliedAds.push(theFoundAd);
        theFoundAd.appliedUsers.push(appliedUser)
        await appliedUser.save();
        await theFoundAd.save();
        store.set('theAdvertisement', JSON.stringify({foundAd, adOwner}))
        res.json({foundAd,adOwner,populatedAppliedUser})      
    }
    else {
        res.json("User has already applied for this ad or can't apply for this ad.")
    }   
})

router.put('/searchresult/:adid/:userid/accept', async(req,res) => {
    const { adid, userid} = req.params;
    let theFoundAd = await Ad.findById(adid);
    let adOwner = await User.findById(theFoundAd.owner_id);
    let appliedUser = await User.findById(userid);

    if(theFoundAd.acceptedUsers.length <= theFoundAd.maxPeople && !theFoundAd.bannedUsers.includes(userid) &&
        !theFoundAd.acceptedUsers.includes(userid) && !appliedUser.acceptedAds.includes(adid) &&
         theFoundAd.appliedUsers.includes(userid) && appliedUser.appliedAds.includes(adid)){

    await User.findByIdAndUpdate({_id : appliedUser._id}, {$pull: { appliedAds: adid}})
    await Ad.findByIdAndUpdate({_id : theFoundAd._id}, {$pull: { appliedUsers: appliedUser._id}})
    await appliedUser.save();
    await theFoundAd.save();

    let initialPopulatedAcceptedUser = await appliedUser.populate('appliedAds');
    let initialFoundAd = await theFoundAd.populate('appliedUsers');
    let populatedAcceptedUser = await initialPopulatedAcceptedUser.populate('acceptedAds');
    let foundAd = await initialFoundAd.populate('acceptedUsers');
    
    populatedAcceptedUser.acceptedAds.push(theFoundAd);
    //önceki hali bu
    // foundAd.acceptedUsers.push(appliedUser);
    foundAd.acceptedUsers.push(populatedAcceptedUser);

    await appliedUser.save();
    await theFoundAd.save();

    let finalAdArrToPass = await Ad.findById(adid).populate('acceptedUsers');
    let realFinalAdArrToPass = await finalAdArrToPass.populate('appliedUsers');
    let lastRealFinalAdArrToPass = await realFinalAdArrToPass.populate('acceptedUsers')
    let theTrueLastAdArrToPass = await lastRealFinalAdArrToPass.populate('bannedUsers')
    foundAd = theTrueLastAdArrToPass;
    
    // console.log("lastRealFinalAdArrToPass:", lastRealFinalAdArrToPass)
    
    store.clearAll();
    store.set('theAdvertisement', JSON.stringify({foundAd, adOwner}))
    res.json({foundAd, adOwner})
}
else {
    res.json("User has already been accepted for this ad or can't apply for this ad.")  
}

})

router.put('/searchresult/:adid/:userid/decline', async(req,res) => {
    const { adid, userid} = req.params;
    let theFoundAd = await Ad.findById(adid);
    let adOwner = await User.findById(theFoundAd.owner_id);
    let appliedUser = await User.findById(userid);


    if(!theFoundAd.bannedUsers.includes(userid)){
        if((theFoundAd.appliedUsers.includes(userid) && appliedUser.appliedAds.includes(adid))) {
   
    await User.findByIdAndUpdate({_id : appliedUser._id}, {$pull: { appliedAds: adid}})
    await Ad.findByIdAndUpdate({_id : theFoundAd._id}, {$pull: { appliedUsers: appliedUser._id}})
    await appliedUser.save();
    await theFoundAd.save();

    let initialPopulatedAcceptedUser = await appliedUser.populate('appliedAds');
    let initialFoundAd = await theFoundAd.populate('appliedUsers');
    let populatedAcceptedUser = await initialPopulatedAcceptedUser.populate('acceptedAds');
    let preFoundAd = await initialFoundAd.populate('bannedUsers')
    let foundAd = await preFoundAd.populate('acceptedUsers');
    
    
    foundAd.bannedUsers.push(appliedUser);

    await appliedUser.save();
    await theFoundAd.save();

    let finalAdArrToPass = await Ad.findById(adid).populate('acceptedUsers');
    let realFinalAdArrToPass = await finalAdArrToPass.populate('appliedUsers');
    let lastRealFinalAdArrToPass = await realFinalAdArrToPass.populate('acceptedUsers')
    let theTrueLastAdArrToPass = await lastRealFinalAdArrToPass.populate('bannedUsers')
    foundAd = theTrueLastAdArrToPass;
    
    // console.log("theTrueLastAdArrToPass inside applied user condition:", theTrueLastAdArrToPass)
    
    store.clearAll();
    store.set('theAdvertisement', JSON.stringify({foundAd, adOwner}))
    res.json({foundAd, adOwner})
}
    else if(theFoundAd.acceptedUsers.includes(userid) && appliedUser.acceptedAds.includes(adid)) {

        await User.findByIdAndUpdate({_id : appliedUser._id}, {$pull: { acceptedAds: adid}})
        await Ad.findByIdAndUpdate({_id : theFoundAd._id}, {$pull: { acceptedUsers: appliedUser._id}})
        await appliedUser.save();
        await theFoundAd.save();
    
        let initialPopulatedAcceptedUser = await appliedUser.populate('appliedAds');
        let initialFoundAd = await theFoundAd.populate('appliedUsers');
        let populatedAcceptedUser = await initialPopulatedAcceptedUser.populate('acceptedAds');
        let preFoundAd = await initialFoundAd.populate('bannedUsers')
        let foundAd = await preFoundAd.populate('acceptedUsers');
        
        //populatedAcceptedUser'ı pushlamayı deneyebilirsin olmazsa...
        foundAd.bannedUsers.push(appliedUser);
    
        await appliedUser.save();
        await theFoundAd.save();
    
        let finalAdArrToPass = await Ad.findById(adid).populate('acceptedUsers');
        let realFinalAdArrToPass = await finalAdArrToPass.populate('appliedUsers');
        let lastRealFinalAdArrToPass = await realFinalAdArrToPass.populate('acceptedUsers')
        let theTrueLastAdArrToPass = await lastRealFinalAdArrToPass.populate('bannedUsers')
        foundAd = theTrueLastAdArrToPass;
        
        // console.log("theTrueLastAdArrToPass inside accepted user condition:", theTrueLastAdArrToPass)
        
        store.clearAll();
        store.set('theAdvertisement', JSON.stringify({foundAd, adOwner}))
        res.json({foundAd, adOwner})
    }
}
else {
    res.json("User has already been rejected for this ad.")  
}

})

router.get('/searchresult/:adid/:userid', async(req,res) => {
    const { adid, userid} = req.params;
    let foundAd = await Ad.findById(adid);
    let adOwner = await User.findById(foundAd.owner_id);
    let appliedUser = await User.findById(userid);

    let dataToSend = [foundAd,adOwner,appliedUser];

    res.json(dataToSend);
})


module.exports=router;