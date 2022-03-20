const express=require('express');
const app=express();
const cors=require('cors'),
mongoose=require("mongoose");

app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://localhost/Local_Guide", { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/register',(req,res)=>{
    console.log(req.body)
    res.json('done bitch')
})

app.listen(5000,()=>{
    console.log('server has started')
})