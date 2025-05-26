# AN Smart Home Automation System

A full-stack web application for simulating a Smart Home Automation system. This project demonstrates features like user authentication, device control, admin analytics, and IoT-style dashboards.

## Features

- User authentication (login/register)
- Role-based access (homeowner/admin)
- Device management (add/remove/toggle)
- Admin dashboard with analytics
- Real-time device status updates
- MongoDB integration for data persistence

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- RESTful API architecture

### Frontend
- React
- Vite
- TailwindCSS
- React Router
- Axios

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ansmarthome
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGO_URI=your_mongodb_uri
PORT=5000
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Auth Routes
- POST `/api/auth/register`: Register a new user
- POST `/api/auth/login`: Login user

### User Routes
- GET `/api/users/:id`: Get user info
- GET `/api/users/:id/devices`: Get user's devices

### Device Routes
- POST `/api/devices`: Add new device
- PATCH `/api/devices/:id`: Toggle device status
- DELETE `/api/devices/:id`: Delete device

### Admin Routes
- GET `/api/admin/users`: Get all users
- GET `/api/admin/devices`: Get all devices
- GET `/api/admin/stats`: Get system statistics

## Project Structure

```
ansmarthome/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
    └── index.html
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 