const Admin = require('../../models/admin.model');
const jwt = require('jsonwebtoken');

// Secret key for JWT - في بيئة الإنتاج يجب وضعه في .env
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Signup - يعمل فقط من Postman
const signupAdmin = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email, username, and password are required' 
      });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ 
        success: false,
        error: 'Admin with this email already exists' 
      });
    }

    // Create new admin
    const admin = await Admin.create({
      email,
      username,
      passwordHash: password, // سيتم تشفيره تلقائياً في الـ pre-save hook
      role: role || 'admin'
    });

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error creating admin',
      details: error.message 
    });
  }
};

// Login - للداشبورد فقط
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({ 
        success: false,
        error: 'Account is deactivated. Contact super admin.' 
      });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email,
        role: admin.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error logging in',
      details: error.message 
    });
  }
};

// Get current admin info (optional - للاستخدام المستقبلي)
const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        error: 'Admin not found' 
      });
    }

    return res.status(200).json({
      success: true,
      admin
    });

  } catch (error) {
    console.error('Get admin error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error getting admin info',
      details: error.message 
    });
  }
};

module.exports = { 
  signupAdmin, 
  loginAdmin,
  getCurrentAdmin 
};
