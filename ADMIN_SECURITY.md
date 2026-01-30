# 🔐 ADMIN ACCESS & SECURITY GUIDE

## ⚠️ IMPORTANT: Admin Access is Restricted

### How Admin Access Works

**ONLY the super administrator can access the admin panel.**

Regular users **CANNOT**:
- Access `/admin` routes
- Become admin by themselves
- See admin features
- Promote other users

### Super Admin Account

The super admin account is automatically created when the app starts.

**Default Credentials:**
- Email: `admin@salonedigitalvault.com`
- Password: `ChangeThisPassword123!`

**⚠️ CRITICAL: Change these credentials immediately!**

### How to Change Super Admin Credentials

1. **Create a `.env.local` file** in the root directory (it's gitignored for security)

2. **Add these lines:**
```env
SUPER_ADMIN_EMAIL=your-secure-email@example.com
SUPER_ADMIN_PASSWORD=YourVerySecurePassword123!
```

3. **Restart the development server:**
```bash
# Stop the server (Ctrl+C)
npm run dev
```

4. **The new credentials will be shown in the console:**
```
✅ Super Admin account created
📧 Email: your-secure-email@example.com
🔐 Password: YourVerySecurePassword123!
⚠️  CHANGE THIS PASSWORD IMMEDIATELY!
```

### Logging in as Super Admin

1. Go to `http://localhost:3000/login`
2. Use **Password** tab (not OTP)
3. Enter your super admin email and password
4. You'll be redirected to `/admin`

### What Happens if Non-Admin Tries to Access Admin Panel

1. They are immediately redirected to login
2. After login, if they're not admin, they see an alert:
   ```
   ⛔ Access Denied: You do not have admin privileges.
   
   Only the super administrator can access this area.
   ```
3. They are redirected to their regular dashboard

### How to Promote Users to Admin

As the super admin, you can promote trusted users:

1. **Login to admin panel** at `/admin`
2. **Go to User Management** (or use the API)
3. **Enter the user's email**
4. **Click "Promote to Admin"**
5. **User receives confirmation email**

**API Method:**
```bash
POST /api/admin/promote-user
Headers: Authorization: Bearer YOUR_ADMIN_TOKEN
Body: { "email": "user@example.com" }
```

### Security Features

✅ **Password Hashing** - bcrypt with 10 salt rounds
✅ **JWT Tokens** - 7-day expiration
✅ **Role-Based Access Control** - Admin vs Citizen
✅ **Route Protection** - AdminGuard component
✅ **Session Management** - Secure token storage
✅ **Audit Logging** - All admin actions logged

### Admin Capabilities

Once logged in as admin, you can:

- ✅ Create and manage events
- ✅ Scan QR codes for check-in/check-out
- ✅ Promote users to admin role
- ✅ Approve/reject documents
- ✅ View analytics and reports
- ✅ Manage email templates
- ✅ Access all system data

### Regular User Capabilities

Regular users (citizens) can:

- ✅ Sign up and create account
- ✅ Upload documents
- ✅ Register for events
- ✅ View their QR codes
- ✅ Provide feedback
- ✅ Manage their profile

**They CANNOT:**
- ❌ Access `/admin` routes
- ❌ Promote themselves or others
- ❌ Create events
- ❌ Scan QR codes
- ❌ Approve documents

### Testing Admin Access

**Test 1: Super Admin Login**
```
1. Go to /login
2. Email: admin@salonedigitalvault.com
3. Password: ChangeThisPassword123!
4. Should redirect to /admin
```

**Test 2: Regular User Blocked**
```
1. Sign up as regular user
2. Try to visit /admin
3. Should see "Access Denied" alert
4. Redirected to /dashboard
```

**Test 3: Promote User**
```
1. Login as super admin
2. Go to /admin/users
3. Enter user email
4. Click promote
5. User should receive email
```

### Production Deployment

Before deploying to production:

1. **Set strong credentials in production environment variables**
2. **Use a real database** (not mock-db)
3. **Enable HTTPS** (required for security)
4. **Configure SMTP** for real emails
5. **Set up proper session storage** (Redis recommended)
6. **Enable rate limiting** on auth endpoints
7. **Set up monitoring** and alerts

### Environment Variables for Production

```env
# Super Admin (CHANGE THESE!)
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PASSWORD=VerySecurePassword123!@#

# Database
DATABASE_URL=postgresql://...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Security
JWT_SECRET=very-long-random-string-here
SESSION_SECRET=another-long-random-string

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Troubleshooting

**Problem: Can't login as admin**
- Check `.env.local` file exists
- Verify credentials match
- Check console for super admin creation message
- Restart dev server

**Problem: Regular user can access admin**
- This should NEVER happen
- Check AdminGuard is properly imported
- Verify auth token is valid
- Check user role in database

**Problem: Forgot super admin password**
- Delete `.env.local`
- Restart server
- Use default credentials
- Immediately change them

### Security Best Practices

1. **Never commit `.env.local` to git** (it's gitignored)
2. **Use strong passwords** (16+ characters, mixed case, numbers, symbols)
3. **Change default credentials immediately**
4. **Limit admin promotions** to trusted users only
5. **Monitor admin actions** via audit logs
6. **Use 2FA** in production (future enhancement)
7. **Regular security audits**

### Quick Reference

| Action | URL | Required Role |
|--------|-----|---------------|
| Sign Up | `/signup` | None |
| Login | `/login` | None |
| User Dashboard | `/dashboard` | Citizen |
| Admin Dashboard | `/admin` | Admin Only |
| Promote User | `/api/admin/promote-user` | Admin Only |
| Create Event | `/api/events` | Admin Only |
| QR Scanner | `/admin/scanner` | Admin Only |

---

**Remember: With great power comes great responsibility. Protect your admin credentials!** 🔐
