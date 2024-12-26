import session from 'express-session';

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        sameSite: 'lax' // Modify this to 'none' if needed for cross-site requests
    }
});

export default sessionMiddleware;