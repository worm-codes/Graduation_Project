const express = require('express'),
router = express.Router(),
Ad = require('../models/Ads'),
User = require('../models/User'),
MiddleWare = require('../middleware/CheckAuth');
var store = require('store')


router.post('/publish', async(req,res) =>{
    try{
        // console.log('inside the try block')
        let theEmail = req.body.userToProcess.email;
        const { arrivingDateYear, arrivingDateMonth, arrivingDateDay,
                leavingDateYear, leavingDateMonth, leavingDateDay,
             city, country, description, host, maxPeople,
              minTimeHour, minTimeMinute, maxTimeHour, maxTimeMinute, state, userToProcess } = req.body;
        let theUser = await User.findOne({user_email:theEmail})
        theUserAge = new Date().getFullYear() - parseInt(theUser.user_date_of_birth.substring(0,4).toString());
        // console.log("theEmail variable",theEmail)
        // console.log("theUser variable",theUser)
        let minTimeFinal = (minTimeHour * 60) + (minTimeMinute);
        let maxTimeFinal = (maxTimeHour * 60) + (maxTimeMinute);
    
    const theAd = await new Ad({ arriving_date_year: arrivingDateYear, arriving_date_month: arrivingDateMonth,
            arriving_date_day: arrivingDateDay, city: city, country, description, host, leaving_date_year:leavingDateYear,
            leaving_date_month: leavingDateMonth, leaving_date_day: leavingDateDay, maxPeople, minTimeHour: minTimeHour,
            maxTimeHour: maxTimeHour, minTimeMinute: minTimeMinute, maxTimeMinute: maxTimeMinute,state,
            owner_gender:theUser.user_gender,owner_email: theUser.user_email, owner_age: theUserAge, owner_id: theUser._id,
            minTimeOfAd: minTimeFinal, maxTimeOfAd: maxTimeFinal})

    await theUser.populate('user_ads');


    theUser.user_ads.push(theAd);
    await theAd.save();
    await theUser.save();

        res.json('success')
        //res.redirect('/myads')
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
    // let counter = 0;
    // let copyArr = [];
    // let searchedAds = [];
    // let theResponse = store.get('advertisements')
    // console.log("theResponse",theResponse)
    // if(theResponse !== undefined && theResponse.length > 0){
    //     console.log("JSON PARSE THE RESPONSE",JSON.parse(theResponse))
    //     searchedAds = JSON.parse(theResponse);
    //     copyArr = searchedAds.map(adv => {return {...adv}});
    //     res.json(searchedAds)
    // }
    // else {
    //     console.log("copyArr when no post req is sent:", copyArr)
    //     res.json(copyArr)
    // }
    // store.each(function(value, key) {
    //     console.log(key, '==', value)
    // })
    if(store.get('advertisements') === undefined){
        return res.json('undefined string')
    }
    let searchedAds = JSON.parse(store.get('advertisements'));

    res.json(searchedAds);

    store.clearAll();

    // let adsToCheck = JSON.parse();
    // console.log("searchedAds:", searchedAds)
    // if(adsToCheck !== undefined && adsToCheck.length > 0){
    //     searchedAds = adsToCheck.map(ad => {return {...ad}});
    //     copyArr = searchedAds.map(adv => {return {...adv}});
    //     // counter++;
    // }
    
    // console.log("copyArr:", copyArr)
    // if(searchedAds.length > 0){
    //     res.json(searchedAds)
    // }
    // else {
    //     res.json(copyArr)
    // }
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
    console.log("adID to update isActive status",adID)
    await Ad.findByIdAndUpdate({_id: adID}, { isActive : false});
    let adsToReturn = await user.populate('user_ads');
    let arrayToReturn = []
    
    for(let ads of adsToReturn.user_ads) {
        if(ads.isActive === true && ads.isDateActive() === true){
            arrayToReturn.push(ads)
         }    
    }
    console.log("arrayToReturn var in myads put:",arrayToReturn)
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
    const { adid } = req.params;
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    console.log("adID to be deleted:", adid)

    await User.findByIdAndUpdate({_id : user._id}, {$pull: { user_ads: adid}})
    
    let deletedOne = await Ad.findByIdAndDelete(adid);

    console.log("deletedOne var:", deletedOne)
        // NOT: BAŞVURANLAR, KABUL ALANLAR ARRAY'I YARATILDIKTAN SONRA BURASI DEĞİŞECEK.
    // AD'I SİLMEDEN ÖNCE, USERLARIN "BAŞVURDUKLARIM" ARRAY'INDAN PULL İLE ÇIKARTILACAK
    // AD'I SILMEDEN ONCE, USERLARIN "KABUL ALDIKLARIM" ARRAY'INDAN PULL İLE ÇIKARTILACAK
    //let theAdToChange = await Ad.findByIdAndUpdate({_id: adID}, { isActive : false});
    res.json(deletedOne)
})

router.post('/searchresult/:adid', async(req,res) => {
    const { adid } = req.params;
    let foundAd = await Ad.findById(adid);
    let adOwner = await User.findById(foundAd.owner_id)
    // res.json({adver: foundAd, owner: adOwner})
    store.clearAll();
    store.set('theAdvertisement', JSON.stringify({foundAd, adOwner}))
    res.sendStatus(200);
})

router.get('/searchresult/:adid', async(req,res) => {
    let theAdToShow = JSON.parse(store.get('theAdvertisement'));
    res.json(theAdToShow);
    
})


module.exports=router;