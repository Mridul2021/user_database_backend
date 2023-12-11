const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    age: Number
});

// Define the model
const User = mongoose.model("CRUD", usersSchema);

module.exports = User;
