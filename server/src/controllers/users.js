const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
    signup: async (req, res) => {
        const { firstName, lastName, email, password } = req.body;

        try {
            console.log('Signup request received with:', req.body);
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                console.log('Email already exists');
                return res.status(409).json({ message: "Email exist" })
            }
            // הצפן את הסיסמה
            const hash = await bcrypt.hash(password, 10);
            // צור משתמש חדש ושמור אותו במסד הנתונים
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                firstName,
                lastName,
                email,
                password: hash
            });

            const result = await user.save();
            console.log('User created successfully');
            res.status(201).json({ message: 'User created', user: result });
        } catch (error) {
            console.error('Error during signup:', error);
            res.status(500).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            console.log('Login request received with:', req.body);
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found');
                return res.status(401).json({ message: 'Auth failed: User not found' });
            }
            // השווה את הסיסמה המוצפנת עם הסיסמה שנשלחה
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                console.log('Incorrect password');
                return res.status(401).json({ message: 'Auth failed: Incorrect password' })
            }
            // צור JWT
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                'SECRET_KEY',
                { expiresIn: '1h' }
            );
            console.log('Auth successful');
            res.status(200).json({ message: 'Auth successful', token, user })
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: error.message })
        }
    }
};