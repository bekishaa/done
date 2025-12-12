// Server-side session store
// In production, this should be replaced with Redis, database, or proper session store

interface Session {
  userId: string;
  email: string;
  sessionToken: string;
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
}

// In-memory session store (in production, use Redis or database)
const sessions = new Map<string, Session>();

// Session timeout: 5 minutes
const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

export class SessionStore {
  /**
   * Create a new session
   */
  static createSession(userId: string, email: string): string {
    // Generate a unique session token
    // Using a combination of timestamp and random string for uniqueness
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const sessionToken = `${timestamp}-${randomPart}-${Math.random().toString(36).substring(2, 15)}`;
    const now = Date.now();
    
    const session: Session = {
      userId,
      email,
      sessionToken,
      createdAt: now,
      lastActivity: now,
      expiresAt: now + SESSION_TIMEOUT_MS,
    };
    
    sessions.set(sessionToken, session);
    
    // Cleanup expired sessions periodically
    this.cleanupExpiredSessions();
    
    return sessionToken;
  }

  /**
   * Get session by token
   */
  static getSession(sessionToken: string): Session | null {
    const session = sessions.get(sessionToken);
    
    if (!session) {
      return null;
    }
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionToken);
      return null;
    }
    
    return session;
  }

  /**
   * Update last activity timestamp
   */
  static updateActivity(sessionToken: string): boolean {
    const session = sessions.get(sessionToken);
    
    if (!session || Date.now() > session.expiresAt) {
      if (session) {
        sessions.delete(sessionToken);
      }
      return false;
    }
    
    // Update last activity and extend expiry
    session.lastActivity = Date.now();
    session.expiresAt = Date.now() + SESSION_TIMEOUT_MS;
    
    return true;
  }

  /**
   * Invalidate a session (logout)
   */
  static invalidateSession(sessionToken: string): boolean {
    return sessions.delete(sessionToken);
  }

  /**
   * Invalidate all sessions for a user
   */
  static invalidateUserSessions(userId: string): number {
    let count = 0;
    for (const [token, session] of sessions.entries()) {
      if (session.userId === userId) {
        sessions.delete(token);
        count++;
      }
    }
    return count;
  }

  /**
   * Cleanup expired sessions
   */
  static cleanupExpiredSessions(): number {
    const now = Date.now();
    let count = 0;
    
    for (const [token, session] of sessions.entries()) {
      if (now > session.expiresAt) {
        sessions.delete(token);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Get all active sessions (for debugging/admin)
   */
  static getActiveSessions(): Session[] {
    this.cleanupExpiredSessions();
    return Array.from(sessions.values());
  }
}

