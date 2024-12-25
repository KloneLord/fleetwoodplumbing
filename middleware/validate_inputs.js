const validate_inputs = (req, res, next) => {
    const { username, email, password, role, name, phone } = req.body;

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.log('Error: Invalid email format.');
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password validation
    if (password && password.length < 6) {
        console.log('Error: Password too short.');
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Username validation
    if (username && username.trim() === '') {
        console.log('Error: Username is empty.');
        return res.status(400).json({ message: 'Username cannot be empty' });
    }

    // Name validation
    if (name && name.trim() === '') {
        console.log('Error: Name is empty.');
        return res.status(400).json({ message: 'Name cannot be empty' });
    }

    // Phone validation
    if (phone && !/^\d{10,15}$/.test(phone)) {
        console.log('Error: Invalid phone number.');
        return res.status(400).json({ message: 'Phone number must contain 10 to 15 digits' });
    }

    next();
};

export default validate_inputs;
