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
mongoose.connect('mongodb://localhost:27017/LocalGuide', { useNewUrlParser: true, useUnifiedTopology: true });



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
        console.log('inside the try block')
        let theEmail = req.body.userToProcess.email;
        const { arrivingDateYear, arrivingDateMonth, arrivingDateDay,
                leavingDateYear, leavingDateMonth, leavingDateDay,
             city, country, description, host, maxPeople,
              minTimeHour, minTimeMinute, maxTimeHour, maxTimeMinute, state, userToProcess } = req.body;
        let theUser = await User.findOne({user_email:theEmail})
        theUserAge = new Date().getFullYear() - parseInt(theUser.user_date_of_birth.substring(0,4).toString());
        console.log("theEmail variable",theEmail)
        console.log("theUser variable",theUser)
    
    const theAd = await new Ad({ arriving_date_year: arrivingDateYear, arriving_date_month: arrivingDateMonth,
            arriving_date_day: arrivingDateDay, city: city, country, description, host, leaving_date_year:leavingDateYear,
            leaving_date_month: leavingDateMonth, leaving_date_day: leavingDateDay, maxPeople, minTimeHour: minTimeHour,
            maxTimeHour: maxTimeHour, minTimeMinute: minTimeMinute, maxTimeMinute: maxTimeMinute,state,
            owner_gender:theUser.user_gender,owner_email: theUser.user_email, owner_age: theUserAge, owner_id: theUser._id})

    theUser.populate('user_ads');


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
        // let theEmail = req.body.userToProcess.email;
        
        // let allTheAds = await Ad.find({});

       
        
        // for(let adv of allTheAds){
        //    if(parseInt(adv.owner_age) >= minAge && parseInt(adv.owner_age) <= maxAge && parseInt(adv.maxTime.substring(0,2)) >= parseInt(maxTime.substring(0,2)) && parseInt(adv.maxTime.substring(3,5)) >= parseInt(adv.maxTime.substring(3,5))
        //      && adv.country === countryy && adv.state === statee && adv.city === cityy && adv.owner_gender === gender && adv.host === host
        //      && adv.leaving_date === leaving && adv.arriving_date === arriving && adv.maxPeople === maxPeople) {
                 
        //     filteredAds.push(adv);
            
        //    } 
        // }
        const { arrivingDateYear, arrivingDateMonth, arrivingDateDay, leavingDateYear, leavingDateMonth, leavingDateDay,
             city, country, host, maxPeople, minTimeHour, maxTimeHour, minTimeMinute, maxTimeMinute, state, gender, minAge, maxAge } = req.body;
       
             // I WILL IMPLEMENT THE LOGIC OF BEING ABLE TO QUERY THE DATABASE ACCORDING TO THE INPUTS THAT THE USER
             // HAS PROVIDED UNDER THE REQ.BODY, E.G. IF(REQ.BODY.GENDER === DOESN'T MATTER) THEN RUN THE QUERY WITHOUT
             // THE GENDER PROPERTY SO THAT IT RETURNS THE DOCUMENTS WITH BOTH MALE AND FEMALE VALUES OF GENDER.
             // ELSE, THAT MEANS USER HAS SELECTED EITHER FEMALE OR MALE, THEN RUN THE QUERY AS OWNER_GENDER: GENDER
        let theAds = await Ad.find({
            $and: [
                { owner_age: {$gte : minAge}, owner_age: {$lte: maxAge} }     
            ],
            arriving_date_year: arrivingDateYear, arriving_date_month: arrivingDateMonth, arriving_date_day: arrivingDateDay,
            leaving_date_year: leavingDateYear, leaving_date_month: leavingDateMonth, leaving_date_day: leavingDateDay,
            city: city, state: state, country: country, host: host, maxPeople: maxPeople, minTimeHour: minTimeHour,
            maxTimeHour: maxTimeHour, minTimeMinute: minTimeMinute, maxTimeMinute: maxTimeMinute, owner_gender: gender
        })

        // localStorage.setItem('advertisements', JSON.stringify(theAds));
        //THIS STORE.SET WORKS, BUT I WANNA TRY SESSION STORAGE SINCE IT IS A BETTER OPTION FOR MY USECASE
        // store.set('advertisements', JSON.stringify(theAds))
        req.session.advertisements = theAds;
        console.log("req.session.advertisements var inside post request:", req.session.advertisements)
        console.log("theAds variable:", theAds)
         res.json('success')
        

     }
    catch(e) {
        console.log("error occured!", e)
    }
})

7

app.get('/api/searchresult', async(req,res) => {
    // let searchedAds = JSON.parse(store.get('advertisements'));
    console.log("req.session.advertisements var inside get request:", req.session.advertisements)
      res.send(req.session.advertisements)
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
    console.log("user variable",user)
    const { adID } = req.body;
    let theAdToChange = await Ad.findByIdAndUpdate({_id: adID}, { isActive : false});
    console.log("the clicked ads id:", adID)

})

app.listen(5000,()=>{
    console.log('server has started')
})