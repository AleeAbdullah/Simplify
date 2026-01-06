# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas (cloud MongoDB) for your backend application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or log in if you already have one)
3. Verify your email address

## Step 2: Create a New Cluster

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose **"M0 Free"** tier (Free forever, perfect for development)
3. Select a **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Choose a **Region** closest to your users (or where Vercel deploys)
5. Give your cluster a name (e.g., "Simplify-Cluster")
6. Click **"Create Cluster"** (takes 3-5 minutes)

## Step 3: Create Database User

1. In the **Security** section, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter a username (e.g., `simplify-admin`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT**: Save the username and password - you'll need it for the connection string
7. Under **"Database User Privileges"**, select **"Atlas admin"** (or "Read and write to any database")
8. Click **"Add User"**

## Step 4: Configure Network Access

1. In the **Security** section, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, click **"Add Current IP Address"**
4. For production/Vercel deployment, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - **Note**: This allows connections from any IP. For production, consider restricting to Vercel's IP ranges
5. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Go to **"Database"** section
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as the driver
5. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
6. Replace `<username>` with your database username
7. Replace `<password>` with your database password
8. Add your database name at the end (before `?`): 
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/simplify?retryWrites=true&w=majority
   ```

## Step 6: Set Environment Variables

### For Local Development:

Create a `.env` file in the `Backend` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/simplify?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=your_jwt_secret_here
```

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret (if using authentication)
   - Any other environment variables your app needs

## Step 7: Test the Connection

1. Start your local server:
   ```bash
   cd Backend
   npm start
   ```

2. You should see: `MongoDB connected: cluster0.xxxxx.mongodb.net`

3. If you see connection errors:
   - Verify your username and password are correct
   - Check that your IP address is whitelisted
   - Ensure the connection string format is correct
   - Check MongoDB Atlas cluster status

## Connection String Format

Your final connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name?retryWrites=true&w=majority
```

**Important Notes:**
- Replace special characters in password with URL encoding:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`
  - `?` → `%3F`

## Troubleshooting

### Connection Timeout
- Check your network access settings in MongoDB Atlas
- Verify your IP address is whitelisted
- Try allowing access from anywhere (`0.0.0.0/0`) for testing

### Authentication Failed
- Double-check your username and password
- Ensure password is URL-encoded if it contains special characters
- Verify the user has proper database privileges

### DNS Resolution Error
- Ensure you're using the correct cluster connection string
- Check that your cluster is running (not paused)

### Serverless/Function Timeout
- The connection is now optimized with connection pooling
- Connections are cached and reused across function invocations
- If issues persist, check Vercel function timeout settings

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for database users
3. **Restrict IP access** in production when possible
4. **Use environment variables** for all sensitive data
5. **Rotate passwords** periodically
6. **Enable MongoDB Atlas monitoring** and alerts

## Free Tier Limits (M0)

- 512 MB storage
- Shared RAM and vCPU
- No backup retention (manual backups available)
- Perfect for development and small applications

For production with higher traffic, consider upgrading to M10 or higher.

