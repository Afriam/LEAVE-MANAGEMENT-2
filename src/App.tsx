import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import routes from "tempo-routes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    email: string;
    role: string;
    name: string;
  } | null>(null);

  // Check if user is already logged in from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSignIn = (userData: {
    email: string;
    role: string;
    name: string;
  }) => {
    setUserData(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("user");
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home
                  userRole={userData?.role as "employee" | "admin"}
                  userName={userData?.name}
                  employeeId={userData?.email}
                  onSignOut={handleSignOut}
                />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route
            path="/signin"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <SignIn onSignIn={handleSignIn} />
              )
            }
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
