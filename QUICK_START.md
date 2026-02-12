# AARSS - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Backend
```bash
cd backend
npm start
```
✅ Backend will run on: `http://localhost:5000`

### Step 2: Start the Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend will run on: `http://localhost:5174`

### Step 3: Open Your Browser
Navigate to: `http://localhost:5174`

## 🔑 Demo Credentials

### Admin Login
- **Email**: admin@email.com
- **Password**: password
- **Role**: Admin

**Admin can:**
- Add new students
- Add new faculty members
- View all students in table
- Delete students
- Modify risk calculation settings

### Faculty Login
- **Email**: faculty@email.com
- **Password**: password
- **Role**: Faculty

**Faculty can:**
- View all students
- Filter students by risk level
- Update student marks
- See automatic risk recalculation

### Student Login
- **Email**: student@email.com
- **Password**: password
- **Role**: Student

**Student can:**
- View their own performance
- See risk level
- Track metrics
- Get success tips

## 📊 Demo Students Available

| Name | Email | Risk Level | Score |
|------|-------|-----------|-------|
| John Doe | john.doe@email.com | Low | 81 |
| Jane Smith | jane.smith@email.com | Medium | 68 |
| Bob Johnson | bob.johnson@email.com | High | 50 |
| Alice Williams | alice.williams@email.com | Low | 87 |
| Charlie Brown | charlie.brown@email.com | Medium | 71 |

## 🧪 Testing the Features

### Test 1: Admin Adds a Student
1. Login as Admin
2. Go to "Manage Students" tab
3. Fill in student details
4. Click "Add Student"
5. Student appears in the table

### Test 2: Faculty Updates Marks
1. Login as Faculty
2. Click "Update Marks" on any student card
3. Change attendance/marks/assignments
4. Submit
5. Risk level recalculates automatically

### Test 3: Admin Changes Risk Settings
1. Login as Admin
2. Go to "Risk Settings" tab
3. Modify weight percentages (must sum to 100%)
4. Adjust risk thresholds
5. Click "Update Settings"
6. Settings are saved

### Test 4: Student Views Dashboard
1. Logout (click Logout button)
2. Login as student@email.com / password
3. See your risk level with visual indicator
4. View your performance metrics
5. Check success tips

### Test 5: Faculty Filters Students
1. Login as Faculty
2. Use the Risk Level filter dropdown
3. Select "Low Risk" / "Medium Risk" / "High Risk"
4. See filtered student list

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Also verify .env file has correct MongoDB URI
cat backend/.env
```

### Frontend shows blank page
```bash
# Clear browser cache
# Or open in incognito mode
# Check browser console for errors (F12)
```

### Can't login
- Verify you're using demo credentials from above
- Check backend is running on port 5000
- Check MongoDB connection in server console

### Demo data not showing
```bash
# Reseed the database
cd backend
npm run seed
```

## 📁 Project Files

### Important Files to Know
- `backend/server.js` - Backend entry point
- `frontend/App.jsx` - Frontend router
- `backend/.env` - Database connection
- `backend/seed.js` - Demo data setup

### API Base URL
```
http://localhost:5000/api
```

## 🎯 Key Features to Try

1. **Email Validation** - Try adding student with invalid email
2. **Weight Validation** - Try setting weights that don't sum to 100%
3. **Automatic Calculation** - Update marks and watch risk level change
4. **Role Protection** - Try accessing /admin as a student
5. **Filter System** - Filter students by different risk levels

## 📱 Responsive Design

The application works on:
- ✅ Desktop (1920px and wider)
- ✅ Laptop (1366px - 1919px)
- ✅ Tablet (768px - 1365px)
- ✅ Mobile (320px - 767px)

## 🔐 Security Note

This is a **demo application**. For production, you should:
1. Hash passwords with bcrypt
2. Use JWT tokens
3. Enable HTTPS
4. Add rate limiting
5. Validate all inputs
6. Hide sensitive data

## 📚 Documentation

- Full documentation: See `README.md`
- Implementation details: See `IMPLEMENTATION_SUMMARY.md`
- API endpoints: See `README.md` section "API Endpoints"

## 🎓 Learning Points

This project demonstrates:
- React Context for state management
- Protected routes with role-based access
- CRUD operations with MongoDB
- Real-time data recalculation
- Responsive UI design
- Form validation
- Error handling
- API integration

## 💡 Tips

1. **Keep servers running**: Both backend and frontend need to run simultaneously
2. **Check console**: Use F12 to open developer tools and check for errors
3. **Network tab**: Check API calls in Network tab to debug issues
4. **Try all roles**: Each role has different features to explore
5. **Play with settings**: Try changing risk settings and see how it affects students

## 🎉 You're Ready!

Your AARSS system is now fully functional. Start by:
1. Logging in as Admin
2. Adding a few students
3. Switching to Faculty and updating marks
4. Viewing as Student
5. Changing risk settings

Enjoy exploring the system!

---

**Need Help?** Check the browser console (F12) for error messages, or check the backend console for server errors.
