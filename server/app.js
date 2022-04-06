

const express=require('express'),
app=express(),
cors=require('cors'),
mongoose=require("mongoose"),
mongoURI="mongodb://localhost/Local_Guide",
helmet=require('helmet'),
UserRoutes=require('./routes/UserRoutes'),
ConversationRoutes=require('./routes/ConversationRoutes'),
MessageRoutes=require('./routes/MessageRoutes');



app.use(cors({
    origin:'http://localhost:3000',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
app.use(helmet())
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api',UserRoutes);
app.use('/api/conversation',ConversationRoutes);
app.use('/api/message',MessageRoutes)



app.listen(5000,()=>{
    console.log('server has started')
})