const express = require('express');
const router = express.Router();
const {HandleToPostProject,HandleToGetProject,
    HandleToGetProjectByName,HandleToDeleteProject,HandleToLeaveProject,HandleTogenerateReport} = require('../controllers/project')
const {jwtAuthMiddleware} = require('../jwt')


router.post('/project',jwtAuthMiddleware,HandleToPostProject);
router.get('/project/:id',jwtAuthMiddleware,HandleToGetProject);
router.get('/project/',jwtAuthMiddleware,HandleToGetProjectByName);  // url like : /users/search?name=John&age=30
router.delete('/project/:id',jwtAuthMiddleware,HandleToDeleteProject);
router.delete('/project/leave/:id',jwtAuthMiddleware,HandleToLeaveProject);
router.get('/generateReport',jwtAuthMiddleware,HandleTogenerateReport);
module.exports = router;