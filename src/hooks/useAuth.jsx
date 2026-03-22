import { useState, useEffect, createContext, useContext } from 'react';

// Create the context
const AuthContext = createContext(null);

// Mock "Secure" Hash function for demo purposes
// In a real app, never do this on the frontend. Use bcrypt on the backend.
const mockHash = (password) => {
  return btoa(password + "_salty_secret");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from local storage on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedToken = localStorage.getItem('digital_memory_token');
        if (storedToken) {
          // Decode mock JWT (base64 token)
          const decoded = JSON.parse(atob(storedToken));
          // Verify user exists in mock DB
          const users = JSON.parse(localStorage.getItem('digital_memory_users') || '[]');
          const existingUser = users.find(u => u.email === decoded.email);
          
          if (existingUser) {
            setUser({ id: existingUser.id, name: existingUser.name, email: existingUser.email, avatar: existingUser.avatar });
          } else {
            localStorage.removeItem('digital_memory_token');
          }
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
        localStorage.removeItem('digital_memory_token');
      } finally {
        setLoading(false);
      }
    };

    // Simulate network delay for realism
    setTimeout(checkSession, 800);
  }, []);

  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('digital_memory_users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (user.passwordHash !== mockHash(password)) {
         throw new Error('Invalid email or password');
      }

      // Create "JWT"
      const tokenPayload = btoa(JSON.stringify({ 
        email: user.email, 
        id: user.id,
        exp: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000) 
      }));

      localStorage.setItem('digital_memory_token', tokenPayload);
      setUser({ id: user.id, name: user.name, email: user.email, avatar: user.avatar });
      return { success: true };

    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      const users = JSON.parse(localStorage.getItem('digital_memory_users') || '[]');
      
      if (users.some(u => u.email === userData.email)) {
        throw new Error('An account with this email already exists.');
      }

      const newUser = {
        id: crypto.randomUUID(),
        name: userData.name,
        email: userData.email,
        passwordHash: mockHash(userData.password),
        avatar: userData.avatar || null,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('digital_memory_users', JSON.stringify(users));

      // Auto-login after signup
      const tokenPayload = btoa(JSON.stringify({ 
        email: newUser.email, 
        id: newUser.id,
        exp: Date.now() + (24 * 60 * 60 * 1000) 
      }));
      localStorage.setItem('digital_memory_token', tokenPayload);
      setUser({ id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('digital_memory_token');
    setUser(null);
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
       // Simulate API call for sending OTP/Link
       await new Promise(resolve => setTimeout(resolve, 1500));
       const users = JSON.parse(localStorage.getItem('digital_memory_users') || '[]');
       if (!users.some(u => u.email === email)) {
          // Even if email is not found, return success to prevent email enumeration attacks
          return { success: true, message: "If an account exists, a recovery link has been sent." };
       }
       return { success: true, message: "A recovery link has been sent to your email." };
    } catch (error) {
       return { success: false, error: "Failed to process request. Please try again later." };
    } finally {
       setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
