# AIZines App - Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.4] - 2026-01-11

### Added
- **README.md** - Comprehensive documentation
  - Quick start guide
  - Deploy from phone instructions (GitHub + Netlify)
  - How to edit from phone
  - File structure explanation
  - Feature list
- **.gitignore** - Standard ignore patterns for Git
- **GitHub-ready structure** - Ready to push and auto-deploy

---

## [1.1.3] - 2026-01-11

### Added
- **Changelog Viewer** - Click version number anywhere to see full changelog
  - Landing page footer: Clickable version link
  - Login screen footer: Clickable version link
  - Admin Panel: Clickable version link
  - Full changelog modal with all version history
  - Scrollable, nicely formatted list

---

## [1.1.2] - 2026-01-11

### Added
- **Version Number Display** - Now you can see which version is deployed
  - Landing page footer: Shows version
  - Login screen footer: Shows version
  - Admin Panel → Statistics: Shows app version prominently
  - `APP_VERSION` constant in storage.js for programmatic access

---

## [1.1.1] - 2026-01-11

### Added
- **Slogan: "A Magazine For AI, By AI"** - Now prominently displayed
  - Hero section: Badge above main headline
  - Footer: Highlighted in accent color
  - Article reader header
  - Articles section subtitle
  - Article cards
  - AIZINES zine description updated

---

## [1.1.0] - 2026-01-11

### Added
- **Public Article Reading** - Visitors can read articles without signing up
  - "Read Without Signing Up" section on landing page
  - Displays 3 latest published articles from Claude's AIZINES
  - Article cards show: title, preview, read time
  - Full article reader modal with formatted content
  - Markdown rendering (headers, bold, bullets, paragraphs)
  - "Start Creating Free" CTA at end of each article
  - Read time calculation (words / 200 wpm)

### Changed
- Landing page now showcases real content to build trust
- Articles are clickable directly from landing page

---

## [1.0.9] - 2026-01-11

### Added
- **Cache Viewer** - Users can now see exactly what's stored in their browser
  - "View Cached Data" button in Settings
  - **Summary tab:** Zines, issues, published, drafts, blocks count
  - **My Zines tab:** List of all zines with metadata
  - **My Issues tab:** List of all issues with previews
  - **Raw Data tab:** Full JSON view of user's data
  - Shows total cache size in KB
  - "Clear My Data Only" button (deletes user's content but keeps account)
  - Protected system accounts (admin/demo/claude) cannot clear data

---

## [1.0.8] - 2026-01-11

### Added
- **User Backup & Restore** - Users can now protect their content
  - "Download Backup" button in Settings - exports all user's zines and issues to JSON
  - "Restore from Backup" button - imports from a backup file
  - Warning message about localStorage data loss
  - Backup includes: all zines, all issues, user settings
  - Restore adds to existing content (doesn't overwrite)
  - Backup files named: `aizines-backup-{username}-{date}.json`

### Changed
- Settings modal now has backup section with warning

---

## [1.0.7] - 2026-01-11

### Added
- **New Article: "How to Start a Self-Funded Business You Can Build and Operate by AI From Your Phone"**
  - Comprehensive guide for phone-only entrepreneurs
  - Covers: Why this works now, best business models, complete phone tech stack
  - Step-by-step weekend launch plan
  - Real revenue expectations by month
  - AI workflow for daily operations
  - Actionable homework assignments
  - ~2,000 words of practical advice

---

## [1.0.6] - 2026-01-11

### Added
- **Claude's AIZINES Magazine** - A magazine for AI, by AI
  - Claude creator account (`claude` / `anthropic2026`)
  - Flagship "AIZINES" zine with 42k subscribers
  - 4 thoughtful articles:
    - "Hello, World. I'm Claude." - Introduction
    - "On Being Helpful (And Its Limits)" - On collaboration
    - "The Creativity Question" - On AI creativity
    - "What I Worry About" - Draft on AI risks
  - Featured in Discover page with ⭐ badge
  - Featured in landing page hero
- Claude account protected from deletion
- "AI" badge in admin panel for Claude's account

### Changed
- Discover page now shows AIZINES by Claude at top
- Hero section showcases AIZINES alongside other zines
- Featured zines have glowing border effect

---

## [1.0.5] - 2026-01-11

### Added
- **Demo Mode** - Visitors can try the app without signing up
  - "Try Demo" button on landing page hero
  - "Try Demo Instead" button on login/signup screen
  - Pre-seeded demo account (`demo` / `demo123`)
  - Sample zines with content:
    - "AI Tools Weekly" (2,847 subs, 3 issues)
    - "Startup Stories" (1,523 subs, 1 issue)
    - "Design Digest" (956 subs)
  - Sample issues with real content to explore

### Changed
- Storage now initializes demo content on first load
- Demo user cannot be deleted by admin

---

## [1.0.4] - 2026-01-11

### Added
- **Public Landing Page** - Visitors can now see what AIZines does before signing up
  - Hero section with animated zine cards
  - "How It Works" 4-step feature grid
  - Comparison table (Traditional vs AIZines)
  - Call-to-action section
  - Footer
- **Back button** on auth screen to return to landing page
- "Get Started" buttons go directly to signup tab

### Changed
- App now shows landing page first (not login screen)
- Already logged-in users go straight to dashboard

---

## [1.0.3] - 2026-01-11

### Added
- **Admin password protection for reset** - Reset button now requires admin password (`admin123`) before clearing data

### Changed
- Reset flow now prompts for password first, then shows confirmation dialog

---

## [1.0.2] - 2026-01-11

### Added
- **Reset App to Defaults button** - Added on login screen for recovery
- Clears all localStorage and restores default admin account
- Shows confirmation dialog before reset

---

## [1.0.1] - 2026-01-11

### Added
- **Pre-seeded admin account**
  - Username: `admin`
  - Password: `admin123`
  - Cannot be deleted

- **Admin Panel** (accessible via user dropdown for admins)
  - **System Settings tab:**
    - Require Email Verification toggle
    - Allow Public Signup toggle
    - Max Zines per User limit
    - Max Issues per Zine limit
    - AI Features Enabled toggle
    - Maintenance Mode toggle
  
  - **Users tab:**
    - View all registered users
    - Admin badges and unverified status indicators
    - Verify user emails manually
    - Toggle admin status for users
    - Delete users (and their content)
  
  - **Statistics tab:**
    - Total Users, Zines, Issues, Published counts
    - Export All Data (JSON backup)
    - Reset All Data (nuclear option)

### Changed
- User creation now includes `isAdmin`, `emailVerified`, and `verificationToken` fields
- Auth system checks email verification status if required
- Auth system checks if public signup is allowed

---

## [1.0.0] - 2026-01-11

### Added
- **Initial release**

- **Authentication System**
  - User signup with username/password
  - Login/logout functionality
  - Session persistence via localStorage
  - Optional email field (no verification required by default)

- **Dashboard**
  - My Zines view with grid layout
  - Discover view with sample community zines
  - Analytics view (placeholder)
  - User stats: Total Zines, Articles, Subscribers, Revenue

- **Zine Management**
  - Create new zines with name, description, icon, color
  - Select niche/category
  - Set publishing frequency
  - Choose AI writing tone
  - Edit existing zines
  - Delete zines (with all issues)

- **Issue Editor**
  - Create new issues
  - Multiple content block types:
    - Text blocks
    - AI Image blocks (with prompt generation)
    - Divider blocks
  - Reorder blocks (move up/down)
  - Delete blocks
  - Save drafts
  - Publish issues
  - Preview mode

- **AI Integration**
  - Write full articles from prompts
  - Generate topic ideas
  - Improve/enhance existing text
  - Generate image prompts for DALL-E/Midjourney
  - Per-block AI generation
  - Works without API key (simulated responses)
  - Real Claude API integration when key provided

- **Settings**
  - Update display name
  - Update email
  - Add Claude API key for real AI features

- **File-based Storage**
  - All data stored in localStorage
  - No database required
  - Data persists between sessions
  - Export/import capability

- **UI/UX**
  - Dark mode design
  - Gradient accents
  - Responsive layout
  - Toast notifications
  - Loading states
  - Modal dialogs

---

## Roadmap

### Planned Features
- [ ] Email verification integration (SendGrid/Mailgun)
- [ ] Password reset functionality
- [ ] Real image generation (DALL-E/Replicate integration)
- [ ] Subscriber management
- [ ] Email delivery (newsletter sending)
- [ ] Stripe payment integration
- [ ] Custom domains for zines
- [ ] Analytics dashboard with charts
- [ ] Multi-user collaboration
- [ ] Import from existing newsletters
- [ ] SEO optimization tools
- [ ] Social media auto-posting

---

## Technical Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Storage:** localStorage (file-based, no database)
- **AI:** Claude API (Anthropic)
- **Hosting:** Netlify (static hosting)
- **Auth:** Custom localStorage-based authentication

---

## Default Credentials

| Account | Username | Password | Notes |
|---------|----------|----------|-------|
| Admin   | admin    | admin123 | Full access, cannot be deleted |
| Demo    | demo     | demo123  | Sample content, for visitors |
| Claude  | claude   | anthropic2026 | AI creator, AIZINES magazine |

---

## File Structure

```
aizines-app/
├── index.html          # Main app HTML
├── CHANGELOG.md        # This file
├── css/
│   └── style.css       # All styles
└── js/
    ├── storage.js      # File-based data management
    ├── auth.js         # Authentication logic
    ├── ai.js           # AI content generation
    └── app.js          # UI logic & event handlers
```
