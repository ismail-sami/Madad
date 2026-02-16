const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const dashboardController = require('../../controllers/dashboard/dashboard.controller');
const { verifyDoctor } = require('../../controllers/doctors/doctor.controller');

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Get overall statistics (doctors, patients, consultations count)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorsCount:
 *                   type: number
 *                 patientsCount:
 *                   type: number
 *                 consultationsCount:
 *                   type: number
 */
router.get('/stats', dashboardController.getStats);

/**
 * @swagger
 * /api/dashboard/doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Get all doctors with pagination and filtering
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *                 total:
 *                   type: number
 */
router.get('/doctors', dashboardController.getAllDoctors);

/**
 * @swagger
 * /api/dashboard/patients:
 *   get:
 *     summary: Get all patients
 *     description: Get all patients with pagination and filtering
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get('/patients', dashboardController.getAllPatients);

/**
 * @swagger
 * /api/dashboard/consultations:
 *   get:
 *     summary: Get all consultations
 *     description: Get all consultations with pagination and filtering
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, completed]
 *     responses:
 *       200:
 *         description: List of consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consultations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ConsultationRequest'
 */
router.get('/consultations', dashboardController.getAllConsultations);

/**
 * @swagger
 * /api/dashboard/consultations/{id}/specialty:
 *   put:
 *     summary: Update consultation specialty
 *     description: Update the specialty of a consultation request
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialty:
 *                 type: string
 *                 example: Cardiology
 *     responses:
 *       200:
 *         description: Specialty updated successfully
 */
router.put('/consultations/:id/specialty', dashboardController.updateConsultationSpecialty);

/**
 * @swagger
 * /api/dashboard/doctors/{id}/verify:
 *   put:
 *     summary: Verify doctor
 *     description: Verify a doctor's credentials and activate their account
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor verified successfully
 *       404:
 *         description: Doctor not found
 */
router.put('/doctors/:id/verify', verifyDoctor);

module.exports = router;
