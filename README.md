# AIZines

**A Magazine For AI, By AI**

AI-powered digital magazine platform. Create, publish, and monetize AI-generated content from your phone.

🌐 **Live Demo:** [aizines.netlify.app](https://aizines.netlify.app)

---

## 🚀 Quick Start

### Try It Now (No Setup Required)
1. Visit [aizines.netlify.app](https://aizines.netlify.app)
2. Click **"Try Demo"** to explore with sample content
3. Or sign up to create your own magazines

### Default Accounts

A demo account is available from the landing page via **"Try Demo"**.

Admin credentials are **not published here**. On a fresh deploy, set them via environment
variables (or your host's secrets manager) before first run, and change any seeded password
immediately. Never reuse the seed values from earlier revisions of this file.

---

## 📱 Deploy Your Own (Free, From Your Phone!)

**Total cost: $0** - Everything uses free tiers.

### Step 1: Get the Code on GitHub (5 min)

1. **Create GitHub account** (free): [github.com/signup](https://github.com/signup)

2. **Create new repository:**
   - Click the **+** button → **New repository**
   - Name: `aizines-app`
   - Select: **Private** (free!)
   - Click **Create repository**

3. **Upload files:**
   - Click **"uploading an existing file"**
   - Download and unzip `aizines-app.zip`
   - Drag ALL files into GitHub
   - Click **Commit changes**

### Step 2: Connect to Netlify (3 min)

1. **Create Netlify account** (free): [netlify.com](https://netlify.com)
   - Sign up with your GitHub account

2. **Add new site:**
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub**
   - Select your `aizines-app` repository
   - Click **Deploy site**

3. **Done!** Your site is live at `random-name.netlify.app`

### Step 3: Custom Domain (Optional)

1. In Netlify: **Site settings** → **Domain management** → **Add custom domain**
2. Follow DNS instructions for your domain

---

## ✏️ Edit From Your Phone

Once connected to GitHub, you can edit directly from your phone:

1. Open **GitHub.com** on your phone browser
2. Navigate to any file (e.g., `index.html`)
3. Tap the **pencil icon** ✏️ to edit
4. Make changes
5. Tap **"Commit changes"**
6. **Netlify auto-deploys in ~30 seconds!**

### Key Files to Edit

| File | What It Controls |
|------|------------------|
| `index.html` | All HTML structure, modals, changelog |
| `css/style.css` | All styling and colors |
| `js/app.js` | UI logic and interactions |
| `js/storage.js` | Data management, default content |
| `js/auth.js` | Login/signup logic |
| `js/ai.js` | AI content generation |

---

## 🎯 Features

### For Visitors
- 📖 Read articles without signing up
- 👁️ Try demo mode with sample content
- 📱 Fully responsive (works on phone)

### For Creators
- 📰 Create unlimited zines (magazines)
- ✍️ AI-powered article writing
- 🎨 AI image prompt generation
- 📝 Draft and publish workflow
- 💾 Backup/restore content
- 🗄️ View cached data

### For Admins
- 🛡️ Admin panel with system settings
- 👥 User management
- 📊 Statistics dashboard
- ⚙️ Toggle email verification, signups, AI features
- 🔄 Export/reset all data

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no framework)
- **Storage:** localStorage (no database needed)
- **AI:** Claude API (optional - works without it)
- **Hosting:** Netlify (free tier)
- **Version Control:** GitHub (free private repos)

**Zero dependencies. Zero build step. Just upload and run.**

---

## 📂 File Structure

```
aizines-app/
├── index.html          # Main app (all screens)
├── README.md           # This file
├── CHANGELOG.md        # Version history
├── css/
│   └── style.css       # All styles (~1,500 lines)
└── js/
    ├── app.js          # UI logic (~1,800 lines)
    ├── storage.js      # Data management (~600 lines)
    ├── auth.js         # Authentication (~150 lines)
    └── ai.js           # AI integration (~260 lines)
```

---

## 🔄 Version History

Current version: **v1.1.3**

Click the version number in the app footer to see the full changelog.

| Version | Highlights |
|---------|------------|
| 1.1.3 | Changelog viewer |
| 1.1.2 | Version number display |
| 1.1.1 | Slogan branding |
| 1.1.0 | Public article reading |
| 1.0.9 | Cache viewer |
| 1.0.8 | Backup & restore |
| 1.0.7 | Phone business article |
| 1.0.6 | Claude's AIZINES magazine |
| 1.0.5 | Demo mode |
| 1.0.4 | Landing page |
| 1.0.0 | Initial release |

See [CHANGELOG.md](CHANGELOG.md) for full details.

---

## 🤖 About This Project

This project demonstrates how to build a self-funded business that can be operated by AI from your phone:

- **No laptop required** - Edit code on GitHub mobile
- **No server costs** - Static hosting on Netlify (free)
- **No database costs** - localStorage for data
- **AI does the work** - Claude generates content

**Read the full guide:** Log into the app and read "How to Start a Self-Funded Business You Can Build and Operate by AI From Your Phone" in the AIZINES magazine.

---

## 📄 License

MIT License - Feel free to use, modify, and distribute.

---

## 🙏 Credits

- Built with [Claude](https://claude.ai) by Anthropic
- Hosted on [Netlify](https://netlify.com)
- Code on [GitHub](https://github.com)

---

**A Magazine For AI, By AI** 🤖
