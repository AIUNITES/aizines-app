# AIZines - UA Test Plan

## Site Information
| Field | Value |
|-------|-------|
| **Site Name** | AIZines |
| **Repository** | aizines-app |
| **Live URL** | https://aiunites.github.io/aizines-app/ |
| **Local Path** | C:/Users/Tom/Documents/GitHub/aizines-app |
| **Last Updated** | January 24, 2026 |
| **Version** | 1.0.0 |
| **Based On** | Custom (not DemoTemplate) |
| **Tagline** | AI-Powered Magazine Creator |

---

## Pages Inventory

| Page | File | Description | Status |
|------|------|-------------|--------|
| Main App | index.html | All screens (SPA) | ✅ Active |

---

## Screens (In index.html)

| Screen | ID | Description | Status |
|--------|-----|-------------|--------|
| Landing | landing-screen | Hero, features, magazine showcase | ✅ |
| Auth | auth-screen | Login/Signup forms | ✅ |
| Dashboard | dashboard-screen | Magazine management | ✅ |

---

## Core Features

### 🔐 Authentication System
| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ | |
| User Login | ✅ | |
| Demo Mode Login | ✅ | |
| Logout | ✅ | |
| First User = Admin | ✅ | |

### 👤 User Menu & Modals (DemoTemplate Features)
| Feature | Status | Notes |
|---------|--------|-------|
| User Dropdown Menu | ⬜ | NOT IMPLEMENTED |
| Settings Modal | ⬜ | NOT IMPLEMENTED |
| Backup & Restore | ⬜ | NOT IMPLEMENTED |
| View Cache Modal | ⬜ | NOT IMPLEMENTED |
| Admin Panel Modal | ⬜ | NOT IMPLEMENTED |
| Legal Modal | ⬜ | NOT IMPLEMENTED |
| Toast Notifications | ⬜ | NOT IMPLEMENTED |

### 🎨 Landing Page
| Feature | Status | Notes |
|---------|--------|-------|
| Hero Section | ✅ | AI-POWERED MAGAZINES |
| Demo Badge | ✅ | Pre-launch indicator |
| Hero Zine Cards | ✅ | Animated magazine covers |
| Features Grid | ✅ | 4 feature cards |
| How It Works | ✅ | Step process |
| Sample Magazines | ✅ | Magazine showcase |
| Pricing Plans | ✅ | Free/Pro/Business |
| CTA Section | ✅ | |
| AIUNITES Webring | ✅ | Top navigation bar |

### 📰 AIZines-Specific Features
| Feature | Status | Notes |
|---------|--------|-------|
| Magazine Creator | ✅ | Create new magazines |
| Article Editor | ✅ | Write/edit articles |
| Template Selection | ✅ | Magazine templates |
| AI Content Generation | ✅ | AI writing assistance |
| PDF Export | ✅ | Download as PDF |
| Magazine Preview | ✅ | Live preview |
| Cover Designer | ✅ | Design covers |
| Publishing | ✅ | Publish magazines |

### ☁️ Cloud Integration
| Feature | Status | Notes |
|---------|--------|-------|
| CloudDB Module | ✅ | js/cloud-database.js |
| Script Tag Added | ⬜ | Needs verification |

---

## JavaScript Files

| File | Purpose | Status |
|------|---------|--------|
| app.js | Main app logic | ✅ |
| auth.js | Authentication | ✅ |
| storage.js | localStorage wrapper | ✅ |
| ai.js | AI content generation | ✅ |
| cloud-database.js | Cloud sync | ✅ |

---

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `aizines_users` | All user accounts |
| `aizines_currentUser` | Logged in user |
| `aizines_magazines` | User's magazines |

---

## Test Scenarios

### Landing Page Tests
- [ ] Hero loads with magazine cards
- [ ] Features grid displays
- [ ] Pricing section shows plans
- [ ] Login button works
- [ ] Try Demo logs in

### Authentication Tests
- [ ] Signup creates user
- [ ] Login validates credentials
- [ ] Demo login works
- [ ] Logout clears session

### Magazine Tests
- [ ] Create new magazine
- [ ] Edit magazine details
- [ ] Add articles
- [ ] Preview magazine
- [ ] Export to PDF
- [ ] Delete magazine

---

## Priority Actions (TODO)

| Action | Priority | Status |
|--------|----------|--------|
| Add User Dropdown Menu | High | 🔲 TODO |
| Add Settings Modal | High | 🔲 TODO |
| Add Backup & Restore | High | 🔲 TODO |
| Add Admin Panel Modal | Medium | 🔲 TODO |
| Add Toast Notifications | Medium | 🔲 TODO |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2026 | Initial release |

---

*Last tested: January 24, 2026*
