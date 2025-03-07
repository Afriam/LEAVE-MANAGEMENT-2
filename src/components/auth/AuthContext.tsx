import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "admin";
  department: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    userData: Omit<User, "id"> & { password: string },
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate a successful login for specific credentials
      if (email === "admin@college.edu" && password === "password") {
        const adminUser: User = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@college.edu",
          role: "admin",
          department: "Administration",
        };
        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(adminUser));
        return true;
      } else if (email === "john.doe@college.edu" && password === "password") {
        const employeeUser: User = {
          id: "emp-1",
          name: "John Doe",
          email: "john.doe@college.edu",
          role: "employee",
          department: "Computer Science",
        };
        setUser(employeeUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(employeeUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const register = async (
    userData: Omit<User, "id"> & { password: string },
  ): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to your backend to register the user
      // For demo purposes, we'll simulate a successful registration
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
      };

      // Store in localStorage for demo purposes
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push({
        ...newUser,
        password: userData.password, // In a real app, this would be hashed on the server
      });
      localStorage.setItem("users", JSON.stringify(users));

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
