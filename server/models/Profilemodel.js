const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    username: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    Requests: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            }
        }
    ],
    Requested: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            }
        }
    ]
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
