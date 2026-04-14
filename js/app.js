/**
 * AIZines Main App
 * UI logic, event handlers, and app state management
 */

const App = {
  // Current state
  state: {
    currentZine: null,
    currentIssue: null,
    editingZineId: null
  },

  /**
   * Initialize the app
   */
  init() {
    this.bindEvents();
    this.loadLandingArticles();
    this.checkAuth();
  },

  /**
   * Check authentication status and show appropriate screen
   */
  checkAuth() {
    if (Auth.isLoggedIn()) {
      this.showDashboard();
    } else {
      this.showLandingPage();
    }
  },

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Landing page
    document.getElementById('landing-login-btn')?.addEventListener('click', () => this.showAuthScreen());
    document.getElementById('landing-start-btn')?.addEventListener('click', () => this.showAuthScreen('signup'));
    document.getElementById('landing-start-btn-2')?.addEventListener('click', () => this.showAuthScreen('signup'));
    document.getElementById('landing-demo-btn')?.addEventListener('click', () => this.loginAsDemo());
    document.getElementById('auth-demo-btn')?.addEventListener('click', () => this.loginAsDemo());

    // Article reader
    document.getElementById('close-article-reader')?.addEventListener('click', () => this.closeArticleReader());
    document.getElementById('reader-signup-btn')?.addEventListener('click', () => {
      this.closeArticleReader();
      this.showAuthScreen('signup');
    });
    document.getElementById('article-reader-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'article-reader-modal') this.closeArticleReader();
    });

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchAuthTab(e.target.dataset.tab));
    });

    // Back to landing
    document.getElementById('back-to-landing')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLandingPage();
    });

    // Auth forms
    document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignup(e));
    document.getElementById('reset-app-link')?.addEventListener('click', (e) => this.resetAppToDefaults(e));

    // User menu
    document.querySelector('.user-menu')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleUserMenu();
    });
    document.getElementById('logout-link')?.addEventListener('click', (e) => this.handleLogout(e));
    document.getElementById('settings-link')?.addEventListener('click', (e) => this.openSettings(e));

    // Dashboard navigation
    document.querySelectorAll('.nav-tab[data-view]').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchDashboardView(e.target.dataset.view));
    });

    // New zine buttons
    document.getElementById('new-zine-btn')?.addEventListener('click', () => this.openZineModal());
    document.getElementById('empty-new-zine-btn')?.addEventListener('click', () => this.openZineModal());

    // Backup reminder
    document.getElementById('backup-reminder-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSettings();
    });
    document.getElementById('dismiss-backup-reminder')?.addEventListener('click', () => this.dismissBackupReminder());

    // Zine modal
    document.getElementById('close-zine-modal')?.addEventListener('click', () => this.closeZineModal());
    document.getElementById('cancel-zine')?.addEventListener('click', () => this.closeZineModal());
    document.getElementById('zine-form')?.addEventListener('submit', (e) => this.handleZineSubmit(e));

    // Icon picker
    document.querySelectorAll('.icon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectIcon(e));
    });

    // Color picker
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectColor(e));
    });

    // Editor navigation
    document.getElementById('back-to-dashboard')?.addEventListener('click', () => this.showDashboard());
    document.querySelectorAll('.nav-tab[data-editor-view]').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchEditorView(e.target.dataset.editorView));
    });

    // New issue buttons
    document.getElementById('new-issue-btn')?.addEventListener('click', () => this.createNewIssue());
    document.getElementById('empty-new-issue-btn')?.addEventListener('click', () => this.createNewIssue());

    // Issue editor
    document.getElementById('back-to-zine')?.addEventListener('click', () => this.backToZine());
    document.getElementById('save-draft-btn')?.addEventListener('click', () => this.saveDraft());
    document.getElementById('publish-issue-btn')?.addEventListener('click', () => this.publishIssue());
    document.getElementById('preview-issue-btn')?.addEventListener('click', () => this.previewIssue());

    // Add block buttons
    document.querySelectorAll('.add-block-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.addBlock(e.currentTarget.dataset.type));
    });

    // AI actions
    document.getElementById('ai-write-article')?.addEventListener('click', () => this.aiWriteArticle());
    document.getElementById('ai-generate-ideas')?.addEventListener('click', () => this.aiGenerateIdeas());
    document.getElementById('ai-improve-text')?.addEventListener('click', () => this.aiImproveText());
    document.getElementById('ai-generate-image')?.addEventListener('click', () => this.aiGenerateImage());
    document.getElementById('ai-generate-btn')?.addEventListener('click', () => this.aiGenerateFromPrompt());

    // Preview modal
    document.getElementById('close-preview-modal')?.addEventListener('click', () => this.closePreviewModal());

    // Settings modal
    document.getElementById('close-settings-modal')?.addEventListener('click', () => this.closeSettingsModal());
    document.getElementById('cancel-settings')?.addEventListener('click', () => this.closeSettingsModal());
    document.getElementById('user-settings-form')?.addEventListener('submit', (e) => this.handleSettingsSubmit(e));
    document.getElementById('backup-data-btn')?.addEventListener('click', () => this.backupUserData());
    document.getElementById('restore-data-input')?.addEventListener('change', (e) => this.restoreUserData(e));

    // Cache viewer
    document.getElementById('view-cache-btn')?.addEventListener('click', () => this.openCacheViewer());
    document.getElementById('close-cache-modal')?.addEventListener('click', () => this.closeCacheModal());
    document.querySelectorAll('.cache-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchCacheTab(e.target.dataset.cacheTab));
    });
    document.getElementById('clear-my-cache-btn')?.addEventListener('click', () => this.clearMyCache());
    document.getElementById('cache-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'cache-modal') this.closeCacheModal();
    });



    // Legal modal (Terms & Privacy)
    document.getElementById('show-terms')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLegalModal('terms');
    });
    document.getElementById('show-privacy')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLegalModal('privacy');
    });
    document.getElementById('footer-terms')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLegalModal('terms');
    });
    document.getElementById('footer-privacy')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLegalModal('privacy');
    });
    document.getElementById('settings-terms')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeSettingsModal();
      this.showLegalModal('terms');
    });
    document.getElementById('settings-privacy')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeSettingsModal();
      this.showLegalModal('privacy');
    });
    document.getElementById('close-legal-modal')?.addEventListener('click', () => this.closeLegalModal());
    document.getElementById('legal-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'legal-modal') this.closeLegalModal();
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        document.getElementById('user-dropdown')?.classList.remove('active');
      }
    });

    // Close modals on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeZineModal();
        this.closePreviewModal();
        this.closeSettingsModal();
        this.closeAdminModal();
        this.closeCacheModal();
        this.closeArticleReader();
        this.closeLegalModal();
      }
    });

    // Modal backdrop clicks
    document.getElementById('zine-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'zine-modal') this.closeZineModal();
    });
    document.getElementById('preview-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'preview-modal') this.closePreviewModal();
    });
    document.getElementById('settings-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'settings-modal') this.closeSettingsModal();
    });
    document.getElementById('admin-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'admin-modal') this.closeAdminModal();
    });

    // Admin panel
    document.getElementById('admin-link')?.addEventListener('click', (e) => this.openAdminPanel(e));
    document.getElementById('close-admin-modal')?.addEventListener('click', () => this.closeAdminModal());
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchAdminTab(e.target.dataset.adminTab));
    });
    document.getElementById('system-settings-form')?.addEventListener('submit', (e) => this.handleSystemSettingsSubmit(e));
    document.getElementById('export-data-btn')?.addEventListener('click', () => this.exportAllData());
    document.getElementById('reset-data-btn')?.addEventListener('click', () => this.resetAllData());
  },

  // ==================== SCREENS ====================

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId)?.classList.add('active');
  },

  showLandingPage() {
    this.showScreen('landing-screen');
  },

  loadLandingArticles() {
    // Get Claude's published articles for the landing page
    const allIssues = Storage.getAllIssues();
    const claudeIssues = Object.values(allIssues)
      .filter(i => i.zineId === 'claude_zine_001' && i.status === 'published')
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 3); // Show up to 3 articles

    const grid = document.getElementById('landing-articles-grid');
    if (!grid) return;

    if (claudeIssues.length === 0) {
      grid.innerHTML = '<p style="color: var(--gray); grid-column: 1/-1;">No articles published yet. Start writing your first issue!</p>';
      return;
    }

    grid.innerHTML = claudeIssues.map(issue => {
      const firstBlock = issue.blocks?.find(b => b.type === 'text');
      const preview = firstBlock?.content?.substring(0, 150).replace(/[#*_]/g, '') || '';
      const readTime = this.calculateReadTime(issue.blocks || []);
      
      return `
        <div class="article-card" onclick="App.openArticleReader('${issue.id}')">
          <div class="article-card-header">
            <span class="article-card-icon">🤖</span>
            <span>AIZINES • For AI, By AI</span>
          </div>
          <h3 class="article-card-title">${this.escapeHtml(issue.title)}</h3>
          <p class="article-card-preview">${this.escapeHtml(preview)}...</p>
          <div class="article-card-footer">
            <span>${readTime} min read</span>
            <span class="article-card-read">Read →</span>
          </div>
        </div>
      `;
    }).join('');
  },

  calculateReadTime(blocks) {
    let wordCount = 0;
    blocks.forEach(block => {
      if (block.type === 'text' && block.content) {
        wordCount += block.content.split(/\s+/).length;
      }
    });
    return Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
  },

  openArticleReader(issueId) {
    const allIssues = Storage.getAllIssues();
    const issue = allIssues[issueId];
    
    if (!issue) {
      this.showToast('Article not found', 'error');
      return;
    }

    // Set title
    document.getElementById('reader-article-title').textContent = issue.title;

    // Render content
    const contentEl = document.getElementById('reader-article-content');
    contentEl.innerHTML = issue.blocks
      .filter(b => b.type === 'text')
      .map(block => this.renderArticleContent(block.content))
      .join('');

    // Show modal
    document.getElementById('article-reader-modal').classList.add('active');
  },

  renderArticleContent(content) {
    if (!content) return '';
    
    // Simple markdown-like rendering
    let html = this.escapeHtml(content);
    
    // Headers
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Bullets (• or -)
    html = html.replace(/^[•\-] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Paragraphs
    html = html.split('\n\n').map(p => {
      if (p.startsWith('<h') || p.startsWith('<ul')) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
    
    return html;
  },

  closeArticleReader() {
    document.getElementById('article-reader-modal')?.classList.remove('active');
  },

  showLegalModal(type) {
    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-modal-title');
    const termsContent = document.getElementById('terms-content');
    const privacyContent = document.getElementById('privacy-content');
    
    if (type === 'terms') {
      title.textContent = 'Terms of Service';
      termsContent.style.display = 'block';
      privacyContent.style.display = 'none';
    } else {
      title.textContent = 'Privacy Policy';
      termsContent.style.display = 'none';
      privacyContent.style.display = 'block';
    }
    
    modal.classList.add('active');
  },

  closeLegalModal() {
    document.getElementById('legal-modal')?.classList.remove('active');
  },

  showAuthScreen(tab = 'login') {
    this.showScreen('auth-screen');
    this.switchAuthTab(tab);
  },

  showDashboard() {
    this.showScreen('dashboard-screen');
    this.updateUserInfo();
    this.loadZines();
    this.loadDiscoverZines();
    this.updateStats();
  },

  showEditor(zineId) {
    const zine = Storage.getZine(zineId);
    if (!zine) {
      this.showToast('Zine not found', 'error');
      return;
    }
    this.state.currentZine = zine;
    this.showScreen('editor-screen');
    this.updateEditorHeader();
    this.loadIssues();
  },

  showIssueEditor(issueId) {
    const issue = Storage.getIssue(issueId);
    if (!issue) {
      this.showToast('Issue not found', 'error');
      return;
    }
    this.state.currentIssue = issue;
    this.showScreen('issue-editor-screen');
    this.renderIssueEditor();
  },

  // ==================== AUTH ====================

  switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`)?.classList.add('active');
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(`${tab}-form`)?.classList.add('active');
    document.getElementById('login-error').textContent = '';
    document.getElementById('signup-error').textContent = '';
    if (tab === 'signup') this.injectGeneratedPassword();
  },

  injectGeneratedPassword() {
    if (typeof PasswordUtils === 'undefined') return;
    const pw = document.getElementById('signup-password');
    const cf = document.getElementById('signup-confirm');
    if (!pw || pw.value) return;
    const v = PasswordUtils.generate();
    pw.value = v; if (cf) cf.value = v;
    pw.type = 'text'; if (cf) cf.type = 'text';
    document.getElementById('pw-suggest-bar')?.remove();
    const bar = document.createElement('div'); bar.id = 'pw-suggest-bar';
    bar.style.cssText = 'margin-top:8px;background:rgba(255,51,102,0.08);border:1px solid rgba(255,51,102,0.25);border-radius:8px;padding:8px 12px;font-size:0.8rem;color:#fca5a5;display:flex;align-items:center;gap:8px;flex-wrap:wrap';
    bar.innerHTML = '<span>🔐 Secure password generated.</span><span style="flex:1"></span><button type="button" id="pw-copy-btn" style="background:rgba(255,51,102,0.2);border:1px solid rgba(255,51,102,0.3);color:#fca5a5;border-radius:6px;padding:3px 10px;font-size:0.78rem;cursor:pointer;font-family:inherit;">📋 Copy</button><button type="button" id="pw-regen-btn" style="background:rgba(255,51,102,0.2);border:1px solid rgba(255,51,102,0.3);color:#fca5a5;border-radius:6px;padding:3px 10px;font-size:0.78rem;cursor:pointer;font-family:inherit;">🔄 New</button>';
    pw.parentElement.appendChild(bar);
    document.getElementById('pw-copy-btn').addEventListener('click', () => { navigator.clipboard.writeText(pw.value).then(() => { const b = document.getElementById('pw-copy-btn'); if(b){b.textContent='✅ Copied!';setTimeout(()=>{b.textContent='📋 Copy';},2000);} }); });
    document.getElementById('pw-regen-btn').addEventListener('click', () => { const n = PasswordUtils.generate(); pw.value = n; if(cf) cf.value = n; });
  },

  async handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('[type="submit"]'); if (btn) btn.disabled = true;
    try {
      await Auth.login(username, password);
      this.showToast('Welcome back!', 'success');
      this.showDashboard();
    } catch (error) {
      document.getElementById('login-error').textContent = error.message;
    } finally { if (btn) btn.disabled = false; }
  },

  async handleSignup(e) {
    e.preventDefault();
    const displayName = document.getElementById('signup-name').value.trim();
    const username    = document.getElementById('signup-username').value.trim();
    const email       = document.getElementById('signup-email').value.trim();
    const password    = document.getElementById('signup-password').value;
    const confirm     = document.getElementById('signup-confirm').value;
    if (password !== confirm) { document.getElementById('signup-error').textContent = 'Passwords do not match'; return; }
    const btn = e.target.querySelector('[type="submit"]'); if (btn) btn.disabled = true;
    try {
      await Auth.signup(displayName, username, email, password);
      this.showToast('Account created! Welcome to AIZines', 'success');
      this.showDashboard();
    } catch (error) {
      document.getElementById('signup-error').textContent = error.message;
    } finally { if (btn) btn.disabled = false; }
  },

  handleLogout(e) {
    e.preventDefault();
    Auth.logout();
    this.showToast('Logged out successfully', 'success');
    this.showAuthScreen();
    
    // Clear forms
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
  },

  loginAsDemo() {
    try {
      Auth.loginDemo();
      this.showToast('Welcome to the demo! Explore freely.', 'success');
      this.showDashboard();
    } catch (error) {
      this.showToast('Demo unavailable: ' + error.message, 'error');
    }
  },

  resetAppToDefaults(e) {
    e.preventDefault();
    
    const password = prompt('Enter admin password to reset:');
    
    if (password !== 'admin123') {
      this.showToast('Incorrect admin password', 'error');
      return;
    }
    
    if (!confirm('⚠️ Reset app to defaults?\n\nThis will:\n• Delete all users, zines, and content\n• Restore the admin account (admin/admin123)\n\nContinue?')) {
      return;
    }

    Storage.clearAll();
    this.showToast('App reset! Login with admin / admin123', 'success');
    
    // Clear forms
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
    document.getElementById('login-error').textContent = '';
    document.getElementById('signup-error').textContent = '';
  },

  toggleUserMenu() {
    document.getElementById('user-dropdown')?.classList.toggle('active');
  },

  updateUserInfo() {
    const user = Auth.getCurrentUser();
    if (user) {
      document.getElementById('user-display-name').textContent = user.displayName;
      document.getElementById('user-avatar').textContent = user.displayName.charAt(0).toUpperCase();
      
      // Show/hide admin link
      const adminLink = document.getElementById('admin-link');
      if (adminLink) {
        if (user.isAdmin) {
          adminLink.classList.add('visible');
        } else {
          adminLink.classList.remove('visible');
        }
      }
    }
  },

  // ==================== DASHBOARD ====================

  switchDashboardView(view) {
    document.querySelectorAll('.nav-tab[data-view]').forEach(t => t.classList.remove('active'));
    document.querySelector(`.nav-tab[data-view="${view}"]`)?.classList.add('active');

    document.querySelectorAll('.dashboard-view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${view}-view`)?.classList.add('active');
  },

  loadZines() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const zines = Storage.getUserZines(user.id);
    const grid = document.getElementById('zines-grid');
    const emptyState = document.getElementById('empty-zines');

    if (zines.length === 0) {
      grid.innerHTML = '';
      emptyState?.classList.add('active');
      return;
    }

    emptyState?.classList.remove('active');

    grid.innerHTML = zines.map(zine => {
      const issues = Storage.getZineIssues(zine.id);
      const publishedCount = issues.filter(i => i.status === 'published').length;
      
      return `
        <div class="zine-card" data-id="${zine.id}">
          <div class="zine-card-header" style="background: linear-gradient(135deg, ${zine.color}, ${this.adjustColor(zine.color, -30)});">
            ${zine.icon}
            <span class="zine-card-badge">${issues.length} issues</span>
          </div>
          <div class="zine-card-body">
            <h3 class="zine-card-title">${this.escapeHtml(zine.name)}</h3>
            <p class="zine-card-desc">${this.escapeHtml(zine.description)}</p>
            <div class="zine-card-stats">
              <span>📄 ${publishedCount} published</span>
              <span>👥 ${zine.subscribers || 0}</span>
            </div>
            <div class="zine-card-actions">
              <button class="zine-action-edit" onclick="App.showEditor('${zine.id}')">✏️ Edit</button>
              <button class="zine-action-delete" onclick="App.deleteZine('${zine.id}')">🗑️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  loadDiscoverZines() {
    // Sample community zines for discover page - featuring Claude's AIZINES
    const sampleZines = [
      { name: 'AIZINES', icon: '🤖', color: '#6366f1', subscribers: 42000, desc: 'A Magazine For AI, By AI. Thoughts on consciousness, creativity, and collaboration.', featured: true, author: 'Claude' },
      { name: 'AI Tools Weekly', icon: '💡', color: '#ff3366', subscribers: 12400, desc: 'The latest in AI tools and applications' },
      { name: 'Startup Stories', icon: '🚀', color: '#10b981', subscribers: 8200, desc: 'Behind the scenes of successful startups' },
      { name: 'Design Digest', icon: '🎨', color: '#8b5cf6', subscribers: 6500, desc: 'UI/UX trends and inspiration' },
      { name: 'Crypto Insider', icon: '💰', color: '#f59e0b', subscribers: 15300, desc: 'Web3, DeFi, and blockchain insights' },
      { name: 'Indie Dev Log', icon: '🎮', color: '#ec4899', subscribers: 4800, desc: 'Game development tutorials and stories' },
      { name: 'Future of Work', icon: '💼', color: '#3b82f6', subscribers: 9100, desc: 'Remote work, productivity, and careers' }
    ];

    const grid = document.getElementById('discover-grid');
    grid.innerHTML = sampleZines.map(zine => `
      <div class="zine-card ${zine.featured ? 'featured' : ''}">
        <div class="zine-card-header" style="background: linear-gradient(135deg, ${zine.color}, ${this.adjustColor(zine.color, -30)});">
          ${zine.icon}
          ${zine.featured ? '<span class="zine-card-badge">⭐ FEATURED</span>' : ''}
        </div>
        <div class="zine-card-body">
          <h3 class="zine-card-title">${zine.name}</h3>
          ${zine.author ? `<p class="zine-card-author">by ${zine.author}</p>` : ''}
          <p class="zine-card-desc">${zine.desc}</p>
          <div class="zine-card-stats">
            <span>👥 ${(zine.subscribers / 1000).toFixed(1)}k subscribers</span>
          </div>
        </div>
      </div>
    `).join('');
  },

  updateStats() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const zines = Storage.getUserZines(user.id);
    let totalArticles = 0;
    let totalSubscribers = 0;

    zines.forEach(zine => {
      const issues = Storage.getZineIssues(zine.id);
      totalArticles += issues.filter(i => i.status === 'published').length;
      totalSubscribers += zine.subscribers || 0;
    });

    document.getElementById('stat-zines').textContent = zines.length;
    document.getElementById('stat-articles').textContent = totalArticles;
    document.getElementById('stat-subscribers').textContent = totalSubscribers.toLocaleString();
    document.getElementById('stat-revenue').textContent = '$' + (totalSubscribers * 0.5).toFixed(0);

    // Show backup reminder if user has content and hasn't dismissed it
    const backupReminder = document.getElementById('backup-reminder');
    const dismissed = localStorage.getItem('aizines_backup_reminder_dismissed');
    const isSystemUser = ['admin', 'demo', 'claude'].includes(user.username);
    
    if (backupReminder) {
      if (zines.length > 0 && !dismissed && !isSystemUser) {
        backupReminder.style.display = 'flex';
      } else {
        backupReminder.style.display = 'none';
      }
    }
  },

  dismissBackupReminder() {
    localStorage.setItem('aizines_backup_reminder_dismissed', 'true');
    const reminder = document.getElementById('backup-reminder');
    if (reminder) reminder.style.display = 'none';
  },

  // ==================== ZINE MODAL ====================

  openZineModal(zineId = null) {
    this.state.editingZineId = zineId;
    const modal = document.getElementById('zine-modal');
    const title = document.getElementById('zine-modal-title');
    const form = document.getElementById('zine-form');

    if (zineId) {
      const zine = Storage.getZine(zineId);
      title.textContent = 'Edit Zine';
      document.getElementById('zine-name').value = zine.name;
      document.getElementById('zine-description').value = zine.description;
      document.getElementById('zine-niche').value = zine.niche;
      document.getElementById('zine-frequency').value = zine.frequency;
      document.getElementById('zine-tone').value = zine.tone;
      document.getElementById('zine-icon').value = zine.icon;
      document.getElementById('zine-color').value = zine.color;
      
      // Update icon selection
      document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.icon === zine.icon);
      });
      
      // Update color selection
      document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.color === zine.color);
      });
    } else {
      title.textContent = 'Create New Zine';
      form.reset();
      document.getElementById('zine-icon').value = '📰';
      document.getElementById('zine-color').value = '#ff3366';
      
      document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.icon === '📰');
      });
      document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.color === '#ff3366');
      });
    }

    modal.classList.add('active');
  },

  closeZineModal() {
    document.getElementById('zine-modal')?.classList.remove('active');
    this.state.editingZineId = null;
  },

  selectIcon(e) {
    e.preventDefault();
    const icon = e.currentTarget.dataset.icon;
    document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('selected'));
    e.currentTarget.classList.add('selected');
    document.getElementById('zine-icon').value = icon;
  },

  selectColor(e) {
    e.preventDefault();
    const color = e.currentTarget.dataset.color;
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('selected'));
    e.currentTarget.classList.add('selected');
    document.getElementById('zine-color').value = color;
  },

  handleZineSubmit(e) {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    if (!user) return;

    const zineData = {
      userId: user.id,
      name: document.getElementById('zine-name').value.trim(),
      description: document.getElementById('zine-description').value.trim(),
      icon: document.getElementById('zine-icon').value,
      color: document.getElementById('zine-color').value,
      niche: document.getElementById('zine-niche').value,
      frequency: document.getElementById('zine-frequency').value,
      tone: document.getElementById('zine-tone').value
    };

    try {
      if (this.state.editingZineId) {
        Storage.updateZine(this.state.editingZineId, zineData);
        this.showToast('Zine updated!', 'success');
      } else {
        Storage.createZine(zineData);
        this.showToast('Zine created!', 'success');
      }
      this.closeZineModal();
      this.loadZines();
      this.updateStats();
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  deleteZine(zineId) {
    if (!confirm('Delete this zine and all its issues? This cannot be undone.')) {
      return;
    }

    try {
      Storage.deleteZine(zineId);
      this.showToast('Zine deleted', 'success');
      this.loadZines();
      this.updateStats();
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  // ==================== EDITOR ====================

  switchEditorView(view) {
    document.querySelectorAll('.nav-tab[data-editor-view]').forEach(t => t.classList.remove('active'));
    document.querySelector(`.nav-tab[data-editor-view="${view}"]`)?.classList.add('active');

    document.querySelectorAll('.editor-view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${view}-view`)?.classList.add('active');
  },

  updateEditorHeader() {
    const zine = this.state.currentZine;
    if (!zine) return;

    document.getElementById('editor-zine-icon').textContent = zine.icon;
    document.getElementById('editor-zine-name').textContent = zine.name;
  },

  loadIssues() {
    const zine = this.state.currentZine;
    if (!zine) return;

    const issues = Storage.getZineIssues(zine.id);
    const list = document.getElementById('issues-list');
    const emptyState = document.getElementById('empty-issues');

    if (issues.length === 0) {
      list.innerHTML = '';
      emptyState?.classList.add('active');
      return;
    }

    emptyState?.classList.remove('active');

    list.innerHTML = issues.map(issue => `
      <div class="issue-card" onclick="App.showIssueEditor('${issue.id}')">
        <div class="issue-info">
          <h3>${this.escapeHtml(issue.title)}</h3>
          <div class="issue-meta">
            <span>Issue #${issue.number}</span>
            <span>${this.formatDate(issue.updatedAt)}</span>
          </div>
        </div>
        <div class="issue-actions">
          <span class="issue-status ${issue.status}">${issue.status}</span>
          <button class="issue-action-btn" onclick="event.stopPropagation(); App.deleteIssue('${issue.id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  },

  createNewIssue() {
    const zine = this.state.currentZine;
    if (!zine) return;

    try {
      const issue = Storage.createIssue({
        zineId: zine.id,
        blocks: [
          { id: Storage.generateId(), type: 'text', content: '' }
        ]
      });
      this.showIssueEditor(issue.id);
      this.showToast('New issue created', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  deleteIssue(issueId) {
    if (!confirm('Delete this issue? This cannot be undone.')) {
      return;
    }

    try {
      Storage.deleteIssue(issueId);
      this.showToast('Issue deleted', 'success');
      this.loadIssues();
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  // ==================== ISSUE EDITOR ====================

  backToZine() {
    this.saveDraft(true); // Silent save
    this.showEditor(this.state.currentZine.id);
  },

  renderIssueEditor() {
    const issue = this.state.currentIssue;
    if (!issue) return;

    document.getElementById('issue-title').value = issue.title;
    this.renderBlocks();
  },

  renderBlocks() {
    const issue = this.state.currentIssue;
    if (!issue) return;

    const container = document.getElementById('content-blocks');
    
    if (!issue.blocks || issue.blocks.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">Add content blocks below</p>';
      return;
    }

    container.innerHTML = issue.blocks.map((block, index) => {
      if (block.type === 'text') {
        return `
          <div class="content-block" data-id="${block.id}">
            <div class="block-header">
              <div class="block-type">
                <span class="block-type-icon text">📝</span>
                Text Block
              </div>
              <div class="block-actions">
                <button class="block-action" onclick="App.moveBlock('${block.id}', -1)">↑</button>
                <button class="block-action" onclick="App.moveBlock('${block.id}', 1)">↓</button>
                <button class="block-action" onclick="App.deleteBlock('${block.id}')">🗑</button>
              </div>
            </div>
            <div class="block-content">
              <textarea 
                placeholder="Write your content here..." 
                onchange="App.updateBlockContent('${block.id}', this.value)"
              >${this.escapeHtml(block.content || '')}</textarea>
            </div>
            <div class="block-ai-row">
              <input type="text" class="block-ai-input" placeholder="Describe what AI should write..." id="ai-input-${block.id}">
              <button class="block-ai-btn" onclick="App.aiGenerateForBlock('${block.id}')">✨ Generate</button>
            </div>
          </div>
        `;
      } else if (block.type === 'image') {
        return `
          <div class="content-block" data-id="${block.id}">
            <div class="block-header">
              <div class="block-type">
                <span class="block-type-icon image">🎨</span>
                AI Image
              </div>
              <div class="block-actions">
                <button class="block-action" onclick="App.moveBlock('${block.id}', -1)">↑</button>
                <button class="block-action" onclick="App.moveBlock('${block.id}', 1)">↓</button>
                <button class="block-action" onclick="App.deleteBlock('${block.id}')">🗑</button>
              </div>
            </div>
            <div class="image-preview">
              ${block.imageUrl 
                ? `<img src="${block.imageUrl}" alt="Generated image">`
                : `<span class="image-placeholder-icon">🖼️</span><span>No image generated yet</span>`
              }
            </div>
            <div class="block-ai-row">
              <input type="text" class="block-ai-input" placeholder="Describe the image..." id="ai-input-${block.id}" value="${this.escapeHtml(block.prompt || '')}">
              <button class="block-ai-btn" onclick="App.aiGenerateImageForBlock('${block.id}')">🎨 Generate Prompt</button>
            </div>
          </div>
        `;
      } else if (block.type === 'divider') {
        return `
          <div class="content-block" data-id="${block.id}">
            <div class="block-header">
              <div class="block-type">
                <span class="block-type-icon divider">➖</span>
                Divider
              </div>
              <div class="block-actions">
                <button class="block-action" onclick="App.moveBlock('${block.id}', -1)">↑</button>
                <button class="block-action" onclick="App.moveBlock('${block.id}', 1)">↓</button>
                <button class="block-action" onclick="App.deleteBlock('${block.id}')">🗑</button>
              </div>
            </div>
            <div class="divider-preview"></div>
          </div>
        `;
      }
      return '';
    }).join('');
  },

  addBlock(type) {
    const issue = this.state.currentIssue;
    if (!issue) return;

    const newBlock = {
      id: Storage.generateId(),
      type: type,
      content: '',
      prompt: '',
      imageUrl: ''
    };

    issue.blocks = issue.blocks || [];
    issue.blocks.push(newBlock);
    
    Storage.updateIssue(issue.id, { blocks: issue.blocks });
    this.renderBlocks();
  },

  updateBlockContent(blockId, content) {
    const issue = this.state.currentIssue;
    if (!issue) return;

    const block = issue.blocks.find(b => b.id === blockId);
    if (block) {
      block.content = content;
      Storage.updateIssue(issue.id, { blocks: issue.blocks });
    }
  },

  moveBlock(blockId, direction) {
    const issue = this.state.currentIssue;
    if (!issue) return;

    const index = issue.blocks.findIndex(b => b.id === blockId);
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= issue.blocks.length) return;

    const temp = issue.blocks[index];
    issue.blocks[index] = issue.blocks[newIndex];
    issue.blocks[newIndex] = temp;

    Storage.updateIssue(issue.id, { blocks: issue.blocks });
    this.renderBlocks();
  },

  deleteBlock(blockId) {
    const issue = this.state.currentIssue;
    if (!issue) return;

    issue.blocks = issue.blocks.filter(b => b.id !== blockId);
    Storage.updateIssue(issue.id, { blocks: issue.blocks });
    this.renderBlocks();
  },

  saveDraft(silent = false) {
    const issue = this.state.currentIssue;
    if (!issue) return;

    const title = document.getElementById('issue-title').value.trim() || `Issue #${issue.number}`;
    
    try {
      Storage.updateIssue(issue.id, { title });
      if (!silent) {
        this.showToast('Draft saved', 'success');
      }
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  publishIssue() {
    const issue = this.state.currentIssue;
    if (!issue) return;

    this.saveDraft(true);

    try {
      Storage.publishIssue(issue.id);
      this.state.currentIssue = Storage.getIssue(issue.id);
      this.showToast('Issue published! 🚀', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  previewIssue() {
    const issue = this.state.currentIssue;
    if (!issue) return;

    const container = document.getElementById('preview-container');
    const title = document.getElementById('issue-title').value || issue.title;

    let html = `<h1>${this.escapeHtml(title)}</h1>`;

    issue.blocks?.forEach(block => {
      if (block.type === 'text') {
        const paragraphs = (block.content || '').split('\n\n');
        paragraphs.forEach(p => {
          if (p.trim()) {
            html += `<p>${this.escapeHtml(p)}</p>`;
          }
        });
      } else if (block.type === 'image' && block.imageUrl) {
        html += `<img src="${block.imageUrl}" alt="">`;
      } else if (block.type === 'divider') {
        html += `<div class="preview-divider"></div>`;
      }
    });

    container.innerHTML = html;
    document.getElementById('preview-modal').classList.add('active');
  },

  closePreviewModal() {
    document.getElementById('preview-modal')?.classList.remove('active');
  },

  // ==================== AI FEATURES ====================

  async aiWriteArticle() {
    const zine = this.state.currentZine;
    const prompt = document.getElementById('ai-prompt').value.trim();

    if (!prompt) {
      this.showToast('Please enter a topic or prompt', 'error');
      return;
    }

    this.showLoading('Writing article with AI...');

    try {
      const content = await AI.generate('article', prompt, {
        tone: zine?.tone || 'professional',
        length: document.getElementById('ai-length')?.value || 'medium',
        zineContext: zine?.description
      });

      // Add as new text block
      this.addBlock('text');
      const issue = this.state.currentIssue;
      const lastBlock = issue.blocks[issue.blocks.length - 1];
      lastBlock.content = content;
      Storage.updateIssue(issue.id, { blocks: issue.blocks });
      this.renderBlocks();

      this.showToast('Article generated!', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.hideLoading();
    }
  },

  async aiGenerateIdeas() {
    const zine = this.state.currentZine;

    this.showLoading('Generating topic ideas...');

    try {
      const ideas = await AI.generate('ideas', zine?.niche || 'general', { count: 5 });
      document.getElementById('ai-prompt').value = ideas;
      this.showToast('Ideas generated! Select one and click "Write Full Article"', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.hideLoading();
    }
  },

  async aiImproveText() {
    const issue = this.state.currentIssue;
    if (!issue?.blocks?.length) {
      this.showToast('No text to improve', 'error');
      return;
    }

    const textBlocks = issue.blocks.filter(b => b.type === 'text' && b.content);
    if (!textBlocks.length) {
      this.showToast('No text content found', 'error');
      return;
    }

    this.showLoading('Improving text...');

    try {
      const improved = await AI.generate('improve', textBlocks[0].content, {
        tone: this.state.currentZine?.tone || 'professional'
      });

      textBlocks[0].content = improved;
      Storage.updateIssue(issue.id, { blocks: issue.blocks });
      this.renderBlocks();

      this.showToast('Text improved!', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.hideLoading();
    }
  },

  async aiGenerateImage() {
    const issue = this.state.currentIssue;
    const textContent = issue?.blocks?.filter(b => b.type === 'text').map(b => b.content).join('\n') || '';

    if (!textContent) {
      this.showToast('Add some text content first', 'error');
      return;
    }

    this.showLoading('Generating image prompt...');

    try {
      const prompt = await AI.generate('image', textContent);
      
      // Add image block with prompt
      this.addBlock('image');
      const lastBlock = issue.blocks[issue.blocks.length - 1];
      lastBlock.prompt = prompt;
      Storage.updateIssue(issue.id, { blocks: issue.blocks });
      this.renderBlocks();

      this.showToast('Image prompt generated! Copy it to your favorite AI image generator.', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.hideLoading();
    }
  },

  async aiGenerateFromPrompt() {
    const prompt = document.getElementById('ai-prompt').value.trim();
    if (!prompt) {
      this.showToast('Please enter a prompt', 'error');
      return;
    }
    await this.aiWriteArticle();
  },

  async aiGenerateForBlock(blockId) {
    const input = document.getElementById(`ai-input-${blockId}`);
    const prompt = input?.value.trim();

    if (!prompt) {
      this.showToast('Please enter a prompt', 'error');
      return;
    }

    this.showLoading('Generating content...');

    try {
      const content = await AI.generate('article', prompt, {
        tone: this.state.currentZine?.tone || 'professional',
        length: 'medium'
      });

      const issue = this.state.currentIssue;
      const block = issue.blocks.find(b => b.id === blockId);
      if (block) {
        block.content = content;
        Storage.updateIssue(issue.id, { blocks: issue.blocks });
        this.renderBlocks();
      }

      this.showToast('Content generated!', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.hideLoading();
    }
  },

  async aiGenerateImageForBlock(blockId) {
    const input = document.getElementById(`ai-input-${blockId}`);
    const description = input?.value.trim() || '';

    const issue = this.state.currentIssue;
    const textContent = issue?.blocks?.filter(b => b.type === 'text').map(b => b.content).join('\n') || description;

    if (!textContent) {
      this.showToast('Add some text content or describe the image', 'error');
      return;
    }

    this.showLoading('Generating image prompt...');

    try {
      const prompt = await AI.generate('image', textContent);

      const block = issue.blocks.find(b => b.id === blockId);
      if (block) {
        block.prompt = prompt;
        Storage.updateIssue(issue.id, { blocks: issue.blocks });
        
        // Update the input field
        if (input) input.value = prompt;
      }

      this.showToast('Image prompt generated! Copy it to Midjourney, DALL-E, etc.', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.hideLoading();
    }
  },

  // ==================== SETTINGS ====================

  openSettings(e) {
    e?.preventDefault();
    const user = Auth.getCurrentUser();
    if (!user) return;

    document.getElementById('settings-name').value = user.displayName;
    document.getElementById('settings-email').value = user.email || '';
    document.getElementById('settings-api-key').value = user.settings?.apiKey || '';

    document.getElementById('settings-modal').classList.add('active');
    document.getElementById('user-dropdown')?.classList.remove('active');
  },

  closeSettingsModal() {
    document.getElementById('settings-modal')?.classList.remove('active');
  },

  handleSettingsSubmit(e) {
    e.preventDefault();

    const displayName = document.getElementById('settings-name').value.trim();
    const email = document.getElementById('settings-email').value.trim();
    const apiKey = document.getElementById('settings-api-key').value.trim();

    try {
      Auth.updateProfile({ displayName, email });
      Auth.updateSettings({ apiKey });
      this.updateUserInfo();
      this.closeSettingsModal();
      this.showToast('Settings saved!', 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  backupUserData() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    // Get user's zines
    const allZines = Storage.getAllZines();
    const userZines = Object.values(allZines).filter(z => z.userId === user.id);
    
    // Get user's issues
    const allIssues = Storage.getAllIssues();
    const userIssues = {};
    userZines.forEach(zine => {
      const zineIssues = Object.values(allIssues).filter(i => i.zineId === zine.id);
      zineIssues.forEach(issue => {
        userIssues[issue.id] = issue;
      });
    });

    // Create backup object
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: {
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        settings: user.settings
      },
      zines: userZines.reduce((acc, z) => { acc[z.id] = z; return acc; }, {}),
      issues: userIssues
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `aizines-backup-${user.username}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showToast('Backup downloaded! Keep this file safe.', 'success');
  },

  restoreUserData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        
        // Validate backup structure
        if (!backup.version || !backup.zines || !backup.issues) {
          throw new Error('Invalid backup file format');
        }

        const user = Auth.getCurrentUser();
        if (!user) {
          throw new Error('Please log in first');
        }

        // Confirm restore
        const zineCount = Object.keys(backup.zines).length;
        const issueCount = Object.keys(backup.issues).length;
        
        if (!confirm(`Restore ${zineCount} zine(s) and ${issueCount} issue(s) from backup?\n\nThis will add to your existing content (not replace it).`)) {
          return;
        }

        // Restore zines with new IDs (to avoid conflicts)
        const idMap = {}; // Map old IDs to new IDs
        const allZines = Storage.getAllZines();
        
        Object.values(backup.zines).forEach(zine => {
          const newId = Storage.generateId();
          idMap[zine.id] = newId;
          
          allZines[newId] = {
            ...zine,
            id: newId,
            userId: user.id, // Assign to current user
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        });
        Storage.saveAll(Storage.KEYS.ZINES, allZines);

        // Restore issues with new IDs
        const allIssues = Storage.getAllIssues();
        
        Object.values(backup.issues).forEach(issue => {
          const newId = Storage.generateId();
          const newZineId = idMap[issue.zineId];
          
          if (newZineId) {
            allIssues[newId] = {
              ...issue,
              id: newId,
              zineId: newZineId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
        });
        Storage.saveAll(Storage.KEYS.ISSUES, allIssues);

        // Refresh UI
        this.loadZines();
        this.updateStats();
        this.closeSettingsModal();
        this.showToast(`Restored ${zineCount} zine(s) and ${issueCount} issue(s)!`, 'success');

      } catch (error) {
        this.showToast('Failed to restore: ' + error.message, 'error');
      }
    };

    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  },

  // ==================== CACHE VIEWER ====================

  openCacheViewer() {
    this.loadCacheSummary();
    this.loadCacheZines();
    this.loadCacheIssues();
    this.loadCacheRaw();
    this.calculateCacheSize();
    
    document.getElementById('cache-modal').classList.add('active');
  },

  closeCacheModal() {
    document.getElementById('cache-modal')?.classList.remove('active');
  },

  switchCacheTab(tab) {
    document.querySelectorAll('.cache-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.cache-tab[data-cache-tab="${tab}"]`)?.classList.add('active');

    document.querySelectorAll('.cache-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`cache-${tab}-tab`)?.classList.add('active');
  },

  loadCacheSummary() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const zines = Storage.getUserZines(user.id);
    const allIssues = Storage.getAllIssues();
    
    let totalIssues = 0;
    let publishedIssues = 0;
    let draftIssues = 0;
    let totalBlocks = 0;

    zines.forEach(zine => {
      const issues = Object.values(allIssues).filter(i => i.zineId === zine.id);
      totalIssues += issues.length;
      publishedIssues += issues.filter(i => i.status === 'published').length;
      draftIssues += issues.filter(i => i.status === 'draft').length;
      issues.forEach(issue => {
        totalBlocks += (issue.blocks || []).length;
      });
    });

    const grid = document.getElementById('cache-summary-grid');
    grid.innerHTML = `
      <div class="cache-summary-card">
        <div class="cache-summary-value">${zines.length}</div>
        <div class="cache-summary-label">Zines</div>
      </div>
      <div class="cache-summary-card">
        <div class="cache-summary-value">${totalIssues}</div>
        <div class="cache-summary-label">Total Issues</div>
      </div>
      <div class="cache-summary-card">
        <div class="cache-summary-value">${publishedIssues}</div>
        <div class="cache-summary-label">Published</div>
      </div>
      <div class="cache-summary-card">
        <div class="cache-summary-value">${draftIssues}</div>
        <div class="cache-summary-label">Drafts</div>
      </div>
      <div class="cache-summary-card">
        <div class="cache-summary-value">${totalBlocks}</div>
        <div class="cache-summary-label">Content Blocks</div>
      </div>
      <div class="cache-summary-card">
        <div class="cache-summary-value">${user.settings?.apiKey ? '✓' : '✗'}</div>
        <div class="cache-summary-label">API Key Set</div>
      </div>
    `;
  },

  loadCacheZines() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const zines = Storage.getUserZines(user.id);
    const list = document.getElementById('cache-zines-list');

    if (zines.length === 0) {
      list.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 2rem;">No zines found</p>';
      return;
    }

    list.innerHTML = zines.map(zine => {
      const issues = Storage.getZineIssues(zine.id);
      return `
        <div class="cache-item">
          <div class="cache-item-header">
            <span class="cache-item-icon">${zine.icon}</span>
            <span class="cache-item-title">${this.escapeHtml(zine.name)}</span>
          </div>
          <div class="cache-item-meta">
            <span>ID: ${zine.id}</span>
            <span>Issues: ${issues.length}</span>
            <span>Subs: ${zine.subscribers || 0}</span>
            <span>Created: ${this.formatDate(zine.createdAt)}</span>
          </div>
          <div class="cache-item-preview">${this.escapeHtml(zine.description)}</div>
        </div>
      `;
    }).join('');
  },

  loadCacheIssues() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const zines = Storage.getUserZines(user.id);
    const allIssues = Storage.getAllIssues();
    const list = document.getElementById('cache-issues-list');

    const userIssues = [];
    zines.forEach(zine => {
      const issues = Object.values(allIssues).filter(i => i.zineId === zine.id);
      issues.forEach(issue => {
        userIssues.push({ ...issue, zineName: zine.name, zineIcon: zine.icon });
      });
    });

    if (userIssues.length === 0) {
      list.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 2rem;">No issues found</p>';
      return;
    }

    // Sort by date, newest first
    userIssues.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    list.innerHTML = userIssues.map(issue => {
      const blockCount = (issue.blocks || []).length;
      const textContent = issue.blocks?.find(b => b.type === 'text')?.content || '';
      const preview = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
      
      return `
        <div class="cache-item">
          <div class="cache-item-header">
            <span class="cache-item-icon">${issue.zineIcon}</span>
            <span class="cache-item-title">${this.escapeHtml(issue.title)}</span>
          </div>
          <div class="cache-item-meta">
            <span>ID: ${issue.id}</span>
            <span>Zine: ${issue.zineName}</span>
            <span>Status: ${issue.status}</span>
            <span>Blocks: ${blockCount}</span>
            <span>Updated: ${this.formatDate(issue.updatedAt)}</span>
          </div>
          ${preview ? `<div class="cache-item-preview">${this.escapeHtml(preview)}</div>` : ''}
        </div>
      `;
    }).join('');
  },

  loadCacheRaw() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    // Get user's data only
    const zines = Storage.getUserZines(user.id);
    const allIssues = Storage.getAllIssues();
    
    const userIssues = {};
    zines.forEach(zine => {
      const issues = Object.values(allIssues).filter(i => i.zineId === zine.id);
      issues.forEach(issue => {
        userIssues[issue.id] = issue;
      });
    });

    const rawData = {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        createdAt: user.createdAt,
        hasApiKey: !!user.settings?.apiKey
      },
      zines: zines.reduce((acc, z) => { acc[z.id] = z; return acc; }, {}),
      issues: userIssues
    };

    document.getElementById('cache-raw-view').textContent = JSON.stringify(rawData, null, 2);
  },

  calculateCacheSize() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    // Calculate size of user's data
    const zines = Storage.getUserZines(user.id);
    const allIssues = Storage.getAllIssues();
    
    let totalSize = 0;
    
    // Add zines size
    zines.forEach(zine => {
      totalSize += JSON.stringify(zine).length;
    });
    
    // Add issues size
    zines.forEach(zine => {
      const issues = Object.values(allIssues).filter(i => i.zineId === zine.id);
      issues.forEach(issue => {
        totalSize += JSON.stringify(issue).length;
      });
    });

    // Convert to KB
    const sizeKB = (totalSize / 1024).toFixed(2);
    document.getElementById('cache-size').textContent = `Your data: ${sizeKB} KB`;
  },

  clearMyCache() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const isSystemUser = ['admin', 'demo', 'claude'].includes(user.username);
    if (isSystemUser) {
      this.showToast('Cannot clear system account data', 'error');
      return;
    }

    if (!confirm('⚠️ Delete all YOUR zines and issues?\n\nThis will permanently remove all your content.\nYour account will remain active.\n\nContinue?')) {
      return;
    }

    // Delete user's zines and issues
    const zines = Storage.getUserZines(user.id);
    zines.forEach(zine => {
      Storage.deleteZine(zine.id);
    });

    // Refresh UI
    this.loadZines();
    this.updateStats();
    this.closeCacheModal();
    this.closeSettingsModal();
    this.showToast('Your content has been cleared', 'success');
  },

  // ==================== UTILITIES ====================

  showLoading(message = 'Loading...') {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-overlay').classList.add('active');
  },

  hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="toast-message">${this.escapeHtml(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  },

  adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  },

  // ==================== ADMIN PANEL ====================

  openAdminPanel(e) {
    e?.preventDefault();
    if (!Auth.isAdmin()) {
      this.showToast('Access denied', 'error');
      return;
    }

    this.loadSystemSettings();
    this.loadUsersTable();
    this.loadAdminStats();

    document.getElementById('admin-modal').classList.add('active');
    document.getElementById('user-dropdown')?.classList.remove('active');
  },

  closeAdminModal() {
    document.getElementById('admin-modal')?.classList.remove('active');
  },

  switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.admin-tab[data-admin-tab="${tab}"]`)?.classList.add('active');

    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`admin-${tab}-tab`)?.classList.add('active');

    // Refresh data when switching tabs
    if (tab === 'users') this.loadUsersTable();
    if (tab === 'stats') this.loadAdminStats();
  },

  loadSystemSettings() {
    const settings = Storage.getSystemSettings();
    
    document.getElementById('setting-email-verification').checked = settings.requireEmailVerification;
    document.getElementById('setting-public-signup').checked = settings.allowPublicSignup;
    document.getElementById('setting-max-zines').value = settings.maxZinesPerUser;
    document.getElementById('setting-max-issues').value = settings.maxIssuesPerZine;
    document.getElementById('setting-ai-enabled').checked = settings.aiEnabled;
    document.getElementById('setting-maintenance').checked = settings.maintenanceMode;
  },

  handleSystemSettingsSubmit(e) {
    e.preventDefault();
    
    const settings = {
      requireEmailVerification: document.getElementById('setting-email-verification').checked,
      allowPublicSignup: document.getElementById('setting-public-signup').checked,
      maxZinesPerUser: parseInt(document.getElementById('setting-max-zines').value) || 10,
      maxIssuesPerZine: parseInt(document.getElementById('setting-max-issues').value) || 100,
      aiEnabled: document.getElementById('setting-ai-enabled').checked,
      maintenanceMode: document.getElementById('setting-maintenance').checked
    };

    Storage.updateSystemSettings(settings);
    this.showToast('System settings saved!', 'success');
  },

  loadUsersTable() {
    const users = Storage.getAllUsersArray();
    const table = document.getElementById('users-table');
    const count = document.getElementById('users-count');

    count.textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;

    table.innerHTML = users.map(user => {
      const isCurrentUser = user.username === Auth.getCurrentUser()?.username;
      const isPrimaryAdmin = user.username === 'admin';
      const isDemoUser = user.username === 'demo';
      const isClaudeUser = user.username === 'claude';
      const isProtected = isPrimaryAdmin || isDemoUser || isClaudeUser;
      
      return `
        <div class="user-row">
          <div class="user-row-info">
            <div class="user-row-avatar" style="background: var(--gradient-1); color: var(--black);">
              ${user.displayName.charAt(0).toUpperCase()}
            </div>
            <div class="user-row-details">
              <div class="user-row-name">
                ${this.escapeHtml(user.displayName)}
                ${user.isAdmin ? '<span class="admin-badge">ADMIN</span>' : ''}
                ${isDemoUser ? '<span class="admin-badge" style="background: var(--blue);">DEMO</span>' : ''}
                ${isClaudeUser ? '<span class="admin-badge" style="background: #6366f1;">AI</span>' : ''}
                ${!user.emailVerified ? '<span class="unverified-badge">UNVERIFIED</span>' : ''}
              </div>
              <div class="user-row-meta">@${user.username} • ${user.email || 'No email'}</div>
            </div>
          </div>
          <div class="user-row-actions">
            ${!user.emailVerified ? `
              <button class="user-action-btn" onclick="App.verifyUser('${user.username}')" title="Verify email">
                ✓ Verify
              </button>
            ` : ''}
            ${!isProtected ? `
              <button class="user-action-btn" onclick="App.toggleAdmin('${user.username}')" title="${user.isAdmin ? 'Remove admin' : 'Make admin'}">
                ${user.isAdmin ? '👤' : '🛡️'}
              </button>
            ` : ''}
            ${!isProtected && !isCurrentUser ? `
              <button class="user-action-btn danger" onclick="App.deleteUserAdmin('${user.username}')" title="Delete user">
                🗑️
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  verifyUser(username) {
    try {
      Storage.verifyUserEmail(username);
      this.loadUsersTable();
      this.showToast(`${username} verified!`, 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  toggleAdmin(username) {
    try {
      const user = Storage.toggleUserAdmin(username);
      this.loadUsersTable();
      this.showToast(`${username} is ${user.isAdmin ? 'now an admin' : 'no longer an admin'}`, 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  deleteUserAdmin(username) {
    if (!confirm(`Delete user "${username}" and all their content? This cannot be undone.`)) {
      return;
    }

    try {
      Storage.deleteUser(username);
      this.loadUsersTable();
      this.loadAdminStats();
      this.showToast(`User ${username} deleted`, 'success');
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  },

  loadAdminStats() {
    const users = Storage.getAllUsersArray();
    const zines = Object.values(Storage.getAllZines());
    const issues = Object.values(Storage.getAllIssues());
    const published = issues.filter(i => i.status === 'published');

    document.getElementById('admin-stat-users').textContent = users.length;
    document.getElementById('admin-stat-zines').textContent = zines.length;
    document.getElementById('admin-stat-issues').textContent = issues.length;
    document.getElementById('admin-stat-published').textContent = published.length;
  },

  exportAllData() {
    const data = Storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `aizines-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showToast('Data exported!', 'success');
  },

  resetAllData() {
    if (!confirm('⚠️ This will delete ALL data including users, zines, and issues. Are you sure?')) {
      return;
    }
    if (!confirm('This action CANNOT be undone. Type "RESET" to confirm... (Click OK if you understand)')) {
      return;
    }

    Storage.clearAll();
    Auth.logout();
    this.showToast('All data reset. Please login again.', 'success');
    this.showAuthScreen();
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
