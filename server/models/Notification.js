const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(

    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true,
        },

        title:{
            type:String,
            required:[true,"Notification title is required"],
            trim:true,
        },

        message:{
            type:String,
            required:[true,"Notification message is required"],
            trim:true,
        },

        link:{
            type:String,
            trim:true,
            default:"",
        },

        type:{
            type:String,

            enum:[
                "success",
                "info",
                "warning",
                "error",
            ],

            default:"info",
        },

        isRead:{
            type:Boolean,
            default:false,
        },
    },

    {
        timestamps:true,
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);