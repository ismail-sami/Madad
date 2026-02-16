const express = require('express');
const router = express.Router();
const { signupAdmin, loginAdmin, getCurrentAdmin } = require('../../controllers/admin/admin.controller');
const { adminAuth } = require('../../middlewares/adminAuth');

/**
 * @swagger
 * /api/admin/signup:
 *   post:
 *     summary: Admin signup
 *     description: Create a new admin account (restricted use)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@madad.com
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *               role:
 *                 type: string
 *                 enum: [admin, superadmin]
 *                 default: admin
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/signup', signupAdmin);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate admin user
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@madad.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 admin:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginAdmin);

/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     summary: Get current admin
 *     description: Get current admin information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin information
 *       401:
 *         description: Unauthorized
 */
router.get('/me', adminAuth, getCurrentAdmin);

module.exports = router;
