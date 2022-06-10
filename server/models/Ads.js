var mongoose=require("mongoose");

var adSchema=new mongoose.Schema({
	arriving_date_year:{type:Number, required:true},
    arriving_date_month:{type:Number, required:true},
    arriving_date_day:{type:Number, required:true},
    leaving_date_year: {type:Number, required:true},
    leaving_date_month: {type:Number, required:true},
    leaving_date_day: {type:Number, required:true},
    country:{type:String, required:true},
    state: {type:String, required: true},
    city:{type:String, required:true},
    owner_gender:{type:String}, 
    owner_email:{type:String},
    owner_age:{type:Number},  
    owner_id: {type:String},
    description: {type:String, required:true},
    host: {type:String, required:true},
    maxPeople: {type:Number, required:true},
    maxTimeHour: {type: Number, required:true},
    maxTimeMinute: {type: Number, required:true},
    maxTimeOfAd: {type: Number, required: true},
    minTimeHour: {type:Number, required:true},
    minTimeMinute: {type:Number, required:true},
    minTimeOfAd: {type: Number, required: true},
    appliedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserData'
    }],
    acceptedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserData'
    }],
    bannedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserData'
    }],
    isActive: {type:Boolean, default:true}
    	
},{collection:'adData'});

adSchema.methods.isDateActive = function(){
    let currentDate = new Date().toISOString().slice(0, 10);
    let currentYear = parseInt(currentDate.substring(0,4))
    let currentMonth = parseInt(currentDate.substring(5,7))
    let currentDay = parseInt(currentDate.substring(8,10))
    let currentHour = new Date().getHours();
    let currentMinute = new Date().getMinutes();

    if(this.arriving_date_year > currentYear){
        return true;
    }

    if(this.arriving_date_year === currentYear && this.arriving_date_month > currentMonth){
        return true;
    }

    if(this.arriving_date_year === currentYear && this.arriving_date_month === currentMonth && this.arriving_date_day > currentDay){
        return true;
    }
    
    if(this.arriving_date_year === currentYear && this.arriving_date_month === currentMonth && this.arriving_date_day === currentDay && 
        this.minTimeHour > currentHour) {
            return true;
        }

    if(this.arriving_date_year === currentYear && this.arriving_date_month === currentMonth && this.arriving_date_day === currentDay && 
        this.minTimeHour === currentHour && this.minTimeMinute > currentMinute) {
            return true;
        }
        this.isActive = false;

    return this.isActive;
}

module.exports=mongoose.model("AdData",adSchema);