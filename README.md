<<<<<<< HEAD
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
=======
# AN Smart Home Automation

A next-gen Smart Home Automation System by Ahmed & Naif (AN), built to simplify and secure modern living.  
This platform leverages AI, IoT, and cloud services to provide real-time control, predictive energy management, and robust security – all via an intuitive mobile-first interface.

## 🚀 Key Features
- 🔐 Secure login and role-based access
- 🌐 IoT device integration via MQTT / Home Assistant
- 🤖 AI-powered automation and routines
- 📱 Mobile-friendly dashboard (React / Next.js)
- ☁️ Cloud-hosted on Firebase / AWS
- 📊 Admin panel for monitoring and analytics

## 📦 Tech Stack
- Frontend: React.js / Next.js
- Backend: Node.js / Express.js
- Database: MongoDB
- IoT Protocol: MQTT
- Cloud: Firebase / AWS
- CI/CD: GitHub Actions, Docker

## 📅 Agile Sprints
Sprint 1: Core Auth & Dashboard  
Sprint 2: IoT Device Integration & AI Automation  
Final: Testing, Deployment & Security

> Managed using Scrum methodology with a team of 10 including developers, UI/UX, QA, and DevOps.

## 🤝 Contributors
- Ahmed Fouad (Project Owner)
- Naif Abdullah Ali (Product Manager)
- Full team listed in the [Project Charter](./docs/Project%20Charter.pdf)
>>>>>>> a1031d8b30b27cef782fdcc44b5d96e05d9acc2f
