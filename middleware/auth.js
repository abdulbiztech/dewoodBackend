const jwt = require("jsonwebtoken");
const key = "sahilyadavsahilyadavsahilyadavsahil";
const User = require("../models/userModel");
const Auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // console.log(token, "I am token in auth page");
    const verifyToken = jwt.verify(token, key);
    console.log(`${verifyToken} I AM VERIFY TOKEN,, ONLY ID WHEN `);
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    // console.log(rootUser, "token user");
    if (!rootUser) {
      throw new Error("USER NOT FOUND BY AUTH PAGE ");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    next();
  } catch (error) {
    res.status(401).json({ status: 401, message: "Unautherised no token provide" });
  }
};
module.exports = Auth;
