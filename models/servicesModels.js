const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

    category: {
        type: String,
        required: true,
    },


    servicename: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        // required: true,
    },
    totalservices: {
        type: Number,
        required: true,
    },
   
    images: {
        type: String,
        required: true,
       
    },

}, {
    timestamps: true,
});



module.exports = mongoose.model('totalservices', serviceSchema);
