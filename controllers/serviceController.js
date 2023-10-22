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
        if (!req.file || !req.file.filename) {
            // Check if an image file was included in the request
            return res.status(400).json({ message: "No 'images' file found in the request" });
        }

        // Create a new service post
        const newService = new Service({
            category,
            servicename,
            discription,
            title,
            totalservices: await countStores(),
            images: req.file.filename,
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

// Update an existing service by ID
const updateService = async (req, res) => {
    const { category, servicename, discription, title } = req.body;
    const serviceId = req.params.serviceId; // Get the service ID from the URL params

    try {
        // Find the service by its ID
        const existingService = await Service.findById(serviceId);

        // If the service doesn't exist, return a 404 status
        if (!existingService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Update the service properties
        if (category) existingService.category = category;
        if (servicename) existingService.servicename = servicename;
        if (discription) existingService.discription = discription;
        if (title) existingService.title = title;

        // Check if a photo was sent in the request and update it
        if (req.file) {
            existingService.images = req.file.filename;
        }

        // Save the updated service to the database
        const updatedService = await existingService.save();

        // Send a success response with the updated service data
        res.status(200).json({ message: 'Service updated successfully', updatedService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete an existing service by ID
// Delete an existing service by ID
const deleteService = async (req, res) => {
    const serviceId = req.params.serviceId; // Get the service ID from the URL params

    try {
        // Find the service by its ID
        const existingService = await Service.findById(serviceId);

        // If the service doesn't exist, return a 404 status
        if (!existingService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Delete the service from the database using deleteOne
        await existingService.deleteOne();

        // Send a success response
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



module.exports = {
    addServices,
    getServices,
    updateService,
    deleteService
};
