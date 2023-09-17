const Product = require('../models/productModel');
const category_container = require('../controllers/categoryController');
const store_Container = require('../controllers/storeController');

// Controller function to add a review to a store
const add_product = async (req, res) => {
    try {
        var arrImages = [];
        for (let i = 0; i < req.files.length; i++) {
            arrImages[i] = req.files[i].filename;

        }
        var product = new Product({
            vender_id: req.body.vender_id,
            store_id: req.body.store_id,
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            category_id: req.body.category_id,
            sub_cat_id: req.body.sub_cat_id,
            images: arrImages,

        })
        const product_data = await product.save();

        res.status(200).json({ success: true, message: 'product successfully added', data: product_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

const get_product = async (req, res) => {
    try {
        var send_data = [];
        var cat_data = await category_container.getCategories();
        console.log("cat_data:", cat_data); // Log cat_data for debugging
        if (cat_data.length > 0) {
            for (let i = 0; i < cat_data.length; i++) {
                var product_data = [];
                var cat_id = cat_data[i]['_id'].toString();
                var cat_pro = await Product.find({ category_id: cat_id });
                console.log("cat_pro:", cat_pro); // Log cat_pro for debugging
                if (cat_pro.length > 0) {
                    for (let j = 0; j < cat_pro.length; j++) {
                        var store_data = await store_Container.get_store(cat_pro[j]['store_id']);
                        console.log("store_data:", store_data); // Log store_data for debugging
                        product_data.push(
                            {
                                "product_name": cat_pro[j]['name'],
                                "images": cat_pro[j]['images'],
                                "store_details": store_data['address'],
                            }
                        );
                    }
                    send_data.push({
                        "category": cat_data[i]['category'],
                        "product": product_data,
                    });
                }
            }
            res.status(200).json({ success: true, message: 'product successfully added', data: send_data });
        } else {
            res.status(200).json({ success: false, message: 'No categories found', data: send_data });
        }
    } catch (error) {
        console.error("Caught error:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
}



module.exports = {
    add_product,
    get_product,
    get_product
};
