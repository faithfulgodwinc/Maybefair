# Maybefair

**AI-Powered Email Management & Reply Generation Platform**

Maybefair is an intelligent email management system that leverages AI to automatically categorize emails, generate professional draft responses, and streamline your email workflow. Built with Next.js, Supabase, and Google's Gemini AI.

---

## 🌟 Features

### Email Management
- **Gmail Integration** - Seamless OAuth2 authentication with Gmail API
- **Smart Categorization** - AI-powered email classification (Urgent, Meeting, Question, Newsletter, Other)
- **Intelligent Sync** - Fast incremental sync with visual progress indicators
- **Email Search & Filter** - Quickly find emails by category, sender, or content
- **Text-to-Speech** - Listen to emails with built-in TTS functionality
- **Detailed Email View** - Full email content with metadata and threading

### AI Draft Generation
- **4-Stage Visual Feedback** - Engaging progress indicator during draft generation
  - 🤔 Understanding concept
  - 📋 Analyzing expectations
  - ✍️ Generating response
  - ✅ Draft ready
- **Smart Draft Responses** - Context-aware replies powered by Gemini AI
- **Edit & Send** - Review, edit, and send drafts directly from the platform
- **Draft Management** - Comprehensive drafts page with tabs (All/Pending/Sent)

### User Experience
- **Premium UI/UX** - Executive-level design with smooth animations
- **Dark Mode Support** - Elegant dark theme throughout
- **Responsive Design** - Optimized for desktop and mobile
- **Real-time Updates** - Live sync status and notifications
- **Delete Confirmation** - Premium modal for safe draft deletion

### Background Processing
- **Automated Deep Sync** - Vercel Cron job for daily email synchronization
- **Batch Processing** - Concurrent email processing (5 emails at a time)
- **Efficient Pagination** - Smart handling of large email volumes

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Premium UI components
- **Lucide React** - Beautiful icon library

### Backend & Services
- **Supabase** - Authentication, database, and real-time subscriptions
- **Gmail API** - Email fetching and sending via googleapis
- **Google Gemini AI** - Email classification and draft generation
- **Vercel** - Deployment and serverless functions

### Key Libraries
- `@google/generative-ai` - Gemini AI integration
- `@supabase/ssr` - Server-side Supabase client
- `googleapis` - Gmail API client
- `canvas-confetti` - Celebration effects
- `class-variance-authority` - Component variants

---

## 📁 Project Structure

```
maybefair/
├── app/
│   ├── actions/              # Server actions
│   │   ├── sync-emails.ts    # Email sync logic
│   │   ├── generate-draft.ts # AI draft generation
│   │   └── draft-ops.ts      # Draft operations (send, delete)
│   ├── api/
│   │   └── cron/
│   │       └── sync/         # Automated deep sync
│   ├── dashboard/            # Main dashboard pages
│   │   ├── inbox/            # Email inbox
│   │   ├── drafts/           # Draft management
│   │   └── settings/         # User settings
│   ├── login/                # Authentication
│   └── layout.tsx            # Root layout
├── components/
│   ├── dashboard/            # Dashboard components
│   │   ├── email-card.tsx    # Email display card
│   │   ├── draft-card.tsx    # Draft display card
│   │   ├── sync-button.tsx   # Email sync with progress
│   │   └── draft-stage-indicator.tsx # Draft generation progress
│   └── ui/                   # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       └── delete-confirmation-modal.tsx
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── gmail/                # Gmail service
│   └── classification.ts     # AI email classification
├── public/                   # Static assets
└── supabase/                 # Database migrations
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- Supabase account
- Google Cloud Platform account (for Gmail API)
- Google AI Studio account (for Gemini API)

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth (Gmail API)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/maybefair.git
   cd maybefair
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations in `supabase/`
   - Create tables: `emails`, `drafts`, `user_tokens`

4. **Configure Google Cloud Platform**
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

5. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📊 Database Schema

### `emails` Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- gmail_id (text, unique)
- subject (text)
- sender (text)
- snippet (text)
- category (text) -- urgent, meeting, question, newsletter, other
- received_at (timestamp)
- created_at (timestamp)
```

### `drafts` Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- email_id (uuid, foreign key)
- content (text)
- status (text) -- draft, sent
- created_at (timestamp)
- updated_at (timestamp)
```

### `user_tokens` Table
```sql
- user_id (uuid, primary key, foreign key)
- access_token (text, encrypted)
- refresh_token (text, encrypted)
- expires_at (timestamp)
```

---

## 🔄 Key Features Explained

### Email Sync Process
1. **Fast Sync** - Fetches last 10 unread emails (user-triggered)
2. **Deep Sync** - Fetches all emails from last 7 days (automated via cron)
3. **Batch Processing** - Processes 5 emails concurrently for speed
4. **Visual Progress** - Real-time progress bar with batch completion

### AI Draft Generation
1. User clicks "Draft Reply" on an email
2. System shows 4-stage progress indicator
3. Gemini AI analyzes email content and context
4. Generates professional, context-aware response
5. User can edit, save, or send immediately

### Authentication Flow
1. User signs in with email/password or Google OAuth
2. Gmail OAuth consent for email access
3. Tokens stored securely in Supabase (encrypted)
4. Automatic token refresh on expiry

---

## 🎨 UI/UX Highlights

- **Glassmorphism** - Modern frosted glass effects
- **Smooth Animations** - Framer Motion for all transitions
- **Micro-interactions** - Hover effects, button states, loading indicators
- **Premium Typography** - Clean, executive-level fonts
- **Responsive Grid** - Adaptive layouts for all screen sizes
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin master
   ```

2. **Import to Vercel**
   - Connect your GitHub repository
   - Add environment variables
   - Deploy

3. **Configure Cron Job**
   - Vercel automatically reads `vercel.json`
   - Daily sync runs at midnight UTC

### Environment Variables (Production)
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Ensure all API keys are set in Vercel dashboard
- Add production redirect URI to Google Cloud Console

---

## 📝 Usage Guide

### Syncing Emails
1. Navigate to Dashboard
2. Click "Sync Emails" button
3. Watch real-time progress
4. Emails appear categorized by AI

### Generating Drafts
1. Click "Draft Reply" icon on any email
2. Watch 4-stage generation process
3. Review generated draft
4. Edit if needed
5. Click "Send Now" or save for later

### Managing Drafts
1. Navigate to "Drafts" page
2. Use tabs to filter: All / Pending / Sent
3. Edit pending drafts
4. Delete with confirmation modal
5. Send directly from drafts page

---

## 🔐 Security

- **Encrypted Tokens** - Gmail tokens encrypted at rest
- **Server-Side Auth** - Supabase SSR for secure authentication
- **Row-Level Security** - Supabase RLS policies on all tables
- **Environment Variables** - Sensitive data never committed
- **HTTPS Only** - Enforced in production

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Powering intelligent email classification and draft generation
- **Supabase** - Backend infrastructure and authentication
- **Vercel** - Hosting and serverless functions
- **shadcn/ui** - Beautiful, accessible UI components

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Supabase, and AI**
