const MiddleWare = require('./middleware/CheckAuth');

const express=require('express'),
app=express(),
cors=require('cors'),
User=require('./models/User.js'),
Ad = require('./models/Ads'),
mongoose=require("mongoose"),
mongoURI="mongodb://localhost:27017/Local_Guide";
var store = require('store')
const session = require('express-session');
// mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/LocalGuide', { useNewUrlParser: true, useUnifiedTopology: true });

 




app.use(cors({
    origin:'http://localhost:3000',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
}));
mongoose.connect('mongodb://localhost:27017/LocalGuide', { useNewUrlParser: true, useUnifiedTopology: true, ignoreUndefined: true });



app.post('/api/getUser',MiddleWare.isAuth,async (req,res)=>{   
     let foundedUser=null
   
     if(MiddleWare.decodeValue){
       foundedUser=await User.findOne({user_email:MiddleWare.decodeValue.email})
     
         if(foundedUser){
        let timeSignIn=(req.body.user_last_sign_in?.split(' GMT')[0])
        let timeCreation=(req.body.createdAt?.split(' GMT')[0])
       
        if(!foundedUser.createdAt){
         await User.findByIdAndUpdate({_id:foundedUser._id},{createdAt:timeCreation})
        }
         
        await User.findByIdAndUpdate({_id:foundedUser._id},{lastSignIn:timeSignIn})
      
        res.json(foundedUser)
            }
            else{
                res.json('couldnt find')
            }
        }
        else{
            res.json('UnAuth')
        }

 })

app.post('/api/register',async (req,res)=>{
    console.log('helllooooooo')
    let checkForId=await User.findOne({user_ID:req.body.user_ID})
    console.log(checkForId)
    console.log(req)
    if(checkForId){
        return res.json('duplicate')
    }
         console.log('yaratmadan once')
        try{
            console.log('yaratiyor')
        let theNewUser = await User.create({
            user_ID:req.body.user_ID,
            user_name:req.body.user_name,
            user_surname:req.body.user_surname,
            user_gender:req.body.user_gender,
            user_email:req.body.user_email,
            user_date_of_birth:req.body.user_date_of_birth,
        })
       res.json('success')
       console.log(theNewUser)
    }
    catch(err){
        console.log(err)
        res.json('error')
    }
})

app.post('/api/publish', async(req,res) =>{
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
    
    const theAd = await new Ad({ arriving_date_year: arrivingDateYear, arriving_date_month: arrivingDateMonth,
            arriving_date_day: arrivingDateDay, city: city, country, description, host, leaving_date_year:leavingDateYear,
            leaving_date_month: leavingDateMonth, leaving_date_day: leavingDateDay, maxPeople, minTimeHour: minTimeHour,
            maxTimeHour: maxTimeHour, minTimeMinute: minTimeMinute, maxTimeMinute: maxTimeMinute,state,
            owner_gender:theUser.user_gender,owner_email: theUser.user_email, owner_age: theUserAge, owner_id: theUser._id})

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

app.post('/api/searchresult', async(req,res) => {
    try {

        // console.log(req.body);

        // let theAds = await Ad.find({
                //     $or: [{ $and : [ {owner_age: {$gte : minAge}}, {owner_age: {$lte: maxAge}}] ,
                //             $and : [ {arrivingDateDay: { $ne: null }}, {arriving_date_day: {$gte:arrivingDateDay}}],
                //             arrivingDateMonth: {$ne:null},
                //             arrivingDateYear: {$ne:null},
                //             $and : [ {leavingDateDay: { $ne: null }}, {leaving_date_day: {$lte: leavingDateDay}}],
                //             leavingDateMonth:{$ne:null},
                //             leavingDateYear: {$ne:null},
                //             $and : [ {minTimeHourToPass: { $ne: null }}, {minTimeHour: {$gte: minTimeHourToPass}}],
                //             $and : [ {minTimeMinuteToPass: { $ne: null }}, {minTimeMinute: {$gte: minTimeMinuteToPass}}],
                //             $and : [ {maxTimeHourToPass: { $ne: null }}, {maxTimeHour: {$lte: maxTimeHourToPass}}],
                //             $and : [ {maxTimeMinuteToPass: { $ne: null }}, {maxTimeMinute: {$lte: maxTimeMinuteToPass}}],
                //             maxPeople: {$gte: maxPeopleToPass},
                //             city: city, state: state, country: country, host: host, owner_gender: gender                                    
                //     }],                 
                // })
        
        const { arrivingDateYear, arrivingDateMonth, arrivingDateDay, leavingDateYear, leavingDateMonth, leavingDateDay,
             city, country, host, maxPeopleToPass, minTimeHourToPass, minTimeMinuteToPass, maxTimeHourToPass, maxTimeMinuteToPass,
              state, gender, minAge, maxAge } = req.body;
              let theAds = [];

                if(minTimeHourToPass !== null && arrivingDateDay !== null){
                    theAds = await Ad.find({
                        $and: [
                            { owner_age: {$gte : minAge}, owner_age: {$lte: maxAge},  arriving_date_day: {$gte:arrivingDateDay}, 
                            minTimeHour: {$gte: minTimeHourToPass}, maxTimeHour: {$lte: maxTimeHourToPass},
                            minTimeMinute: {$gte: minTimeMinuteToPass}, maxTimeMinute: {$lte: maxTimeMinuteToPass}, leaving_date_day: {$lte: leavingDateDay} }
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
                            minTimeHour: {$gte: minTimeHourToPass}, maxTimeHour: {$lte: maxTimeHourToPass},
                            minTimeMinute: {$gte: minTimeMinuteToPass}, maxTimeMinute: {$lte: maxTimeMinuteToPass} }
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
 
                  store.clearAll();
                  store.set('advertisements', JSON.stringify(theAds))
                //  console.log("providedData:",providedData);
                console.log("theAds variable:", theAds)     
                res.json(theAds);    
     }
    catch(e) {
        console.log("error occured!", e)
    }
})



app.get('/api/searchresult', async(req,res) => {
    let searchedAds = JSON.parse(store.get('advertisements'));
    res.send(searchedAds)
})


app.get('/api/myads', MiddleWare.isAuth, async(req,res) => {
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    let userAdArr = []
    for(let ad of user.user_ads){
         let temp = await Ad.findById(ad._id)
         if(temp !== null){
            userAdArr.push(temp)
         }      
    }
    res.send([userAdArr])
})

app.put('/api/myads', async(req,res) => {
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    // console.log("user variable",user)
    const { adID } = req.body;
    let theAdToChange = await Ad.findByIdAndUpdate({_id: adID}, { isActive : false});
    // console.log("the clicked ads id:", adID)
    let adsToReturn = await user.populate('user_ads');
    // console.log("user ads",adsToReturn)
     res.json(adsToReturn)

})

app.get('/api/mypastads', MiddleWare.isAuth, async(req,res) => {
    let user=await User.findOne({user_email:MiddleWare.decodeValue.email})
    let userAdArr = []
    for(let ad of user.user_ads){
         let temp = await Ad.findById(ad._id)
         if(temp !== null && temp.isActive === false){
            userAdArr.push(temp)
         }      
    }
    res.send([userAdArr])
})

app.delete('/api/mypastads/:adid', MiddleWare.isAuth, async(req,res) => {
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

app.listen(5000,()=>{
    console.log('server has started')
})