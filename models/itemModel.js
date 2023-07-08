const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true},
    description: { type: String, trim: true},
    price: { type: Number ,trim: true},
    imageUrls: { type: Array },
    collectionType: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", imageSchema);
