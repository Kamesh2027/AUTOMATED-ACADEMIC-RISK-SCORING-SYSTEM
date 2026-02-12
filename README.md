# AARSS - Academic At-Risk Student System

A comprehensive web application designed to monitor and manage at-risk students in an academic institution.

## Features

### 🔐 Authentication System
- Three distinct user roles: **Admin**, **Faculty**, and **Student**
- Email-based login with password authentication
- Role-based access control with protected routes

### 👨‍💼 Admin Dashboard
- **Manage Students**: Add new students with initial performance metrics
- **Add Faculty**: Register faculty members to the system
- **Risk Settings Management**: Customize risk calculation weights and thresholds
  - Adjust attendance, marks, and assignments weights
  - Set risk level thresholds (Low, Medium, High)

### 👨‍🏫 Faculty Dashboard
- **View All Students**: See comprehensive student list with risk levels
- **Filter by Risk Level**: Filter students by Low, Medium, or High risk
- **Update Marks**: Update student performance metrics in real-time
- **Automatic Risk Calculation**: Risk levels recalculate automatically when marks are updated

### 👨‍🎓 Student Dashboard
- **View Personal Performance**: Track your attendance, marks, and assignments
- **Risk Level Indicator**: Visual representation of your academic risk status
- **Overall Score**: See your calculated overall performance score
- **Performance Tips**: Get actionable advice for academic success

## Demo Credentials

Use the following credentials to test the application:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@email.com | password |
| Faculty | faculty@email.com | password |
| Student | student@email.com | password |

## Tech Stack

### Frontend
- **React** 19.2.0
- **React Router DOM** 7.13.0
- **Vite** 7.2.4
- **Modern CSS3** with responsive design

### Backend
- **Node.js** with Express.js 5.2.1
- **MongoDB** with Mongoose 9.1.6
- **CORS** support for cross-origin requests
- **Environment variables** with dotenv

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend folder:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aarss?retryWrites=true&w=majority
PORT=5000
```

4. Seed the database with demo data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm start
```
The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5174`

## Project Structure

```
AARSS/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── studentController.js    # Student management
│   │   └── riskController.js       # Risk settings
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Student.js              # Student schema
│   │   └── RiskSettings.js         # Risk settings schema
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   ├── studentRoutes.js        # Student endpoints
│   │   └── riskRoutes.js           # Risk settings endpoints
│   ├── config/
│   │   └── db.js                   # Database connection
│   ├── seed.js                     # Database seeding script
│   └── server.js                   # Express server
├── frontend/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation bar
│   │   └── ProtectedRoute.jsx      # Route protection
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── AdminDashboard.jsx      # Admin dashboard
│   │   ├── FacultyDashboard.jsx    # Faculty dashboard
│   │   ├── StudentDashboard.jsx    # Student dashboard
│   │   └── NotFound.jsx            # 404 page
│   ├── styles/
│   │   └── index.css               # Global styles
│   ├── App.jsx                     # Main app component
│   └── main.jsx                    # React entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)

### Students
- `GET /api/students` - Get all students
- `GET /api/students/email/:email` - Get student by email
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student marks
- `DELETE /api/students/:id` - Delete student

### Risk Settings
- `GET /api/risk` - Get current risk settings
- `PUT /api/risk` - Update risk settings

## Risk Calculation Formula

The overall score is calculated using:

```
Score = (Attendance × Attendance Weight)/100 + 
         (Marks × Internal Weight)/100 + 
         (Assignments × Assignment Weight)/100
```

Risk Level Classification:
- **Low Risk**: Score ≥ 85
- **Medium Risk**: Score ≥ 70 and < 85
- **High Risk**: Score < 70

## Key Features Explained

### 1. Role-Based Access Control
Different user roles have access to different features:
- **Admin**: Full access to all features
- **Faculty**: Can view and update student marks
- **Student**: Can only view their own performance

### 2. Real-Time Risk Assessment
When faculty members update student marks, the risk level is automatically recalculated based on the current risk settings set by admin.

### 3. Customizable Risk Thresholds
Administrators can adjust the weights for different metrics and the threshold values for risk levels, making the system adaptable to different institutional requirements.

### 4. Data Persistence
All data is stored in MongoDB, ensuring persistence across sessions.

## Development

### Running in Development Mode

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist` folder.

## Troubleshooting

### Backend Connection Issues
- Verify MongoDB URI in `.env` file
- Check if MongoDB cluster is accessible
- Ensure port 5000 is not in use

### Frontend Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Restart the dev server
- Check browser console for errors

### Login Issues
- Verify you're using the correct demo credentials
- Check backend is running on port 5000
- Ensure MongoDB is connected

## Future Enhancements

- [ ] JWT token-based authentication
- [ ] Student performance analytics and charts
- [ ] Email notifications for at-risk students
- [ ] Course management system
- [ ] Grade distribution reports
- [ ] Mobile app using React Native
- [ ] Advanced data visualizations with Recharts
- [ ] User profile management

## Support

For issues or questions, please open an issue in the repository.

## License

This project is licensed under the ISC License.

---

**Note**: This is a demo application for educational purposes. For production use, implement proper security measures including:
- Bcrypt for password hashing
- JWT tokens for authentication
- HTTPS/SSL encryption
- Rate limiting
- Input validation and sanitization
- CORS restrictions
