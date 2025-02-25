// ye route Authenticate ka function hai

const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "token not fount" });
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ error: "unautorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // jo bhi user signup/login karega uska data iske andar aayega
    // ab is data ki access karna ho to jaha per jwtAuthMiddle call karoge waha ahar (req.user) likhne per user signup/login user ka data mil jayega
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "unautorized" });
  }
};

// ye token generate ka function hai

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken };
