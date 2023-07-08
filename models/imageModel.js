const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name:{type:String},
    description:{type:String},
    price:{type:Number},
    imageUrls: { type: Array },
    collectionType: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("images", imageSchema);
