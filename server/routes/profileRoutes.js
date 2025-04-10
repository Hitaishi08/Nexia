const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { getProfilePicture,getMyProfile,upsertProfile } = require('../controllers/profileController.js');
const {jwtAuthMiddleware} = require('../jwt')

router.get('/getprofile', jwtAuthMiddleware, getMyProfile);
router.post('/upsert', jwtAuthMiddleware,upload.single('profilePicture'),upsertProfile);
router.get('/profilepicture', jwtAuthMiddleware,getProfilePicture);
module.exports = router;
