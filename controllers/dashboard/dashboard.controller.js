const Doctor = require('../../models/doctor.model');
const User = require('../../models/user.model');
const ConsultationRequest = require('../../models/consultation-request.model');

/**
 * Get dashboard statistics
 * Returns counts of doctors, patients, and consultations
 */
exports.getStats = async (req, res) => {
  try {
    // Count doctors
    const doctorsCount = await Doctor.countDocuments();
    
    // Count patients (users with role 'patient')
    const patientsCount = await User.countDocuments({ role: 'patient' });
    
    // Count consultations
    const consultationsCount = await ConsultationRequest.countDocuments();

    res.json({
      doctors: doctorsCount,
      patients: patientsCount,
      consultations: consultationsCount
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard statistics',
      error: error.message 
    });
  }
};

/**
 * Get all doctors with pagination and filtering
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, verified } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    
    if (search) {
      filter.$or = [
        { 'userId.firstName': { $regex: search, $options: 'i' } },
        { 'userId.lastName': { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (verified !== undefined) {
      filter.verifiedByAdmin = verified === 'true';
    }

    const total = await Doctor.countDocuments(filter);
    const doctors = await Doctor.find(filter)
      .populate('userId', 'firstName lastName email phone profileImage gender city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      doctors,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      message: 'Failed to fetch doctors',
      error: error.message 
    });
  }
};

/**
 * Get all patients with pagination and filtering
 */
exports.getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = { role: 'patient' };
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const patients = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      patients,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ 
      message: 'Failed to fetch patients',
      error: error.message 
    });
  }
};

/**
 * Get all consultations with pagination and filtering
 */
exports.getAllConsultations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, specialty } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    
    if (status) {
      filter.status = status;
    }

    if (specialty) {
      filter.specialty = specialty;
    }

    const total = await ConsultationRequest.countDocuments(filter);
    const consultations = await ConsultationRequest.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('assignedDoctorId', 'specialty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      consultations,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ 
      message: 'Failed to fetch consultations',
      error: error.message 
    });
  }
};

/**
 * Update consultation specialty
 */
exports.updateConsultationSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialty } = req.body;

    if (!specialty) {
      return res.status(400).json({ 
        message: 'Specialty is required' 
      });
    }

    const consultation = await ConsultationRequest.findByIdAndUpdate(
      id,
      { specialty },
      { new: true }
    ).populate('userId', 'firstName lastName email')
      .populate('assignedDoctorId', 'specialty');

    if (!consultation) {
      return res.status(404).json({ 
        message: 'Consultation not found' 
      });
    }

    res.json({
      message: 'Consultation specialty updated successfully',
      consultation
    });
  } catch (error) {
    console.error('Error updating consultation specialty:', error);
    res.status(500).json({ 
      message: 'Failed to update consultation specialty',
      error: error.message 
    });
  }
};