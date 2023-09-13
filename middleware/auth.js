const jwt = require("jsonwebtoken");
const config = require("../config/config");
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  try {
    let token = req.headers['authorization'];

    if (token) {
      // Split the token by space and get the second part (the token itself)
      token = token.split(" ")[1];
      console.log("Token after split:", token);

      // Verify the token and check for expiration
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          console.error("Error:", err);
          return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if the token has expired
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        if (user.exp && user.exp < currentTimestamp) {
          console.log("Token has expired.");
          return res.status(401).json({ message: "Token has expired" });
        }

        // Token is valid and not expired, set userId in the request and proceed
        req.userId = user.id;
        next();
      });
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
