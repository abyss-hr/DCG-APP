# TODO: Email Notifications for Report Feature

## Current Status
✅ Reports are being saved to Firebase Firestore collection: `reports`
✅ Report modal working with user submission
⏳ Email notifications NOT yet implemented

---

## Implementation Options

### Option 1: Firebase Extensions (Easiest - No Code)
Firebase has a "Trigger Email" extension that automatically sends emails when documents are added to a collection.

**Steps:**
1. Go to Firebase Console → Extensions
2. Install "Trigger Email from Firestore"
3. Configure it to watch the `reports` collection
4. Set your email in the template
5. Configure email delivery service (SendGrid, Mailgun, etc.)

**Pros:** 
- No coding required
- Very simple setup
- Official Firebase solution

**Cons:** 
- Limited customization
- Requires email delivery service setup
- May have costs depending on volume

---

### Option 2: Firebase Cloud Functions (Recommended)
Create a serverless function that triggers when a new report is created and sends you an email via SendGrid/Mailgun/Nodemailer.

**Prerequisites:**
- Upgrade Firebase to Blaze plan (pay as you go)
- Install Firebase CLI: `npm install -g firebase-tools`
- Initialize Cloud Functions: `firebase init functions`

**Implementation Steps:**

1. **Install Dependencies:**
```bash
cd functions
npm install nodemailer
```

2. **Create Function (functions/index.js):**
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

exports.sendReportEmail = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap, context) => {
    const report = snap.data();
    
    // Configure your email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use App Password, not regular password
      }
    });
    
    const mailOptions = {
      from: 'your-app@example.com',
      to: 'your-email@gmail.com',
      subject: `New Report: ${report.issueType} - ${report.listingTitle}`,
      html: `
        <h2>New Listing Report</h2>
        <p><strong>Listing:</strong> ${report.listingTitle} (${report.listingId})</p>
        <p><strong>Issue Type:</strong> ${report.issueType}</p>
        <p><strong>Reporter Email:</strong> ${report.email}</p>
        <p><strong>Details:</strong> ${report.details || 'None provided'}</p>
        <p><strong>Time:</strong> ${report.timestamp}</p>
        <p><strong>Status:</strong> ${report.status}</p>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log('Report email sent successfully');
    } catch (error) {
      console.error('Error sending report email:', error);
    }
  });
```

3. **Gmail Setup (if using Gmail):**
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use the generated password in the code above

4. **Deploy Function:**
```bash
firebase deploy --only functions
```

**Pros:** 
- Automatic, real-time notifications
- Fully customizable email templates
- Professional solution
- Can add logic (filtering, priority, etc.)
- Secure (credentials stored in Cloud Functions)

**Cons:** 
- Requires Blaze plan (very cheap, usually free tier covers it)
- Need to set up Cloud Functions
- Slightly more complex initial setup

---

### Option 3: Admin Dashboard (Later)
Build an admin page in your app to view all reports (no automatic emails, just check the dashboard manually).

**Implementation Ideas:**
- Create admin route: `app/(drawer)/admin/reports.tsx`
- Fetch reports from Firestore
- Display in table/list format
- Add filters (status, issue type, date)
- Mark as resolved/pending
- Add search functionality

**Pros:**
- No external dependencies
- Full control over UI
- Can manage reports in-app
- No email costs

**Cons:**
- No automatic notifications
- Must manually check for new reports
- More development work

---

## Recommended Implementation Order

1. **Phase 1 (Done):** ✅ Save reports to Firestore
2. **Phase 2 (Next):** Implement Cloud Functions email notifications
3. **Phase 3 (Later):** Build admin dashboard for report management
4. **Phase 4 (Optional):** Add reply feature to respond to reporters

---

## Additional Enhancements (Future)

- [ ] Add email templates for different issue types
- [ ] Send confirmation email to reporter
- [ ] Add Slack/Discord webhook notifications
- [ ] Implement auto-reply with ticket number
- [ ] Add priority levels (urgent, normal, low)
- [ ] Create report analytics dashboard
- [ ] Add report resolution workflow
- [ ] Send weekly summary emails
- [ ] Add attachments/screenshots support

---

## Notes

- Current report data structure:
  ```javascript
  {
    listingId: string,
    listingTitle: string,
    issueType: 'bug' | 'wrong-info' | 'ownership' | 'closed' | 'duplicate' | 'inappropriate' | 'other',
    email: string,
    details: string,
    timestamp: ISO string,
    status: 'pending'
  }
  ```

- Firebase collection: `reports`
- Reporter email is stored for follow-up
- Consider GDPR/privacy compliance when storing emails
