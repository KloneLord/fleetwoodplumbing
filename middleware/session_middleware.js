import session from 'express-session';

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Only save session if it’s modified
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        sameSite: 'lax',
    },
});

export default sessionMiddleware;
