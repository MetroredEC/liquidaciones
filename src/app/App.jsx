import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import RequireAuth from '../auth/RequireAuth';
import RoleGuard from '../auth/RoleGuard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import LoginPage from '../auth/LoginPage';
import Dashboard from '../features/Dashboard';
import UploadPage from '../features/ingestion/UploadPage';
import ReconcilePage from '../features/reconcile/ReconcilePage';
import ExportPage from '../features/exports/ExportPage';
import ReportsPage from '../features/reports/ReportsPage';
import AuditPage from '../features/audit/AuditPage';
import AdminPage from '../features/admin/AdminPage';

/**
 * App component – defines the high level layout and routing for the
 * application. It wraps all routes in the AuthProvider so
 * authentication state is available throughout. Authenticated routes
 * are protected via RequireAuth and RoleGuard components.
 */
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<LoginPage />} />
        {/* Private routes wrapped with RequireAuth to enforce login */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

/**
 * Layout component – provides navigation chrome (navbar and sidebar)
 * around the routed pages. It uses nested routes so that any child
 * components will render in the <Outlet> placeholder.
 */
const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 bg-white">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ingestion" element={<UploadPage />} />
            <Route path="/reconciliation" element={<ReconcilePage />} />
            <Route path="/exports" element={<ExportPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route
              path="/admin"
              element={
                <RoleGuard roles={["Administrador"]}>
                  <AdminPage />
                </RoleGuard>
              }
            />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;