const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    category:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    image:{
        type:String,
        default:""
    },

    duration:{
        type:String,
        default:"60 Minutes"
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Service", serviceSchema);