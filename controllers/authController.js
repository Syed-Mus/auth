const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = (req, res) => {
    const {
        first_name, last_name, email, password,
        phone_no, address_line_1, address_line_2,
        city, state, pincode
    } = req.body;

    User.findByEmail(email, (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: "Error hashing password" });

            User.create({
                first_name, last_name, email, password: hash,
                phone_no, address_line_1, address_line_2,
                city, state, pincode
            }, (err, result) => {
                if (err) return res.status(500).json({ message: "Error creating user" });
                res.status(201).json({ message: "User registered successfully" });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

            const token = generateToken(user.id);
            res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone_no: user.phone_no,
                    address_line_1: user.address_line_1,
                    address_line_2: user.address_line_2,
                    city: user.city,
                    state: user.state,
                    pincode: user.pincode
                }
            });
        });
    });
};


exports.getProfile = (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT token

    const query = `
        SELECT id, first_name, last_name, email, phone_no, address_line_1, address_line_2, city, state, pincode 
        FROM users WHERE id = ?`;

    User.findById(userId, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(results[0]); // Return user details
    });
};

