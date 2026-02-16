const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const authorizeRoles = require('../../middlewares/role');
const upload = require('../../middlewares/upload');
const {
  createConsultation,
  getConsultation,
  getUserConsultations,
  updateConsultation,
  deleteConsultation,
  republishConsultation
} = require('../../controllers/consultations/consultation.controller');

router.use(auth);
router.use(authorizeRoles('patient'));

/**
 * @swagger
 * /api/consultations:
 *   post:
 *     summary: Create consultation
 *     description: Create a new consultation request
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Consultation description
 *               specialty:
 *                 type: string
 *                 description: Required medical specialty
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Consultation created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', upload.array('attachments'), createConsultation);

/**
 * @swagger
 * /api/consultations/get-user-consultations:
 *   get:
 *     summary: Get user consultations
 *     description: Get all consultations for current user
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ConsultationRequest'
 */
router.get('/get-user-consultations', getUserConsultations);

/**
 * @swagger
 * /api/consultations/{id}:
 *   get:
 *     summary: Get consultation details
 *     description: Get details of a specific consultation
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultation details
 *       404:
 *         description: Consultation not found
 */
router.get('/:id', getConsultation);

/**
 * @swagger
 * /api/consultations/{id}:
 *   patch:
 *     summary: Update consultation
 *     description: Update an existing consultation
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Consultation updated
 */
router.patch('/:id', upload.array('attachments'), updateConsultation);

/**
 * @swagger
 * /api/consultations/{id}:
 *   delete:
 *     summary: Delete consultation
 *     description: Delete a consultation request
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultation deleted
 */
router.delete('/:id', deleteConsultation);

/**
 * @swagger
 * /api/consultations/republish/{id}:
 *   post:
 *     summary: Republish consultation
 *     description: Republish a consultation request
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultation republished
 */
router.post('/republish/:id', republishConsultation);

module.exports = router;