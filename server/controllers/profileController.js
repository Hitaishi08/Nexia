const Profile = require('../models/Profilemodel');
const upload = require('../config/multer');

// GET LOGGED-IN USER'S PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userData.id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
};

// Upsert profile route
exports.upsertProfile = async (req, res) => {
  console.log(req.user.userData.id);
  const userId = req.user.userData.id;

  const {
    username, email, github, linkedin, bio, address,
    jobTitle, company, experience, university,
    course, yearOfStudy, skills
  } = req.body;

  try {
    const updateData = {
      username,
      email,
      github,
      linkedin,
      bio,
      address,
      jobTitle,
      company,
      experience,
      university,
      course,
      yearOfStudy,
      skills: skills.split(','),
    };

    // ✅ Store the Cloudinary image URL
    if (req.file && req.file.path) {
      updateData.profilePicture = req.file.path;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      { upsert: true, new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error('Profile upsert error:', err);
    res.status(500).json({ error: 'Failed to upsert profile' });
  }
};

exports.getProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userData.id;
    const profile = await Profile.findOne({ userId });

    if (!profile || !profile.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    res.status(200).json({ imageUrl: profile.profilePicture });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
