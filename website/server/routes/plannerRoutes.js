const express = require('express');
const { createPlanner, getUserPlanners } = require('../controllers/plannerController');

const router = express.Router();

// Route to create a new planner
router.post('/', createPlanner);

// Route to get all planners for a user
router.get('/user/:userId', getUserPlanners);

module.exports = router;
