const jwt = require("jsonwebtoken");
const config = require("../config/config");
const JWT_SECRET = process.env.JWT_SECRET;
const auth = (req, res, next) => {
  try {
    let token = req.headers['authorization'];
    // console.log("Token:", token);

    if (token) {
      // Split the token by space and get the second part (the token itself)
      token = token.split(" ")[1];
      console.log("Token after split:",token);

      let user = jwt.verify(token, JWT_SECRET);
      req.userId = user.id;
     
      
      next();
    } else {
      console.log("No token found.");
      res.status(401).json({ message: "Unauthorized user" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = auth;