export const protectRoute = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token provided.'));
    }

    try {
        // Example JWT verification (replace with actual implementation)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user information to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401);
        next(new Error('Not authorized, invalid token.'));
    }
};
