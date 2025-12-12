
"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import type { User, Role } from '@/lib/types';
import { fetchUsers, logoutAction, createSessionAction } from '@/app/actions';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: true } | { success: false; error: string; remainingAttempts?: number }>;
  logout: () => Promise<void>;
  signup: (email: string, name: string, role: Role, branchId: string, password?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout: 5 minutes (300,000 milliseconds)
const SESSION_TIMEOUT = 5 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Perform actual logout (server + client cleanup)
  const performLogout = useCallback(async (isSessionExpired: boolean = false) => {
    try {
      // 1. Server-side session invalidation
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        await logoutAction(sessionToken);
      }
    } catch (error) {
      console.error('Server logout error:', error);
      // Continue with client-side cleanup even if server logout fails
    }

    // 2. Client-side cleanup
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('sessionToken');

    // Clear all timers
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
      activityTimerRef.current = null;
    }
    if (activityDebounceRef.current) {
      clearTimeout(activityDebounceRef.current);
      activityDebounceRef.current = null;
    }

    // Force page reload to clear all cached data
    // This ensures cache-control headers take effect
    if (!isSessionExpired) {
      window.location.href = '/login';
    } else {
      // For session expired, use replace to avoid back button issues
      window.location.replace('/login');
    }
  }, []);

  // Handle session expiration
  const handleSessionExpired = useCallback(async () => {
    console.log('Session expired - logging out automatically');
    await performLogout(true); // true = session expired
  }, [performLogout]);

  // Reset session timeout timer
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      sessionTimeoutRef.current = setTimeout(() => {
        // Session expired - automatic logout
        handleSessionExpired();
      }, SESSION_TIMEOUT);
    }
  }, [handleSessionExpired]);

  // Update last activity timestamp (client-side immediate, server-side debounced)
  const updateActivity = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (storedUser && sessionToken) {
      // Immediately update client-side activity timestamp
      const now = Date.now();
      localStorage.setItem('lastActivity', now.toString());
      
      // Immediately reset session timeout timer (client-side)
      resetSessionTimeout();
      
      // Debounce server-side activity updates (every 30 seconds) to reduce server calls
      if (activityDebounceRef.current) {
        clearTimeout(activityDebounceRef.current);
      }
      
      activityDebounceRef.current = setTimeout(() => {
        // Update server-side activity (async, non-blocking)
        // This ensures server knows user is still active
        import('@/app/actions').then(({ validateSession }) => {
          if (sessionToken) {
            validateSession(sessionToken).catch(err => {
              console.error('Failed to update session activity:', err);
            });
          }
        });
      }, 30000); // Debounce server calls to 30 seconds
    }
  }, [resetSessionTimeout]);

  // Check if session is still valid (static function, doesn't depend on user state)
  const checkSessionValidity = (): boolean => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) {
      // No activity timestamp found - invalidate session
      return false;
    }

    const lastActivityTime = parseInt(lastActivity, 10);
    if (isNaN(lastActivityTime)) {
      return false;
    }

    const now = Date.now();
    const timeSinceActivity = now - lastActivityTime;

    if (timeSinceActivity >= SESSION_TIMEOUT) {
      // Session expired
      return false;
    }

    return true;
  };

  useEffect(() => {
    // Set up activity tracking listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);

  useEffect(() => {
    // In a real app, you'd verify a token from localStorage/cookies
    const checkUser = async () => {
      setLoading(true);
      try {
        const storedUserString = localStorage.getItem('user');
        if (storedUserString) {
          const storedUser = JSON.parse(storedUserString);
          
          // Check session validity (client-side check first)
          if (!checkSessionValidity()) {
            console.log('Session expired or invalid (client-side check)');
            localStorage.removeItem('user');
            localStorage.removeItem('lastActivity');
            localStorage.removeItem('sessionToken');
            setUser(null);
            setLoading(false);
            return;
          }
          
          // Also check server-side session if we have a token
          const sessionToken = localStorage.getItem('sessionToken');
          if (sessionToken) {
            const { validateSession } = await import('@/app/actions');
            const validation = await validateSession(sessionToken);
            
            if (!validation.valid) {
              console.log('Session expired or invalid (server-side check)');
              localStorage.removeItem('user');
              localStorage.removeItem('lastActivity');
              localStorage.removeItem('sessionToken');
              setUser(null);
              setLoading(false);
              return;
            }
          }

          const allUsers = await fetchUsers();
          const latest = allUsers.find(u => u.email.toLowerCase() === storedUser.email.toLowerCase()) || null;
          
          if (latest && latest.isActive) {
            // Check if we have a valid session token
            const sessionToken = localStorage.getItem('sessionToken');
            if (sessionToken) {
              // Validate session with server
              const { validateSession } = await import('@/app/actions');
              const validation = await validateSession(sessionToken);
              
              if (!validation.valid) {
                // Session invalid, clear everything
                localStorage.removeItem('user');
                localStorage.removeItem('lastActivity');
                localStorage.removeItem('sessionToken');
                setUser(null);
                setLoading(false);
                return;
              }
            }
            
            setUser(latest as any);
            // Update activity timestamp on successful login check
            const now = Date.now();
            localStorage.setItem('lastActivity', now.toString());
            resetSessionTimeout();
          } else {
            localStorage.removeItem('user');
            localStorage.removeItem('lastActivity');
            localStorage.removeItem('sessionToken');
            setUser(null);
          }
        }
          } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem('user');
          localStorage.removeItem('lastActivity');
          localStorage.removeItem('sessionToken');
          setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, [resetSessionTimeout]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: true } | { success: false; error: string; remainingAttempts?: number }> => {
    try {
      // Use server-side login action that handles lockout
      const { loginAction, createSessionAction } = await import('@/app/actions');
      
      // Validate that loginAction exists
      if (!loginAction || typeof loginAction !== 'function') {
        console.error('loginAction is not available');
        return { 
          success: false, 
          error: 'Login service is not available. Please refresh the page and try again.' 
        };
      }
      
      const result = await loginAction(email, password);
      
      // Validate that result exists and has the expected structure
      if (!result || typeof result !== 'object' || typeof (result as any).success !== 'boolean') {
        console.error('loginAction returned invalid result:', result);
        return { 
          success: false, 
          error: 'An unexpected error occurred during login. Please try again.' 
        };
      }
      
      if (!result.success) {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        return { 
          success: false, 
          error: result.error || 'Invalid email or password',
          remainingAttempts: result.remainingAttempts
        };
      }
      
      // Login successful - validate user exists in result
      if (!result.user) {
        console.error('loginAction returned success but no user:', result);
        return { 
          success: false, 
          error: 'An unexpected error occurred during login. Please try again.' 
        };
      }
      
      const user = result.user;
      setUser(user as any);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Create server-side session
      try {
        if (createSessionAction && typeof createSessionAction === 'function') {
          const sessionResult = await createSessionAction(user.id, user.email);
          if (sessionResult && sessionResult.success && sessionResult.sessionToken) {
            localStorage.setItem('sessionToken', sessionResult.sessionToken);
          }
        }
      } catch (error) {
        console.error('Failed to create server session:', error);
        // Continue with login even if session creation fails
      }
      
      // Set initial activity timestamp
      const now = Date.now();
      localStorage.setItem('lastActivity', now.toString());
      
      // Reset session timeout timer
      resetSessionTimeout();
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred during login' 
      };
    }
  };

  const signup = (_email: string, _name: string, _role: Role, _branchId: string, _password?: string): boolean => {
    // Not implemented with DB yet
    return false;
  }

  const logout = useCallback(async () => {
    await performLogout(false);
  }, [performLogout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
