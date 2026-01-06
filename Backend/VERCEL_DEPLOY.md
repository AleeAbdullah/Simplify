# Deploying to Vercel

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (optional, for CLI deployment): `npm i -g vercel`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Make sure your Backend folder is in a git repository
   - Push to your remote repository

2. **Import Project in Vercel**
   - Go to https://vercel.com/new
   - Import your repository
   - **Important**: Set the "Root Directory" to `Backend` (not the project root)
   - Vercel will automatically detect the `vercel.json` configuration

3. **Set Environment Variables**
   - In your Vercel project settings, go to "Environment Variables"
   - Add all your environment variables from `.env`:
     - `MONGO_URI` - Your MongoDB connection string
     - `PORT` (optional, Vercel handles this automatically)
     - `JWT_SECRET` (if you use JWT)
     - Any other environment variables your app needs

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your backend

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to Backend directory**:
   ```bash
   cd Backend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production deployment, use: `vercel --prod`

5. **Set Environment Variables**:
   ```bash
   vercel env add MONGO_URI
   vercel env add JWT_SECRET
   # Add other environment variables as needed
   ```

## Important Notes

- **Database Connection**: Make sure your MongoDB connection string allows connections from Vercel's IP addresses. If using MongoDB Atlas, ensure your IP whitelist includes `0.0.0.0/0` or Vercel's IP ranges.

- **CORS**: The CORS configuration is already set up in the code. If you need to restrict origins, update the CORS settings in `api/index.js`.

- **API Routes**: Your API will be available at:
  - `https://your-project.vercel.app/api/users`
  - `https://your-project.vercel.app/api/flights`
  - `https://your-project.vercel.app/api/airports`
  - `https://your-project.vercel.app/api/reviews`
  - `https://your-project.vercel.app/api/bookedFlights`

- **Cold Starts**: Serverless functions may have cold starts. For better performance, consider upgrading your Vercel plan or using Vercel Pro.

## Troubleshooting

- If deployment fails, check the build logs in Vercel dashboard
- Ensure all dependencies are listed in `package.json` (not just `package-lock.json`)
- Make sure environment variables are set correctly
- Check MongoDB connection string format and network access

