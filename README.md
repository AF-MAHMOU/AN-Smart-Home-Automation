# AN Smart Home

A smart home management system with user authentication and device control.

## Prerequisites

1. Install Node.js and npm from: https://nodejs.org/
2. Install MongoDB from: https://www.mongodb.com/try/download/community

## Project Setup

1. Install dependencies:
```bash
npm install
```

2. Create a .env file with:
```
MONGODB_URI=mongodb://localhost:27017/an_smarthome
JWT_SECRET=your_jwt_secret
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/register - Register new user
- POST /api/login - Login user

### Devices
- GET /api/devices - Get user's devices
- GET /api/admin/stats - Get admin statistics (admin only)

## Project Structure
```
/
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── config/         # Configuration files
└── server.js       # Main application file
``` 