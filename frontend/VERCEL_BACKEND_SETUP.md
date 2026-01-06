# Vercel Backend Setup - Troubleshooting Guide

## Issue: Frontend Not Getting Data from Backend

### Problem Identified
The Vercel deployment has **Deployment Protection** enabled, which requires authentication to access the API. This is blocking all API requests from the frontend.

### Solutions

#### Option 1: Disable Deployment Protection (Recommended for Public APIs)

1. Go to your Vercel Dashboard: https://vercel.com
2. Navigate to your project: `simplify-dw0ww60b7-ali-abdullahs-projects`
3. Go to **Settings** → **Deployment Protection**
4. **Disable** deployment protection for production deployments
5. This will allow public access to your API endpoints

#### Option 2: Use Custom Domain (If Available)

If your custom domain `simplify-silk.vercel.app` doesn't have protection:
- Update `.env` file to use: `REACT_APP_API_BASE_URL=https://simplify-silk.vercel.app`

#### Option 3: Configure CORS for Specific Origins

If you need to keep protection but allow specific origins, you'll need to:
1. Configure CORS in the backend to allow your frontend domain
2. Set up proper authentication tokens

### Current Configuration

**Frontend `.env` file:**
```
REACT_APP_API_BASE_URL=https://simplify-dw0ww60b7-ali-abdullahs-projects.vercel.app
```

**Backend CORS:** Already configured to allow all origins (updated in `api/index.js`)

### Steps to Fix

1. **Disable Deployment Protection in Vercel:**
   - Dashboard → Project → Settings → Deployment Protection
   - Turn off protection for production

2. **Redeploy Backend (if you made CORS changes):**
   - Push changes to trigger a new deployment
   - Or manually redeploy from Vercel dashboard

3. **Verify API is Accessible:**
   ```bash
   curl https://simplify-dw0ww60b7-ali-abdullahs-projects.vercel.app/
   # Should return: "API is running..."
   ```

4. **Test API Endpoint:**
   ```bash
   curl -X POST https://simplify-dw0ww60b7-ali-abdullahs-projects.vercel.app/api/flights/getFilteredFlights \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

5. **Restart Frontend:**
   ```bash
   cd frontend
   npm start
   ```

### Additional Notes

- The frontend is already configured to use the Vercel backend URL
- CORS has been updated to allow all origins (you can restrict this later)
- The API config utility handles URL formatting correctly

### If Issues Persist

1. Check browser console for CORS errors
2. Verify environment variable is loaded: `console.log(process.env.REACT_APP_API_BASE_URL)`
3. Check Network tab in browser DevTools to see actual API requests
4. Verify backend is actually deployed and running

