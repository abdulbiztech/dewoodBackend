const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const validEmail = (Email) => {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email)) {
    return false;
  } else {
    return true;
  }
};

const validPwd = (Password) => {
  if (
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
      Password
    )
  ) {
    return false;
  } else {
    return true;
  }
};

const register = async (req, res) => {
  try {
    const body = req.body;
    const { email, password, cnfPassword } = body;

    if (!email || !password || !cnfPassword) {
      return res.status(400).json({ status: false, message: "All required fields" });
    }
    if (validEmail(email)) {
      return res.status(400).json({ status: false, message: "Enter a valid email address" });
    }
    let checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      return res.status(400).json({ status: false, message: "User already exists or login now" });
    }
    if (validPwd(password && cnfPassword)) {
      return res.status(400).json({status: false,message:
          "Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters",
      });
    }
    if (password !== cnfPassword) {
      return res.status(400).json({ status: false, message: "Passwords do not match" });
    } else {
      body.password = await bcrypt.hash(body.password, 10);
      body.cnfPassword = await bcrypt.hash(body.cnfPassword, 10);
    }
    let userData = await User.create(body);
    console.log("created", userData);
    res.status(201).send({status: true,message: "User created successfully",data: userData,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    const { email, password } = data;
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "All required fields" });
    }

    if (validEmail(email)) {
      return res.status(400).json({ status: false, message: "Enter a valid email address" });
    }
    if (validPwd(password)) {
      return res.status(400).json({status: false,message:
          "Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters",
      });
    }
    const checkValidUser = await User.findOne({ email: data.email });
    // console.log();
    if (!checkValidUser) {
      return res.status(404).send({ status: false, message: "Email not found " });
    }
    let checkPassword = await bcrypt.compare(
      data.password,
      checkValidUser.password
    );
    if (!checkPassword) {
      return res.status(400).send({ status: false, message: "Password is not correct" });
    }
    console.log("checkPassword", checkPassword);
    // let token = jwt.sign({ userId: checkValidUser._id }, "Product-Management", {
    //   expiresIn: "1d",
    // });
    const token = await checkValidUser.generateAuthtoken();
    console.log(checkValidUser,"maderchod");
    console.log("token: " + token);
    const result = {
      token,
      checkValidUser
    }
    // res.setHeader("x-api-key", token);
    res
      .status(200)
      .json({ status: true, message: "Successfully Login", data: result});
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.json({ status: false, message: "Invalid user id." });
    }
    const checkValidUser = await User.findById({ _id: userId });
    if (!checkValidUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    // console.log(checkValidUser.carts, "Check");
    return res.status(200).json({
      status: true,
      message: "Get Detail By Specific User",
      data: checkValidUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const userLogout = async (req, res) => {
  console.log(req.rootUser.tokens);
  // console.log("error: ");
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curElem) => {
      return curElem.token !== req.token;
    });
    req.rootUser.save();
    res.status(201).json({ status: true, message: "User logout successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { register, login, getUserById,userLogout };
