const express=require('express');
const app=express();
const cors=require('cors'),
User=require('./models/User.js')
mongoose=require("mongoose");

app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://localhost/Local_Guide", { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/register',async (req,res)=>{
    console.log(req.body)
    try{
        await User.create({
            user_ID:req.body.user_ID,
            user_name:req.body.user_name,
            user_surname:req.body.user_surname,
            user_email:req.body.user_email,
            user_date_of_birth:req.body.user_date_of_birth,
            user_password:req.body.user_password

        })
        res.json('done bitch')
    }
    catch(err){
        console.log(err)
        res.json('something is wrong')

    }
    
})

app.listen(5000,()=>{
    console.log('server has started')
})