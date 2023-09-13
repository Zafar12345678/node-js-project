const Store = require('../models/storeModel');
const User = require("../models/authModel")
const fs = require('fs');
const path = require('path');

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
                            type: "Point", // Use "Point" with an uppercase 'P'
                            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                        }
                    });
                    const storeData = await storeInstance.save();
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
}

const find_near_store = async (req, res) => {
    try {
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        const category = req.body.category; // Add category filtering
        // const minPrice = parseFloat(req.body.minPrice); // Parse minimum price from request body
        // const maxPrice = parseFloat(req.body.maxPrice); // Parse maximum price from request body
        // Construct the aggregation pipeline
        const pipeline = [
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude], // Correct order of coordinates
                    },
                    key: 'location',
                    maxDistance: 100 * 1000, // Set the maximum distance in kilometers (converted to meters)
                    distanceField: 'dist.calculated',
                    spherical: true,
                },
            },
            {
                $match: {
                    category: category // Filter by category
                }
            },
            // Add more pipeline stages for additional filtering (e.g., by price, state, etc.)
            // {
            //     $match: {
            //         price: { $gte: 10, $lte: 200 }, // Replace 50 and 200 with your desired minimum and maximum prices
            //         state: "bihar" // Replace "California" with your desired state
            //         // Add more filters as needed
            //     }
            // }

            // Add more pipeline stages for additional filtering (e.g., by price, state, etc.)
            // {
            //     $match: {
            //         price: { $gte: minPrice, $lte: maxPrice },
            //         state: desiredState
            //         // Add more filters as needed
            //     }
            // }
        ];

        // Perform the aggregation
        const store_data = await Store.aggregate(pipeline);

        // Check if any stores were found
        if (store_data.length === 0) {
            return res.status(404).json({ success: false, message: 'No stores found within 10 kilometers of the specified location with the given category and filters' });
        }

        // Calculate distance in kilometers from meters and round to the nearest integer
        store_data.forEach(store => {
            const distanceInKilometers = Math.round(store.dist.calculated / 1000);
            const distanceInMeters = Math.round(store.dist.calculated);

            // Add units to the distances
            store.dist.calculatedInKilometers = `${distanceInKilometers} km`;
            store.dist.calculatedInMeters = `${distanceInMeters} m`;
        });

        res.status(200).json({ success: true, message: 'Stores found within 10 kilometers of the specified coordinates with the given category and filters', data: store_data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', msg: error.message });
    }
};


















module.exports = {
    create_store,
    find_near_store
};
