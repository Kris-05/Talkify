import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }
    req.userId = payload.userId;
    next();
  });
}