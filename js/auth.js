/**
 * AIZines Auth Module
 * Handles user registration, login, and session management
 */

const Auth = {
  /**
   * Register new user
   */
  signup(displayName, username, email, password) {
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

    // Check if username exists
    if (Storage.getUserByUsername(username)) {
      throw new Error('Username already taken');
    }

    // Create user
    const user = Storage.createUser({
      displayName,
      username,
      email,
      password // In production, hash this!
    });

    // Auto login after signup (only if email verification not required)
    if (!requireEmail || user.emailVerified) {
      Storage.setCurrentUser(user.username);
    }

    return user;
  },

  /**
   * Login user
   */
  login(username, password) {
    if (!username || !password) {
      throw new Error('Please enter username and password');
    }

    const user = Storage.getUserByUsername(username);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Incorrect password');
    }

    // Check if email verification is required and not verified
    if (Storage.isEmailVerificationRequired() && !user.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Set current user
    Storage.setCurrentUser(user.username);

    return user;
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
  changePassword(currentPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Not logged in');
    }

    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    return Storage.updateUser(user.username, { password: newPassword });
  }
};
