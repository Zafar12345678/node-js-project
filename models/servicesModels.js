const mongoose = require('mongoose');

const Schema = new mongoose.Schema({

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



module.exports = mongoose.model('services', productSchema);
