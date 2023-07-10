const router = require("express").Router();
const UserToken = require("../models/UserToken.js");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verifyRefreshToken = require("../utils/verifyRefreshToken.js");

// get new access token
router.post("/", async (req, res) => {
  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { id: tokenDetails._id };
      const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1m",
      });
      res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(400).json(err));
});

// logout
router.delete("/", async (req, res) => {
  try {
    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "Logged Out Sucessfully" });

    await userToken.remove();
    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
