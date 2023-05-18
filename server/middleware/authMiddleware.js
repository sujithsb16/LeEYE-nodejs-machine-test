
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");






const userProtect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.headers.authorization;
  console.log(token);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("jwt token :", token);
      console.log("1");

      //decodes token id

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(decoded);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorised, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorised, no token");
  }
});


module.exports = { userProtect };
