/**
 * AIZines Auth Module
 * Handles user registration, login, and session management
 * Supports both localStorage and SQL database authentication
 */

const Auth = {
  /**
   * Register new user
   * Saves to both localStorage and SQL database (if available)
   */
  async signup(displayName, username, email, password) {
    // Check if public signup is allowed
    if (!Storage.isPublicSignupAllowed()) {
      throw new Error('Public registration is currently disabled');
    }

    // Validate inputs
    if (!displayName || displayName.length < 2) {
      throw new Error('Display name must be at least 2 characters');
    }
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Check email requirement
    const requireEmail = Storage.isEmailVerificationRequired();
    if (requireEmail && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      throw new Error('A valid email address is required');
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Check if username exists in localStorage
    if (Storage.getUserByUsername(username)) {
      throw new Error('Username already taken');
    }
    
    // Check if username exists in SQL database
    if (this.checkUsernameInSQL(username)) {
      throw new Error('Username already taken');
    }

    const passwordHash = await PasswordUtils.hash(password);
    const user = Storage.createUser({ displayName, username, email, passwordHash });
    this.saveUserToSQL(user, password);

    // Auto login after signup (only if email verification not required)
    if (!requireEmail || user.emailVerified) {
      Storage.setCurrentUser(user.username);
    }

    return user;
  },

  /**
   * Check if username exists in SQL database
   */
  checkUsernameInSQL(username) {
    if (typeof SQLDatabase === 'undefined' || !SQLDatabase.isLoaded || !SQLDatabase.db) {
      return false;
    }
    return SQLDatabase.checkUsernameExists(username);
  },

  /**
   * Save user to SQL database
   */
  saveUserToSQL(user, password) {
    if (typeof SQLDatabase === 'undefined' || !SQLDatabase.isLoaded || !SQLDatabase.db) {
      return false;
    }
    return SQLDatabase.saveUser(user, password);
  },

  /**
   * Login user
   * Checks localStorage first, then SQL database if available
   */
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Please enter username and password');
    }

    // First, try localStorage (original behavior)
    let user = Storage.getUserByUsername(username);
    
    if (user) {
      let valid = false;
      if (user.passwordHash) {
        valid = await PasswordUtils.verify(password, user.passwordHash);
      } else if (user.password) {
        valid = (user.password === password);
        if (valid) {
          const hash = await PasswordUtils.hash(password);
          Storage.updateUser(user.username, { passwordHash: hash, password: null });
        }
      }
      if (!valid) throw new Error('Incorrect password');
      if (Storage.isEmailVerificationRequired() && !user.emailVerified) {
        throw new Error('Please verify your email before logging in');
      }
      Storage.setCurrentUser(user.username);
      return Storage.getUserByUsername(user.username);
    }
    
    // Not found in localStorage - try SQL database if available
    if (typeof SQLDatabase !== 'undefined' && SQLDatabase.isLoaded && SQLDatabase.db) {
      const dbUser = SQLDatabase.getUserByUsername(username);
      
      if (dbUser) {
        // Check password
        if (dbUser.password !== password) {
          throw new Error('Incorrect password');
        }
        
        // Create localStorage user from DB user for session
        user = Storage.createUser({
          displayName: dbUser.displayName || username,
          username: dbUser.username,
          email: dbUser.email || '',
          password: password,
          isAdmin: dbUser.role === 'admin'
        });
        
        console.log('[Auth] User authenticated from SQL database:', username);
        
        if (typeof App !== 'undefined' && App.showToast) {
          App.showToast('🐙 Logged in from AIUNITES database!', 'success');
        }
        
        Storage.setCurrentUser(user.username);
        return user;
      }
    }
    
    throw new Error('User not found');
  },

  /**
   * Demo login — always succeeds by creating or resetting the demo user
   */
  async loginDemo() {
    const demoUsername = 'demo';
    const demoPassword = 'demo123';
    try {
      return await this.login(demoUsername, demoPassword);
    } catch (e) {
      if (e.message === 'User not found') {
        const passwordHash = await PasswordUtils.hash(demoPassword);
        const user = Storage.createUser({ displayName: 'Demo User', username: demoUsername, email: 'demo@aizines.app', passwordHash, isAdmin: false });
        Storage.setCurrentUser(user.username);
        return user;
      }
      throw e;
    }
  },

  /**
   * Logout current user
   */
  logout() {
    Storage.clearCurrentUser();
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return Storage.getCurrentUser() !== null;
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return Storage.getCurrentUser();
  },

  /**
   * Check if current user is admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.isAdmin === true;
  },

  /**
   * Update user profile
   */
  updateProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Not logged in');
    }
    return Storage.updateUser(user.username, updates);
  },

  /**
   * Update user settings (including API key)
   */
  updateSettings(settings) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Not logged in');
    }
    
    const updatedSettings = { ...user.settings, ...settings };
    return Storage.updateUser(user.username, { settings: updatedSettings });
  },

  /**
   * Get API key for current user
   */
  getApiKey() {
    const user = this.getCurrentUser();
    return user?.settings?.apiKey || '';
  },

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not logged in');
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters');
    const valid = user.passwordHash
      ? await PasswordUtils.verify(currentPassword, user.passwordHash)
      : (user.password === currentPassword);
    if (!valid) throw new Error('Current password is incorrect');
    const passwordHash = await PasswordUtils.hash(newPassword);
    return Storage.updateUser(user.username, { passwordHash, password: null });
  }
};
