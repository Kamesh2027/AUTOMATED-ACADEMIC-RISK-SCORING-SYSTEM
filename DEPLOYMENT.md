# AARSS Deployment Guide - Render Platform

This guide will walk you through deploying the AARSS application to Render.

## Prerequisites

1. ✅ A [Render](https://render.com) account (free tier available)
2. ✅ A MongoDB Atlas account with a cluster set up
3. ✅ Your code pushed to a GitHub repository

## Deployment Options

### Option 1: Blueprint Deployment (Recommended - Easiest)

This method uses the `render.yaml` file to automatically create both services.

#### Steps:

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Go to Render Dashboard**
   - Visit [https://dashboard.render.com](https://dashboard.render.com)
   - Click **New** → **Blueprint**

3. **Connect your GitHub repository**
   - Select your AARSS repository
   - Render will detect the `render.yaml` file

4. **Configure Environment Variables**
   - Render will prompt you for the `MONGO_URI`
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Get your connection string from: **Database → Connect → Connect your application**
   - Replace `<username>`, `<password>`, and `<cluster-url>` with your actual values
   - Paste it into Render when prompted

5. **Deploy**
   - Click **Apply**
   - Render will create both services:
     - `aarss-backend` (Node.js API)
     - `aarss-frontend` (Static site)
   - Wait 5-10 minutes for deployment to complete

6. **Access your application**
   - Once deployed, click on `aarss-frontend` service
   - Your app URL will be: `https://aarss-frontend.onrender.com`

---

### Option 2: Manual Deployment

If you prefer to create services manually:

#### Deploy Backend API

1. **Create Web Service**
   - Go to Render Dashboard → **New** → **Web Service**
   - Connect your GitHub repository
   - Configure:
     - **Name**: `aarss-backend`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Plan**: Free

2. **Add Environment Variables**
   - Click **Environment** tab
   - Add the following:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aarss?retryWrites=true&w=majority
     JWT_SECRET=your-super-secret-key-min-32-characters
     FRONTEND_URL=https://aarss-frontend.onrender.com
     ```
   - Replace `MONGO_URI` with your MongoDB Atlas connection string
   - Generate a strong random string for `JWT_SECRET`

3. **Deploy**
   - Click **Create Web Service**
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://aarss-backend.onrender.com`

#### Deploy Frontend

1. **Create Static Site**
   - Go to Render Dashboard → **New** → **Static Site**
   - Connect your GitHub repository
   - Configure:
     - **Name**: `aarss-frontend`
     - **Region**: Same as backend
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/dist`

2. **Add Environment Variables**
   - Click **Environment** tab
   - Add:
     ```
     VITE_API_URL=https://aarss-backend.onrender.com/api
     ```
   - Replace with your actual backend URL from previous step

3. **Configure Redirects/Rewrites**
   - Click **Redirects/Rewrites** tab
   - Add rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Status**: `200 (Rewrite)`

4. **Deploy**
   - Click **Create Static Site**
   - Wait for build (3-5 minutes)
   - Your app will be live at: `https://aarss-frontend.onrender.com`

---

## MongoDB Atlas Setup

If you haven't set up MongoDB Atlas yet:

1. **Create Account**: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)

2. **Create Cluster**
   - Choose **FREE** tier (M0)
   - Select cloud provider and region
   - Click **Create Cluster**

3. **Configure Database Access**
   - Go to **Database Access** → **Add New Database User**
   - Create username and password (save these!)
   - Set privileges to **Read and write to any database**

4. **Configure Network Access**
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This is required for Render to connect

5. **Get Connection String**
   - Go to **Database** → Click **Connect**
   - Choose **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `aarss`

6. **Seed the Database**
   - After backend is deployed, you need to seed demo data
   - Option A: Use Render shell
     ```bash
     cd backend && node seed.js
     ```
   - Option B: Run locally with production MONGO_URI
     ```bash
     cd backend
     # Create .env with production MONGO_URI
     npm run seed
     ```

---

## Post-Deployment Checklist

- [ ] Backend service is running (check logs)
- [ ] Frontend site is live
- [ ] Database is seeded with demo users
- [ ] Can login with demo credentials:
  - Admin: `admin@email.com` / `password`
  - Faculty: `faculty@email.com` / `password`
  - Student: `student@email.com` / `password`
- [ ] Test all features: add student, update marks, view dashboards

---

## Troubleshooting

### Backend Issues

**Problem**: Backend service fails to start
- **Solution**: Check logs in Render dashboard
- Verify `MONGO_URI` is correct
- Ensure MongoDB Network Access allows all IPs

**Problem**: Database connection error
- **Solution**: 
  - Verify MongoDB Atlas connection string format
  - Check if IP whitelist includes 0.0.0.0/0
  - Test connection string locally first

**Problem**: CORS errors
- **Solution**:
  - Verify `FRONTEND_URL` matches your frontend URL exactly
  - Check browser console for specific CORS error

### Frontend Issues

**Problem**: Frontend shows blank page
- **Solution**:
  - Check build logs for errors
  - Verify `VITE_API_URL` environment variable is set correctly
  - Ensure redirect rule is configured (/* → /index.html)

**Problem**: API calls failing (404 or Network Error)
- **Solution**:
  - Open browser DevTools → Network tab
  - Check if API URL is correct
  - Verify backend service is running
  - Check `VITE_API_URL` includes `/api` at the end

**Problem**: Login not working
- **Solution**:
  - Ensure database is seeded
  - Check backend logs for errors
  - Verify CORS is configured correctly

---

## Free Tier Limitations

⚠️ **Important Notes about Render Free Tier:**

1. **Spin Down**: Free services sleep after 15 minutes of inactivity
   - First request after sleeping takes 30-60 seconds to wake up
   - Subsequent requests are fast

2. **Build Minutes**: 500 free build minutes per month
   - Each deployment consumes minutes
   - Monitor usage in dashboard

3. **Bandwidth**: 100 GB/month free outbound bandwidth

4. **Custom Domains**: Supported even on free tier

---

## Updating Your Deployment

To push updates:

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the push and redeploy both services.

---

## Environment Variables Reference

### Backend Variables
```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aarss?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-characters
FRONTEND_URL=https://aarss-frontend.onrender.com
```

### Frontend Variables
```env
VITE_API_URL=https://aarss-backend.onrender.com/api
```

---

## Security Recommendations

1. ✅ **Never commit `.env` files** - Already configured in `.gitignore`
2. ✅ **Use strong JWT_SECRET** - Minimum 32 random characters
3. ✅ **Rotate secrets regularly** - Update JWT_SECRET every 3-6 months
4. ✅ **Monitor logs** - Check Render logs regularly for suspicious activity
5. ⚠️ **Implement password hashing** - Currently passwords are stored in plain text (not secure for production!)

---

## Next Steps

After deployment:

1. **Test thoroughly** - Try all user roles and features
2. **Set up custom domain** (optional) - Follow Render docs
3. **Monitor performance** - Check Render metrics dashboard
4. **Plan for scaling** - Upgrade to paid tier when needed

---

## Support

- **Render Documentation**: [https://render.com/docs](https://render.com/docs)
- **MongoDB Atlas Docs**: [https://docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Render Community**: [https://community.render.com](https://community.render.com)

---

## Quick Commands

```bash
# Local development
cd backend && npm start
cd frontend && npm run dev

# Build frontend locally
cd frontend && npm run build

# Check build output
ls frontend/dist

# Push to GitHub (triggers deployment)
git push origin main
```

---

**🎉 Your AARSS application should now be live on Render!**

Visit your frontend URL and test with the demo credentials.
