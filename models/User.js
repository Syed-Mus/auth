const db = require("../config/db");

const User = {
    create: (user, callback) => {
        const query = `
            INSERT INTO users 
            (first_name, last_name, email, password, phone_no, address_line_1, address_line_2, city, state, pincode) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [
            user.first_name, user.last_name, user.email, user.password,
            user.phone_no, user.address_line_1, user.address_line_2,
            user.city, user.state, user.pincode
        ], callback);
    },

    findByEmail: (email, callback) => {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, [email], callback);
    },

    findById: (id, callback) => {
        const query = "SELECT * FROM users WHERE id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = User;
