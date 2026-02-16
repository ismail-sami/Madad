const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Madad API Documentation',
      version: '1.0.0',
      description: 'Medical Consultation Platform - Backend API with real-time messaging',
      contact: {
        name: 'Madad Team',
        email: 'support@madad.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.madad.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        },
        firebaseAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Firebase Token',
          description: 'Firebase authentication token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number'
            },
            role: {
              type: 'string',
              enum: ['user', 'doctor', 'admin'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Doctor: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Doctor ID'
            },
            firstName: {
              type: 'string',
              description: 'Doctor first name'
            },
            lastName: {
              type: 'string',
              description: 'Doctor last name'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            specialty: {
              type: 'string',
              description: 'Medical specialty'
            },
            licenseNumber: {
              type: 'string',
              description: 'Medical license number'
            },
            yearsOfExperience: {
              type: 'number',
              description: 'Years of medical experience'
            },
            workPlace: {
              type: 'string',
              description: 'Current workplace'
            },
            city: {
              type: 'string',
              description: 'City of practice'
            },
            verifiedByAdmin: {
              type: 'boolean',
              description: 'Admin verification status'
            }
          }
        },
        Chat: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Chat ID'
            },
            participants: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of user IDs'
            },
            lastMessage: {
              type: 'string',
              description: 'Last message content'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            chatId: {
              type: 'string',
              description: 'Associated chat ID'
            },
            senderId: {
              type: 'string',
              description: 'Sender user ID'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            messageType: {
              type: 'string',
              enum: ['text', 'image', 'file'],
              description: 'Type of message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ConsultationRequest: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            patientId: {
              type: 'string',
              description: 'Patient user ID'
            },
            doctorId: {
              type: 'string',
              description: 'Doctor user ID'
            },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'rejected', 'completed'],
              description: 'Consultation status'
            },
            description: {
              type: 'string',
              description: 'Consultation description'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Doctors',
        description: 'Doctor profile and management'
      },
      {
        name: 'Chats',
        description: 'Chat management endpoints'
      },
      {
        name: 'Messages',
        description: 'Message handling endpoints'
      },
      {
        name: 'Consultations',
        description: 'Consultation request management'
      },
      {
        name: 'Uploads',
        description: 'File upload endpoints'
      },
      {
        name: 'Admin',
        description: 'Admin panel endpoints'
      },
      {
        name: 'Dashboard',
        description: 'Dashboard statistics and data'
      }
    ]
  },
  apis: [
    './routes/**/*.js',
    './controllers/**/*.js',
    './models/**/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
