const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
    signup: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(409).json({ message: "Email exist" })
            }
            // הצפן את הסיסמה
            const hash = await bcrypt.hash(password, 10);
            // צור משתמש חדש ושמור אותו במסד הנתונים
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username,
                email,
                password: hash
            });

            const result = await user.save();
            res.status(201).json({ message: 'User created', user: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Auth failed: User not found'  });
            }
            // השווה את הסיסמה המוצפנת עם הסיסמה שנשלחה
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                return res.status(401).json({ message: 'Auth failed: Incorrect password' })
            }
            // צור JWT
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                'SECRET_KEY',
                { expiresIn: '1h' }
            );
            res.status(200).json({ message: 'Auth successful', token })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
};