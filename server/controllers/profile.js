const express = require('express');
const User = require('../models/user');
const Profile = require('../models/profile');

const router = express.Router();

async function HandleToCreateProfile(req, res) {
    try {
        const userid = req.user.userData.id;

        // Find user by ID
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if profile already exists for this user
        const existingProfile = await Profile.findOne({ username: userid });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
        }

        // Create the profile
        const profile = new Profile({
            username: userid,
            followers: [],
            following: [],
            Requests: [],
            Requested: []
        });

        // Save the profile
        await profile.save();

        // Return the created profile in the response
        res.status(201).json({ profile, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', err: err });
    }
}

async function HandleToUpdateProfile(req, res) {
    try {
        const userid = req.user.userData.id; 

        const { email, bio, followers, following, Requests, Requested } = req.body;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profile = await Profile.findOne({ username: userid });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== userid.toString()) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            user.email = email;
            await user.save(); 
        }

        if (bio !== undefined) {
            profile.bio = bio; 
        }

        
        if (followers !== undefined) {
            profile.followers = followers; 
        }
        if (following !== undefined) {
            profile.following = following; 
        }
        if (Requests !== undefined) {
            profile.Requests = Requests; 
        }
        if (Requested !== undefined) {
            profile.Requested = Requested; 
        }

        
        await profile.save();

        
        res.status(200).json(profile);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', err: err });
    }
}


async function HandleToAcceptRequest(req, res) {
    try {
        const { userId, requestId } = req.body;
        if (!userId || !requestId) {
            return res.status(400).json({ message: 'Missing required fields: userId or requestId' });
        }

        // Find the user's profile who will accept the request
        const profile = await Profile.findOne({ username: userId });

        if (!profile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Find the request in the "Requested" array that the user received
        const requestIndex = profile.Requests.findIndex(request => request.user.toString() === requestId && request.status === 'pending');

        if (requestIndex === -1) {
            return res.status(404).json({ message: 'Request not found or already processed' });
        }

        // Accept the request by updating the status
        profile.Requests[requestIndex].status = 'accepted';

        // Add the user to the followers and the following lists
        profile.followers.push(mongoose.Types.ObjectId(requestId));
        const requestorProfile = await Profile.findOne({ username: requestId });

        if (requestorProfile) {
            requestorProfile.following.push(mongoose.Types.ObjectId(userId));
            await requestorProfile.save();
        } else {
            return res.status(404).json({ message: 'Requestor profile not found' });
        }

        // Save the updated profile
        await profile.save();

        return res.status(200).json({
            message: 'Request accepted successfully',
            profile: profile // returning the updated profile
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', err: err.message });
    }
}
