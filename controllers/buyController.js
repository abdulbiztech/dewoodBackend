const Item = require("../models/itemModel");
const User = require("../models/userModel");
const Buy = require("../models/buyModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/buyModel")
const   key_secret= "dH3vdnM9vuumH6JkYg8mSoJB"
let razorpay = new Razorpay({
  key_id: "rzp_test_rctEhk9DkJO7hU",
  key_secret: "dH3vdnM9vuumH6JkYg8mSoJB",
});

const createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    razorpay.orders.create(
      { amount: amount * 100, currency, receipt, notes },
      (err, order) => {
        if (!err) res.json(order);
        else res.send(err);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const checkout = async (req, res) => {
  // console.log("he");
  // console.log(req.body,"mere body");
  var options = {
    amount: Number(req.body.amount / 100), // amount in the smallest currency unit
    currency: "USD",
  };
  const order = await razorpay.orders.create(options);
  // console.log(order,"mai order hu");
  res.status(200).json({
    success: true,
    order,
  });
};

const verifyOrder = async (req, res) => {
  console.log(req.body);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body.toString())
    .digest("hex");
    console.log("recived",  razorpay_signature);
    console.log("genrate",  expectedSignature );
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      // Database comes here

      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.redirect(
        `http://localhost:4200/success-payment?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }

};
module.exports = { createOrder, checkout, verifyOrder };
