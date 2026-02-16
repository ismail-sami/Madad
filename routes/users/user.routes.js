const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');
const authorizeRoles = require('../../middlewares/role');
const {
  getProfile,
  updateProfile,
  completeProfile,
  deleteProfile,
  getStatistics,
  getOtherParticipantInfo,
  createRating,
  checkUserRating
} = require('../../controllers/users/user.controller');

router.use(auth);
router.use(authorizeRoles('doctor', 'patient'));

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve current user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Update current user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch('/profile', upload.single("profileImage"), updateProfile);

/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Delete user profile
 *     description: Delete current user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/profile', deleteProfile);

/**
 * @swagger
 * /api/users/profile/complete:
 *   patch:
 *     summary: Complete user profile
 *     description: Complete additional profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile completed successfully
 */
router.patch('/profile/complete', upload.single("profileImage"), completeProfile);

/**
 * @swagger
 * /api/users/statistics:
 *   get:
 *     summary: Get user statistics
 *     description: Get statistics for the current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/statistics', getStatistics);

/**
 * @swagger
 * /api/users/{chatId}/other-user:
 *   get:
 *     summary: Get other participant info
 *     description: Get information about the other participant in a chat
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chat ID
 *     responses:
 *       200:
 *         description: Participant info retrieved
 */
router.get('/:chatId/other-user', getOtherParticipantInfo);

/**
 * @swagger
 * /api/users/ratings:
 *   post:
 *     summary: Create rating
 *     description: Rate a consultation or doctor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating created successfully
 */
router.post('/ratings', createRating);

/**
 * @swagger
 * /api/users/ratings/check:
 *   get:
 *     summary: Check user rating
 *     description: Check if user has already rated
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rating status retrieved
 */
router.get('/ratings/check', checkUserRating);

module.exports = router;
