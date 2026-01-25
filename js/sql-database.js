/**
 * AIZines SQL Database Manager
 * ================================
 * Browser-based SQLite database using sql.js
 * Shared database across all AIUNITES sites
 */

const SQLDatabase = {
  db: null,
  isLoaded: false,
  SQL: null,
  
  // Site identifier
  SITE_ID: 'AIZines',
  
  // Storage keys
  STORAGE_KEY: 'aizines_sqldb',
  LOCATION_KEY: 'aizines_db_location',
  
  // Current location
  location: 'browser',
  locationConfig: {},
  
  // SHARED AIUNITES GitHub config
  DEFAULT_GITHUB_CONFIG: {
    owner: 'AIUNITES',
    repo: 'AIUNITES-database-sync',
    path: 'data/app.db',
    token: '',
    autoSync: false
  },
  
  LOCATIONS: {
    browser: { name: 'Browser', icon: '💻', requiresConfig: false },
    githubSync: { name: 'GitHub Sync', icon: '🐙', requiresConfig: true }
  },
  
  /**
   * Initialize sql.js
   */
  async init() {
    try {
      if (typeof initSqlJs === 'undefined') {
        console.log('[SQLDatabase] sql.js not loaded, skipping init');
        return;
      }
      
      this.SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
      });
      
      console.log('[SQLDatabase] sql.js loaded');
      
      this.loadLocationConfig();
      
      // When online (not localhost), ALWAYS try GitHub first for shared database
      if (!this.isLocalhost()) {
        console.log('[SQLDatabase] Online mode - loading shared database from GitHub...');
        const loaded = await this.autoLoadFromGitHub();
        if (!loaded) {
          // Fallback to localStorage if GitHub fails
          console.log('[SQLDatabase] GitHub load failed, trying localStorage...');
          await this.loadFromStorage();
        }
      } else {
        // Localhost: use localStorage (development mode)
        console.log('[SQLDatabase] Localhost mode - using local database');
        await this.loadFromStorage();
      }
      
      // Ensure tables exist
      if (this.isLoaded) {
        this.ensureTables();
      }
      
      this.updateStatus();
      
    } catch (error) {
      console.error('[SQLDatabase] Init failed:', error);
    }
  },
  
  isLocalhost() {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:';
  },
  
  /**
   * Ensure required tables exist
   */
  ensureTables() {
    if (!this.db) return;
    
    try {
      // Create users table (shared across all AIUNITES sites)
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          display_name TEXT,
          email TEXT,
          role TEXT DEFAULT 'user',
          site TEXT DEFAULT 'AIZines',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create indexes
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_users_site ON users(site)`);
      
      console.log('[SQLDatabase] Tables ensured');
      this.autoSave();
      
    } catch (error) {
      console.error('[SQLDatabase] ensureTables error:', error);
    }
  },
  
  /**
   * Auto-load from GitHub
   */
  async autoLoadFromGitHub() {
    try {
      const config = this.locationConfig.githubSync || this.DEFAULT_GITHUB_CONFIG;
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
      
      const headers = config.token ? { 'Authorization': `token ${config.token}` } : {};
      const resp = await fetch(apiUrl, { headers });
      
      if (!resp.ok) return false;
      
      const data = await resp.json();
      const binary = atob(data.content.replace(/\n/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      this.db = new this.SQL.Database(bytes);
      this.isLoaded = true;
      this.location = 'githubSync';
      
      // Ensure our tables exist
      this.ensureTables();
      
      console.log('[SQLDatabase] Loaded from GitHub!');
      
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('🐙 Database loaded from GitHub!', 'success');
      }
      
      return true;
    } catch (error) {
      console.error('[SQLDatabase] Auto-load failed:', error);
      return false;
    }
  },
  
  loadLocationConfig() {
    try {
      const saved = localStorage.getItem(this.LOCATION_KEY);
      if (saved) {
        const config = JSON.parse(saved);
        this.location = config.location || 'browser';
        this.locationConfig = config.configs || {};
      }
    } catch (e) {}
  },
  
  saveLocationConfig() {
    localStorage.setItem(this.LOCATION_KEY, JSON.stringify({
      location: this.location,
      configs: this.locationConfig
    }));
  },
  
  createNewDatabase() {
    this.db = new this.SQL.Database();
    this.isLoaded = true;
    this.ensureTables();
    this.updateStatus('New database created', 'success');
    this.autoSave();
  },
  
  async loadFromGitHub() {
    const config = this.locationConfig.githubSync || this.DEFAULT_GITHUB_CONFIG;
    
    try {
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
      const headers = config.token ? { 'Authorization': `token ${config.token}` } : {};
      
      const resp = await fetch(apiUrl, { headers });
      if (!resp.ok) {
        alert(resp.status === 404 ? 'Database not found on GitHub' : 'GitHub API error');
        return;
      }
      
      const data = await resp.json();
      const binary = atob(data.content.replace(/\n/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      this.db = new this.SQL.Database(bytes);
      this.isLoaded = true;
      this.location = 'githubSync';
      
      this.ensureTables();
      this.updateStatus('Loaded from GitHub', 'success');
      this.autoSave();
      
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('🐙 Database loaded from GitHub!', 'success');
      }
    } catch (error) {
      console.error('[SQLDatabase] Load error:', error);
      alert('Error: ' + error.message);
    }
  },
  
  async saveToGitHub() {
    if (!this.db) {
      alert('No database to save');
      return;
    }
    
    let token = this.locationConfig.githubSync?.token || localStorage.getItem('github_token');
    
    if (!token) {
      token = prompt('Enter GitHub token (needs repo write access):');
      if (!token) return;
      if (confirm('Save token for future?')) {
        localStorage.setItem('github_token', token);
      }
    }
    
    try {
      const config = this.locationConfig.githubSync || this.DEFAULT_GITHUB_CONFIG;
      const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
      
      let sha = null;
      try {
        const existing = await fetch(apiUrl, { headers: { 'Authorization': `token ${token}` } });
        if (existing.ok) {
          sha = (await existing.json()).sha;
        }
      } catch (e) {}
      
      const data = this.db.export();
      const base64 = btoa(String.fromCharCode.apply(null, data));
      
      const body = {
        message: `Update from ${this.SITE_ID} - ${new Date().toISOString()}`,
        content: base64,
        branch: 'main'
      };
      if (sha) body.sha = sha;
      
      const resp = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (resp.ok) {
        if (typeof App !== 'undefined' && App.showToast) {
          App.showToast('🐙 Saved to GitHub!', 'success');
        } else {
          alert('Saved to GitHub!');
        }
      } else {
        throw new Error('GitHub API error');
      }
    } catch (error) {
      console.error('[SQLDatabase] Save error:', error);
      alert('Error: ' + error.message);
    }
  },
  
  autoSave() {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const base64 = btoa(String.fromCharCode.apply(null, data));
      localStorage.setItem(this.STORAGE_KEY, base64);
    } catch (e) {}
  },
  
  async loadFromStorage() {
    try {
      const base64 = localStorage.getItem(this.STORAGE_KEY);
      if (!base64) return;
      
      const binary = atob(base64);
      const data = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        data[i] = binary.charCodeAt(i);
      }
      
      this.db = new this.SQL.Database(data);
      this.isLoaded = true;
    } catch (e) {}
  },
  
  updateStatus(message = null, type = 'info') {
    const iconEl = document.getElementById('sql-status-icon');
    const textEl = document.getElementById('sql-status-text');
    
    if (textEl) {
      textEl.textContent = message || (this.isLoaded ? 'Database ready' : 'Database not loaded');
    }
    
    if (iconEl) {
      iconEl.textContent = type === 'success' ? '🟢' : (type === 'error' ? '🔴' : (this.isLoaded ? '🟢' : '⚪'));
    }
  },
  
  getGitHubToken() {
    return localStorage.getItem('github_token') || this.locationConfig.githubSync?.token || '';
  },
  
  setGitHubToken(token) {
    if (token) {
      localStorage.setItem('github_token', token);
    } else {
      localStorage.removeItem('github_token');
    }
  },
  
  // ==================== USER METHODS ====================
  
  /**
   * Check if username exists in SQL database
   */
  checkUsernameExists(username) {
    if (!this.db) return false;
    
    try {
      const stmt = this.db.prepare(`SELECT id FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1`);
      stmt.bind([username]);
      const exists = stmt.step();
      stmt.free();
      return exists;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Get user by username from SQL database
   */
  getUserByUsername(username) {
    if (!this.db) return null;
    
    try {
      const stmt = this.db.prepare(`SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1`);
      stmt.bind([username]);
      
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return {
          id: row.id,
          username: row.username,
          displayName: row.display_name,
          email: row.email,
          role: row.role,
          site: row.site,
          password: row.password_hash,
          createdAt: row.created_at
        };
      }
      stmt.free();
      return null;
    } catch (e) {
      return null;
    }
  },
  
  /**
   * Save user to SQL database
   */
  saveUser(user, password) {
    if (!this.db) return false;
    
    try {
      this.db.run(`
        INSERT INTO users (username, password_hash, display_name, email, role, site)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        user.username,
        password,
        user.displayName,
        user.email || '',
        user.isAdmin ? 'admin' : 'user',
        this.SITE_ID
      ]);
      
      this.autoSave();
      console.log('[SQLDatabase] User saved:', user.username);
      
      // Auto-sync to GitHub if token is available
      const token = this.getGitHubToken();
      if (token) {
        console.log('[SQLDatabase] Auto-syncing new user to GitHub...');
        this.saveToGitHub().catch(e => console.warn('GitHub sync failed:', e));
      }
      
      return true;
    } catch (e) {
      console.warn('[SQLDatabase] Failed to save user:', e.message);
      return false;
    }
  },
  
  /**
   * Get all users (for admin panel)
   */
  getAllUsers() {
    if (!this.db) return [];
    
    try {
      const result = this.db.exec(`
        SELECT id, username, display_name, email, role, site, created_at
        FROM users ORDER BY created_at DESC
      `);
      
      if (!result.length) return [];
      
      return result[0].values.map(row => ({
        id: row[0],
        username: row[1],
        displayName: row[2],
        email: row[3],
        role: row[4],
        site: row[5],
        createdAt: row[6]
      }));
    } catch (e) {
      return [];
    }
  },
  
  /**
   * Get user count
   */
  getUserCount() {
    if (!this.db) return 0;
    
    try {
      const result = this.db.exec('SELECT COUNT(*) FROM users');
      return result[0]?.values[0]?.[0] || 0;
    } catch (e) {
      return 0;
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    SQLDatabase.init();
  }, 100);
});

window.SQLDatabase = SQLDatabase;
