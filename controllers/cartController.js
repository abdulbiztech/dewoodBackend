const { default: mongoose } = require("mongoose");
const Item = require("../models/itemModel");
const User = require("../models/userModel");
const Razorpay = require("razorpay");
let razorpay = new Razorpay({
  key_id: "rzp_test_rctEhk9DkJO7hU",
  key_secret: "dH3vdnM9vuumH6JkYg8mSoJB",
});

const addToCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    const cart = await Item.findOne({ _id: productId });
    const getUser = await User.findOne({ _id: req.userId });

    const item = getUser.carts.find((p) => p._id == productId);
    if (item) {
      return res.status(400).json({ message: "Products already added in cart" });
    } else {
      if (getUser) {
        const cartData = await getUser.addcartdata(cart);
        await getUser.save();
        console.log(cartData.price);
        res.status(201).json({status: true,messsage: "Item added to cart successfully",data: getUser});
      } else {
        res.status(401).json({ message: "User not matching" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const removeCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartId = req.body.cartId;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ status: false, message: "invalid user id" });
    }
    const findUser = await User.findById({ _id: userId });
    const cartItemsIndex = findUser.carts.findIndex(
      (item) => item._id == cartId
    );
    if (cartItemsIndex !== -1) {
      findUser.carts.splice(cartItemsIndex, 1);
      let updateCart = await User.updateOne(
        { _id: userId },
        {
          $set: {
            carts: findUser.carts,
          },
        }
      );
      return res.status(200).json({ status: true, message: "Cart Remove successfully" });
    } else {
      return res.status(404).json({ status: false, message: "Cart does not in cart" });
    }
  } catch (error) {
    console.log(error);
  }
};

const buyNow = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    // Create an order in Razorpay
    const order = await razorpay.orders.create({
      amount: Number(itemId.price * 100), // Convert price to paise (Razorpay uses smallest currency unit)
      currency: 'USD', // Change this if your currency is different
      receipt: 'order_receipt', // Unique identifier for the order
      payment_capture: 1 // Automatically capture the payment
    });

    // Placeholder response
    const response = {
      message: 'Purchase successful!',
      userId,
      itemId,
      order
    };

    res.json(response);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { addToCart, removeCart, buyNow };
