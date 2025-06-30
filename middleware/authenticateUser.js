import jwt from "jsonwebtoken";

export const authenticateRole = (allowedRoles) => (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (!allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient permissions" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};
