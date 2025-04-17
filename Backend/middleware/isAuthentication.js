import jwt from "jsonwebtoken";

const isAuthentication =  async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access",
            success: false,
        });
    }
    try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized access",
                success: false,
            });
        }
        req.id = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access",
            success: false,
        });
    }
}

export default isAuthentication;