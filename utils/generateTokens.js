const jwt = require("jsonwebtoken");
const UserToken = require("../models/UserToken.js");

const generateTokens = async (userId) => {
  try {
    const accessToken = jwt.sign(
      {
        id: userId,
      },
      process.env.JWT_KEY,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_KEY_REFRESH, {
      expiresIn: "30d",
    });

    const userToken = await UserToken.findOne({ userId: userId });
    if (userToken) await userToken.remove();

    await new UserToken({ userId: userId, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};
module.exports = generateTokens;
