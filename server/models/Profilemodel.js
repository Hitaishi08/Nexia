const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the signup schema
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  github: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  bio: {
    type: String,
  },
  address: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  company: {
    type: String,
  },
  experience: {
    type: String,
  },
  university: {
    type: String,
  },
  course: {
    type: String,
  },
  yearOfStudy: {
    type: String,
  },
  skills: {
    type: [String], // An array of skills
  },
  profilePicture: {
    type: String, // URL of the image
    default: "",  // optional
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
