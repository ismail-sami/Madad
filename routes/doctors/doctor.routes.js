const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/role');
const upload = require('../../middlewares/upload');
const {
  completeDoctorData,
  updateDoctorProfile,
  getAvailableConsultations,
  getConsultationStats,
  getLatestAvailableConsultation,
  getConsultationDetails,
  startConsultation,
  endConsultation,
  verifyDoctor
} = require('../../controllers/doctors/doctor.controller');

router.use(auth);
router.use(authorizeRoles('doctor'));

/**
 * @swagger
 * /api/doctors/profile/complete:
 *   patch:
 *     summary: Complete doctor profile
 *     description: Add additional doctor information and upload certification files
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               specialty:
 *                 type: string
 *                 example: Cardiology
 *               licenseNumber:
 *                 type: string
 *                 example: LIC-12345
 *               yearsOfExperience:
 *                 type: number
 *                 example: 5
 *               workPlace:
 *                 type: string
 *                 example: City Hospital
 *               city:
 *                 type: string
 *                 example: New York
 *               degreeFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               licenseFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch(
  '/profile/complete',
  upload.fields([
    { name: 'degreeFiles'},
    { name: 'licenseFiles'}
  ]),
     completeDoctorData
);

/**
 * @swagger
 * /api/doctors/profile/update:
 *   patch:
 *     summary: Update doctor profile
 *     description: Update existing doctor profile information
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               specialty:
 *                 type: string
 *               yearsOfExperience:
 *                 type: number
 *               workPlace:
 *                 type: string
 *               city:
 *                 type: string
 *               degreeFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               licenseFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/profile/update',
  upload.fields([
    { name: 'degreeFiles'},
    { name: 'licenseFiles'}
  ]),
    updateDoctorProfile
);

/**
 * @swagger
 * /api/doctors/consultations/available:
 *   get:
 *     summary: Get available consultations
 *     description: Retrieve all available consultation requests
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 consultations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ConsultationRequest'
 */
router.get('/consultations/available', getAvailableConsultations);

/**
 * @swagger
 * /api/doctors/consultations/latest:
 *   get:
 *     summary: Get latest consultation
 *     description: Get the most recent available consultation
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest consultation
 */
router.get('/consultations/latest', getLatestAvailableConsultation);

/**
 * @swagger
 * /api/doctors/consultations/stats:
 *   get:
 *     summary: Get consultation statistics
 *     description: Get doctor's consultation statistics
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consultation statistics
 */
router.get('/consultations/stats', getConsultationStats);

/**
 * @swagger
 * /api/doctors/consultations/{id}:
 *   get:
 *     summary: Get consultation details
 *     description: Get detailed information about a specific consultation
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consultation ID
 *     responses:
 *       200:
 *         description: Consultation details
 *       404:
 *         description: Consultation not found
 */
router.get('/consultations/:id', getConsultationDetails);

/**
 * @swagger
 * /api/doctors/consultations/{id}/start:
 *   post:
 *     summary: Start consultation
 *     description: Mark consultation as started
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consultation ID
 *     responses:
 *       200:
 *         description: Consultation started
 */
router.post('/consultations/:id/start', startConsultation);

/**
 * @swagger
 * /api/doctors/consultations/{id}/end:
 *   post:
 *     summary: End consultation
 *     description: Mark consultation as completed
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consultation ID
 *     responses:
 *       200:
 *         description: Consultation ended
 */
router.post('/consultations/:id/end', endConsultation);


module.exports = router;
