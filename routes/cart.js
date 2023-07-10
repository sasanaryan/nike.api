const Cart = require("../models/Cart");
const {
  verifyToken
} = require("./verifyToken");

const router = require("express").Router();

//SAVE ORDERS

router.post("/",verifyToken, async (req, res) => {
    
      
      Cart.insertMany(req.body).then(() => {
        
      res.status(200).json("Orders has been saved..."); // Success
    }).catch((err)=>{
      res.status(500).json(err);      // Failure
    });
    
 
});


/// GET ORDERS

router.get("/:userId",verifyToken, async (req, res) => {
  try {
    const userOrders = await Cart.find({ userId: req.params.userId });
    res.status(200).json(userOrders);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;