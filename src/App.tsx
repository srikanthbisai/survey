import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SurveyProvider } from "./context/SurveyContext";
import { Login } from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import { Register } from "./pages/Register";
import { Survey } from "./pages/Survey";
import Submitted from "./pages/Submitted";
import { ViewResponse } from "./pages/ViewResponse";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return auth.user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const auth = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={auth.user ? <Navigate to="/survey" /> : <Login />}
      />
      <Route
        path="/register"
        element={auth.user ? <Navigate to="/survey" /> : <Register />}
      />
      <Route path="/submitted" element={<Submitted />} />
      <Route
        path="/survey"
        element={
          <ProtectedRoute>
            <SurveyProvider>
              <Survey />
            </SurveyProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-response"
        element={
          <ProtectedRoute>
            <ViewResponse />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
