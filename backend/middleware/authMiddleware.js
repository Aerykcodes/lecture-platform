const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check header exists
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  // 2️⃣ Check Bearer format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }

  // 3️⃣ Extract token
  const token = authHeader.split(" ")[1];

  try {
    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("JWT decoded:", decoded); // ADD THIS
    // 5️⃣ Attach user data to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
