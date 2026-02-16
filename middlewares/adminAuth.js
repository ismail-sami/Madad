const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * Middleware للتحقق من صلاحية Admin
 * يمكن استخدامه في الـ routes التي تحتاج مصادقة
 */
const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided. Access denied.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find admin
    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        error: 'Admin not found. Access denied.' 
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({ 
        success: false,
        error: 'Account is deactivated. Access denied.' 
      });
    }

    // Attach admin to request
    req.admin = admin;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token. Access denied.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired. Please login again.' 
      });
    }

    return res.status(500).json({ 
      success: false,
      error: 'Error authenticating admin',
      details: error.message 
    });
  }
};

/**
 * Middleware للتحقق من أن الـ Admin هو Super Admin
 */
const superAdminAuth = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ 
      success: false,
      error: 'Not authenticated' 
    });
  }

  if (req.admin.role !== 'super-admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Super admin access required' 
    });
  }

  next();
};

module.exports = { adminAuth, superAdminAuth };
