const MiddleWare = require('./middleware/CheckAuth');

const express=require('express'),
app=express(),
cors=require('cors'),
User=require('./models/User.js'),
Ad = require('./models/Ads'),
mongoose=require("mongoose"),
helmet=require('helmet'),
mongoURI="mongodb://localhost:27017/Local_Guide";
var store = require('store')
const session = require('express-session');
// mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/LocalGuide', { useNewUrlParser: true, useUnifiedTopology: true });
UserRoutes = require('./routes/UserRoutes'),
ConversationRoutes = require('./routes/ConversationRoutes'),
MessageRoutes = require('./routes/MessageRoutes');
AdRoutes = require('./routes/AdRoutes')
 




app.use(cors({
    origin:'http://localhost:3000',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))
app.use(express.json())
app.use(helmet())
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
}));
mongoose.connect('mongodb://localhost:27017/LocalGuide', { useNewUrlParser: true, useUnifiedTopology: true, ignoreUndefined: true });


app.use('/api',UserRoutes);
app.use('/api/conversation',ConversationRoutes);
app.use('/api/message',MessageRoutes);
app.use('/api/ad', AdRoutes);





app.listen(5000,()=>{
    console.log('server has started')
})