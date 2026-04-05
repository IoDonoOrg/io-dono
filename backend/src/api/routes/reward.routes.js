const express = require('express');
const rewardController = require('../controllers/reward.controller');
const { isAuth, isDonor } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', isAuth, isDonor, rewardController.listRewards);

module.exports = router;
