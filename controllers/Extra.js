const Store = require('../models/storeModel');
const User = require('../models/authModel');

const updateAverageRating = async (storeId) => {
    try {
        const store = await Store.findById(storeId);
        if (!store) {
            console.error(`Store with ID ${storeId} not found.`);
            return;
        }

        // Calculate the average rating based on existing reviews
        const totalReviews = store.reviews.length;
        const sumRatings = store.reviews.reduce((total, review) => total + review.rating, 0);
        const averageRating = totalReviews === 0 ? 0 : sumRatings / totalReviews;

        // Update the store's averageRating field
        store.averageRating = averageRating;
        await store.save();

        console.log(`Average rating updated for store with ID ${storeId}: ${averageRating}`);
    } catch (error) {
        console.error(`Error updating average rating for store with ID ${storeId}: ${error.message}`);
    }
};

const create_store = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.body.vender_id });
        const logo = req.files['logo'][0].filename;

        if (userData) {
            if (!req.body.latitude || !req.body.longitude) {
                res.status(200).json({ success: false, message: 'latitude and longitude must be required' });
            } else {
                const venderData = await Store.findOne({ vender_id: req.body.vender_id });
                if (venderData) {
                    res.status(400).json({ success: false, message: 'This vender already created a store' });
                } else {
                    const storeInstance = new Store({
                        category: req.body.category,
                        vender_id: req.body.vender_id,
                        logo,
                        business_email: req.body.business_email,
                        address: req.body.address,
                        pin: req.body.pin,
                        city: req.body.city,
                        state: req.body.state,
                        country: req.body.country,
                        location: {
                            type: 'Point', // Use "Point" with an uppercase 'P'
                            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
                        },
                    });

                    const storeData = await storeInstance.save();

                    // Calculate the average rating when a new store is created
                    await updateAverageRating(storeData._id);

                    res.status(200).json({ success: true, message: 'Store Data', data: storeData });
                }
            }
        } else {
            res.status(400).json({ success: false, message: 'vender id does not exist' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', msg: error.message });
    }
};

const find_near_store = async (req, res) => {
    try {
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        const category = req.body.category;
        const name = req.body.address;

        const pipeline = [
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    key: 'location',
                    maxDistance: 100 * 1000,
                    distanceField: 'dist.calculated',
                    spherical: true,
                },
            },
            {
                $match: {
                    category: category,
                    address: { $regex: new RegExp(name, 'i') },
                },
            },
        ];

        const store_data = await Store.aggregate(pipeline);

        if (store_data.length === 0) {
            return res.status(404).json({ success: false, message: 'No stores found within 10 kilometers of the specified location with the given category and filters' });
        }

        store_data.forEach(store => {
            const distanceInKilometers = Math.round(store.dist.calculated / 1000);
            const distanceInMeters = Math.round(store.dist.calculated);

            store.dist.calculatedInKilometers = `${distanceInKilometers} km`;
            store.dist.calculatedInMeters = `${distanceInMeters} m`;
        });

        res.status(200).json({ success: true, message: 'Stores found within 10 kilometers of the specified coordinates with the given category and filters', data: store_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', msg: error.message });
    }
};




const get_store=async(id)=>{
    try {
        return Store.findOne({_id:id});
    } catch (error) {
        res.status.send(error.message)
    }
}






module.exports = {
    create_store,
    find_near_store,
    get_store
};
