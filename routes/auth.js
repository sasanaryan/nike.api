const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const generateTokens = require("../utils/generateTokens.js");
//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_KEY
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    const { accessToken, refreshToken } = await generateTokens(savedUser._id);

    const { password, ...others } = savedUser._doc;

    res.status(200).json({ ...others, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      res.status(401).send({ title: "username not find" });
    } else {
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_KEY
      );

      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      const inputPassword = req.body.password;
      if (originalPassword != inputPassword) {
        res.status(401).send({ title: "password is wrong" });
      } else {
        // const accessToken = jwt.sign(
        //   {
        //     id: user._id,
        //   },
        //   process.env.JWT_KEY,
        //   { expiresIn: "1d" }
        // );
        const { accessToken, refreshToken } = await generateTokens(user._id);

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken, refreshToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
