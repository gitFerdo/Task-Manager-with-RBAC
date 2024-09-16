const jwt = require("jsonwebtoken");

const authMiddleware = (role = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "No token Provided." });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (role.length && !role.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "You do not have access to this resource." });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
