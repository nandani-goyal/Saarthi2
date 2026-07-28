import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Shape of the user returned by saarthi-auth /api/auth/me
interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  city?: string;
  role?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

// saarthi-auth runs on port 5000
const AUTH_SERVICE_URL = "http://localhost:5000";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app load, verify the JWT cookie by calling /api/auth/me
    // withCredentials: true ensures the httpOnly cookie is sent cross-origin
    axios
      .get(`${AUTH_SERVICE_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          setIsLoading(false);
        } else {
          fetchDbUserFallback();
        }
      })
      .catch(() => {
        fetchDbUserFallback();
      });

    function fetchDbUserFallback() {
      // Fetch real user record from MongoDB
      axios
        .get("http://127.0.0.1:8000/api/users/current")
        .then((res) => {
          if (res.data && res.data.id) {
            setUser(res.data);
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption in any component
export const useAuth = () => useContext(AuthContext);
