const express = require('express');
const router = express.Router();
const {HandleToSignUp,HandleToLogin,HandleToChangePassword,handleTologOut} = require('../controllers/authentication')
const {generateToken,jwtAuthMiddleware} = require('../jwt')
router.post('/signup', HandleToSignUp);
router.post('/login',HandleToLogin);
router.patch('/change-password',HandleToChangePassword);
router.delete('/logout',jwtAuthMiddleware,handleTologOut);

module.exports = router;