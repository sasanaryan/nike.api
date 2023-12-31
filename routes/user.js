 const User = require("../models/User");
const {
  verifyToken
} = require("./verifyToken");

const router = require("express").Router();

///UPDATE

router.put("/:id",verifyToken, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// /DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

/// favorite an product
router.put("/:id/favorite",verifyToken, async (req, res) => {
  try {
    const user = await  User.findByIdAndUpdate(req.params.id);
    if (!user.favorites.includes(req.body.productId)) {
      await user.updateOne({ $push: { favorites: req.body.productId } });
      res.status(200).json("The product has been add to your favorites");
    } else {
      await user.updateOne({ $pull: { favorites: req.body.productId } });
      res.status(200).json("The product has been removed in your favorites ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
