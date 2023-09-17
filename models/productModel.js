const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    vender_id: {
        type: String,
        required: true,
    },
    store_id: {
        type: String,
        required: true,
    },
    name: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: String,
        required: true,
    },
    category_id: {
        type: String,
        required: true,
    },
    sub_cat_id: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
        // validate:[arrayLimit, 'only pass 5 image']
    },

}, {
    timestamps: true,
});

// function arrayLimit(val){
//     return val.lenght >=5;
// }

module.exports = mongoose.model('Product', productSchema);
