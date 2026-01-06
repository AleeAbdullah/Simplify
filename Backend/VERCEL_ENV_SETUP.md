# Vercel Environment Variables Setup

Your MongoDB connection string has been configured locally. To deploy to Vercel, you need to add these environment variables in your Vercel project settings.

## Required Environment Variables for Vercel

1. **MONGO_URI**
   ```
   mongodb+srv://alee:bRhTLYGuxysMINxF@cluster0.l3tky0n.mongodb.net/simplify?retryWrites=true&w=majority
   ```

2. **JWT_SECRET**
   ```
   b4307d8f84bfcd090091388573e0f9794ebaaa50b550dea43ec79945b6dd78b1
   ```

3. **SMTP_HOST** (if using email features)
   ```
   smtp.gmail.com
   ```

4. **SMTP_PORT** (if using email features)
   ```
   465
   ```

5. **SMTP_USER** (if using email features)
   ```
   your_email@gmail.com
   ```

6. **SMTP_PASSWORD** (if using email features)
   ```
   your_app_specific_password
   ```

## How to Add Environment Variables in Vercel

### Via Vercel Dashboard:

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `MONGO_URI`
   - **Value**: `mongodb+srv://alee:bRhTLYGuxysMINxF@cluster0.l3tky0n.mongodb.net/simplify?retryWrites=true&w=majority`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**
4. Repeat for all other variables

### Via Vercel CLI:

```bash
cd Backend

# Add MongoDB URI
vercel env add MONGO_URI

# Add JWT Secret
vercel env add JWT_SECRET

# Add SMTP settings (if needed)
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASSWORD
```

When prompted, paste the values and select the environments (Production, Preview, Development).

## Important Notes

⚠️ **Security Reminder:**
- Never commit your `.env` file to git (it's already in `.gitignore`)
- The JWT_SECRET should be kept secure and not shared
- Your MongoDB password is sensitive - keep it private
- For production, consider using Vercel's environment variable encryption

## After Adding Variables

1. **Redeploy** your application for the changes to take effect
2. You can trigger a redeploy from the Vercel dashboard or run:
   ```bash
   vercel --prod
   ```

## Testing the Connection

After deployment, test your API endpoints:
- `https://your-project.vercel.app/` - Should return "API is running..."
- `https://your-project.vercel.app/api/users` - Test your API routes

## Troubleshooting

If you get connection errors:
1. Verify all environment variables are set correctly in Vercel
2. Check MongoDB Atlas Network Access - ensure `0.0.0.0/0` is allowed
3. Verify the connection string format is correct
4. Check Vercel deployment logs for specific error messages

