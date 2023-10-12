const Service = require('../models/servicesModels'); // Import the Service model
const Store = require('../models/storeModel');




// Function to count the total number of stores
const countStores = async () => {
    try {
        const totalStores = await Store.countDocuments();
        return totalStores;
    } catch (error) {
        console.error(`Error counting stores: ${error.message}`);
        return 0;
    }
};

// Create a new service post
const addServices = async (req, res) => {
    const { category, servicename, discription, title } = req.body;

    try {
        // Create a new service post
        const images = req.files['images'][0].filename;
        
        const newService = new Service({
            category,
            servicename,
            discription,
            title,
            totalservices: await countStores(), // Call the countStores function to get the total stores count
            images,
        });

        // Save the new service post to the database
        const serviceData = await newService.save();

        // Send a success response with a 201 status code
        res.status(201).json({ message: 'Service post created successfully', serviceData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// Get all service posts
const getServices = async (req, res) => {
    try {
        // Find all service posts
        const servicePosts = await Service.find();

        // If no service posts are found, return an empty array
        if (!servicePosts || servicePosts.length === 0) {
            return res.status(404).json({ message: 'No service posts found' });
        }

        // If service posts are found, send them as a response
        res.status(200).json({ servicePosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    addServices,
    getServices,
};
