const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true , trim: true},
    password: { type: String, required: true, minlength: 8, trim: true},
    cnfPassword: { type: String, required: true, minlength: 8, trim: true},
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    carts: Array,
  },
  { timestamps: true }
);

userSchema.methods.generateAuthtoken = async function () {
  try {
    const token = await jwt.sign(
      { _id: this._id.toString() },
      "sahilyadavsahilyadavsahilyadavsahil",
      {
        expiresIn: "1d",
      }
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log(`hii my token ${token} from SCHEMA PAGE`);
    return token;
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.addcartdata = async function (cart) {
  try {
    this.carts = this.carts.concat(cart);
    await this.save();
    console.log(this.carts);
    return this.carts;
  } catch (error) {
    console.log(error + "bhai cart add time aai error");
  }
};

module.exports = mongoose.model("User", userSchema);
