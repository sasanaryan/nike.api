const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, },
    img: {type: Array, default: [] },
    categories: { type: String },
    gender: { type: String },
    price: { type: Number, required: true },
    existedSize: { type: Array, default: []}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
