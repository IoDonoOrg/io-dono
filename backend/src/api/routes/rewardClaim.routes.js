const express = require('express');
const rewardController = require('../controllers/reward.controller');
const { isAuth, isDonor } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', isAuth, isDonor, rewardController.listMyRewardClaims);
router.post('/', isAuth, isDonor, rewardController.createRewardClaim);
router.patch('/:claimId', isAuth, isDonor, rewardController.patchRewardClaim);

module.exports = router;
