const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const verifyToken = require("./middleware/auth");
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const storeRoutes = require('./routes/storeRoutes');
const storecategories = require('./routes/storecategoryRoutes');
const reviewRoutes = require('./routes/revieRoutes');
const productRoutes = require('./routes/productRoutes');
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/serviceRoutes")



const app = express();

app.use(bodyParser.json());

// Use cors middleware to enable CORS
app.use(cors());



// Use authRoutes for both endpoints
app.use('/user', authRoutes);
app.use('/api/user', bookingRoutes);


// Use vender for both endpoints
app.use('/api/vender', storeRoutes);
app.use('/api/vender/product', categoryRoutes);
app.use('/api/store/providers/category', storecategories);
app.use('/api/vender/review', reviewRoutes);
app.use('/api/vender/product', productRoutes);
app.use('/api/admin/service', serviceRoutes);

//admin routes     
app.use('/api/admin', adminRoutes);



//image section
const imageDirectory = path.join(__dirname, 'public', 'images');
app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(imageDirectory, imageName);

  if (fs.existsSync(imagePath)) {
    // Check if the image file exists
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);
  } else {
    // Image not found
    res.status(404).json({ message: 'Image not found' });
  }
});

app.get('/', (req, res) => {


  res.send('server is runnimng at render');

});

const PORT = 8000;
const DB = "mongodb+srv://munna572000:Munna686622@salon.fboq520.mongodb.net/Booking?retryWrites=true&w=majority";

mongoose.connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running on :${PORT}`);
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });
