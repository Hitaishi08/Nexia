const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Check if the model already exists to avoid overwriting it
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true
    }
});

// hashing function for the password
UserSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.comparepassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

// Check if the model exists before defining it
const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;
