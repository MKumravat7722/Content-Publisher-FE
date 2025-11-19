import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../src/api/context/AuthContext";
import { ProtectedRoute } from "../src/api/components/ProtectedRoute.tsx";

import LoginPage from "../src/api/components/pages/LoginPage.tsx";
import SignupPage from "../src/api/components/pages/SignupPage.tsx";
import PublicationsPage from "../src/api/components/pages/PublicationsPage.tsx";
import EditPublicationPage from "../src/api/components/pages/EditPublicationPage.tsx";
// import PublicFeedPage from "../src/api/components/pages";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Public view (no login required) */}
          {/* <Route path="/public" element={<PublicFeedPage />} /> */}

          {/* Protected pages */}
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

          {/* Default route */}
          <Route path="/" element={<Navigate to="/publications" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
