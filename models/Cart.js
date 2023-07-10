const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {type: String , required: true},
    productId : {type: String},
    productImg: {type: String },
    productName: {type: String},
    productSize: {type: Number},
    productPrice : {type: String}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);