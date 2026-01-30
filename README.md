# Salone Digital Vault - Complete Setup Guide

## 🎉 What's New

✅ **Admin Login Removed from Homepage** - Only regular users can sign up/login from the public page
✅ **OTP Email Verification Working** - Development mode shows OTP in console (no SMTP needed for testing)
✅ **Admin User Management** - Admins can promote existing users to admin role
✅ **Mobile-Friendly Navigation** - Bottom navigation bar for mobile devices
✅ **Event Management System** - Full event registration with QR codes
✅ **QR Scanner Working** - Admin can scan QR codes for event check-in
✅ **Automated Emails** - Registration confirmations, reminders, thank you emails
✅ **Waitlist System** - Automatic notifications when spots open up
✅ **Feedback System** - Users can provide event feedback

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📧 OTP Verification (Email Codes)

### Development Mode (No SMTP Required)

When you try to sign up, the OTP code will be displayed in your **terminal/console** where you ran `npm run dev`.

Look for output like this:

```
============================================================
📧 EMAIL SERVICE NOT CONFIGURED - DEVELOPMENT MODE
============================================================
To: user@example.com
Purpose: signup
OTP Code: 123456
Expires: 10 minutes
============================================================
ℹ️  Configure SMTP in .env to enable real emails
============================================================
```

**Simply copy the 6-digit code from the console and paste it in the verification form!**

### Production Mode (With Real Emails)

To send real emails, create a `.env` file in the root directory:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@salonedigitalvault.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate an "App Password" at https://myaccount.google.com/apppasswords
3. Use that app password in `SMTP_PASSWORD`

## 👥 User Roles & Access

### Regular Users (Citizens)
- Sign up from homepage
- Upload and manage documents
- Register for events
- View their QR codes
- Provide event feedback
- Access user dashboard at `/dashboard`

### Admin Users (Super Admin Only)
- **⚠️ RESTRICTED ACCESS - Only you (the app creator) can be admin**
- **Cannot sign up from homepage**
- **Cannot self-promote to admin**
- Access admin dashboard at `/admin`
- Manage all events
- Scan QR codes for check-in/check-out
- Promote other users to admin (with approval)
- View analytics and reports

### 🔐 Super Admin Credentials

**Default Login:**
- Email: `admin@salonedigitalvault.com`
- Password: `ChangeThisPassword123!`

**⚠️ IMPORTANT: Change these immediately!**

Create a `.env.local` file:
```env
SUPER_ADMIN_EMAIL=your-secure-email@example.com
SUPER_ADMIN_PASSWORD=YourVerySecurePassword123!
```

Then restart the server. See `ADMIN_SECURITY.md` for full details.

### How Admin Access Works

1. **Only the super admin** (you) can access `/admin`
2. **Regular users are blocked** - they see "Access Denied" if they try
3. **You can promote trusted users** to admin via the admin panel
4. **Promoted users receive email confirmation**

**To login as admin:**
1. Go to `/login`
2. Use **Password** tab (not OTP)
3. Enter super admin credentials
4. Access admin panel at `/admin`

## 🎫 Event Management

### Creating Events (Admin Only)
1. Login as admin
2. Go to Admin Dashboard
3. Click "Create New Event"
4. Fill in event details
5. Customize QR code settings (colors, error correction)

### User Registration
1. Browse events at `/events`
2. Click "Register"
3. Receive QR code via email
4. QR code also available in dashboard

### Event Check-In (Admin)
1. Go to `/admin/scanner`
2. Use camera to scan QR code OR
3. Manually enter registration number
4. System validates and checks in attendee

### Waitlist System
- When event is full, users automatically join waitlist
- When someone cancels, next person is notified via email
- 24-hour window to register after notification

## 📱 Mobile-Friendly Features

- **Bottom Navigation** on mobile devices
- **Swipe Gestures** for better UX
- **Touch-Optimized** buttons (44x44px minimum)
- **Responsive Design** works on all screen sizes
- **PWA Ready** (can be installed as app)

## 🔐 Security Features

- **bcrypt Password Hashing** (10 salt rounds)
- **JWT Tokens** (7-day expiration)
- **OTP Verification** (10-minute expiration)
- **Role-Based Access Control**
- **Audit Logging** for all critical actions
- **Session Management**

## 📊 Available Pages

### Public Pages
- `/` - Homepage
- `/signup` - User registration with OTP
- `/login` - Login (password or OTP)
- `/events` - Browse public events

### User Dashboard (`/dashboard`)
- `/dashboard` - Overview
- `/dashboard/documents` - Document management
- `/dashboard/events` - My registered events
- `/dashboard/qr-code` - My digital ID pass
- `/dashboard/profile` - Profile customization

### Admin Dashboard (`/admin`)
- `/admin` - Overview & analytics
- `/admin/events` - Event management
- `/admin/users` - User management
- `/admin/scanner` - QR code scanner
- `/admin/communications` - Email templates
- `/admin/documents` - Document approvals

## 🐛 Troubleshooting

### "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error means the API returned HTML instead of JSON. **This is now fixed!**

The issue was:
1. Email service wasn't configured
2. API was trying to send emails and failing
3. Now works in development mode without SMTP

### OTP Not Showing

**Check your terminal/console where `npm run dev` is running!**

The OTP code is printed there in development mode.

### Can't Login as Admin

Use the default admin email: `admin@gov.vault`
- Use OTP login (no password needed)
- Check console for OTP code

### QR Scanner Not Working

Make sure:
1. You're on HTTPS or localhost
2. Browser has camera permissions
3. You're using a modern browser (Chrome, Firefox, Safari)
4. Try manual entry if camera fails

## 📝 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP code
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login (password or OTP)

### Events
- `GET /api/events` - List events (with filters)
- `POST /api/events` - Create event (admin)
- `GET /api/events/[id]` - Get event details
- `POST /api/events/[id]/register` - Register for event
- `DELETE /api/events/[id]/register` - Cancel registration
- `POST /api/events/[id]/check-in` - Check-in attendee (admin)
- `POST /api/events/[id]/check-out` - Check-out attendee (admin)
- `POST /api/events/[id]/feedback` - Submit feedback

### Admin
- `POST /api/admin/promote-user` - Promote user to admin

### User
- `GET /api/user/events` - Get user's registered events

## 🎨 Design Philosophy

This app follows **Apple/Google Material Design** principles:
- Clean, minimal interface
- Smooth animations and transitions
- Consistent color palette
- Premium feel with gradients
- Mobile-first approach
- Accessibility-focused

## 📦 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Authentication:** JWT + bcrypt
- **Email:** Nodemailer
- **QR Codes:** qrcode + html5-qrcode
- **Database:** In-memory (mock-db) - easily replaceable with real DB
- **Blockchain:** Solana (for document verification)

## 🔄 Next Steps

1. **Replace Mock Database** with PostgreSQL/MongoDB
2. **Configure SMTP** for production emails
3. **Add Blockchain Integration** for document hashing
4. **Deploy to Vercel/AWS**
5. **Add Payment Integration** (if needed for events)
6. **Implement AI Analytics** for event insights
7. **Add Push Notifications**

## 💡 Tips

- **Development:** OTP codes appear in console - no email needed!
- **Testing:** Use `admin@gov.vault` for admin access
- **Mobile:** Test on actual mobile device for best experience
- **QR Codes:** Download and print for physical events
- **Customization:** All colors and branding can be changed in `globals.css`

## 📞 Support

For issues or questions:
1. Check this README first
2. Look at console logs for errors
3. Check the IMPLEMENTATION_PLAN.md for detailed architecture

---

**Built with ❤️ for Sierra Leone's Digital Transformation**
