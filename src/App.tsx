import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../src/api/context/AuthContext";
import { ProtectedRoute } from "../src/api/components/ProtectedRoute.tsx";

import LoginPage from "../src/api/components/pages/LoginPage.tsx";
import SignupPage from "../src/api/components/pages/SignupPage.tsx";
import PublicationsPage from "../src/api/components/pages/PublicationsPage.tsx";
import EditPublicationPage from "../src/api/components/pages/EditPublicationPage.tsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/publications"
            element={
              <ProtectedRoute>
                <PublicationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/publications/:id/edit"
            element={
              <ProtectedRoute>
                <EditPublicationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/publications/new"
            element={
              <ProtectedRoute>
                <EditPublicationPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/publications" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
