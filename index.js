const express = require("express");
const app = express();
const route = require("./routes/router");
const cors = require("cors");
const bodyParser = require("body-parser");
const Razorpay= require('razorpay')
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json())
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://Avi9984:JM6hnTiQIRViVdA3@cluster0.qfc4n.mongodb.net/dewwwwod3d",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )

  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.get("/image/:filename", (req, res) => {
  const fileName = req.params.filename;
  // console.log(__dirname);
  const filePath = __dirname + "/uploads/" + fileName;

  res.sendFile(filePath);
});
app.use("/", route);


// let razorpay = new Razorpay({key_id:'rzp_test_rctEhk9DkJO7hU',key_secret:'dH3vdnM9vuumH6JkYg8mSoJB'})

// app.post('/payment',async(req,res)=>{
//   const {amount}=req.body

//   razorpay.orders.create({
//     amount:amount*100,
//     currency: 'USD',
//     receipt:"receipt#1",

//   })
//   return res.status(201).json({status:true, amount })
// })


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
