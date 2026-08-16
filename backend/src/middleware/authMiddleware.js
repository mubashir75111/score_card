import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Authorization header se token lena
    const authHeader = req.headers.authorization;

    // Agar token nahi hai
    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    // Bearer TOKEN
    const [type, token] = authHeader.split(" ");

    // Check Bearer + Token
    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    // JWT verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User information request mein save
    req.user = decoded;

    // Next controller par jao
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
