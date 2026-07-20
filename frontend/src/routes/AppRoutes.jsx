import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import FinanceReview from "../pages/FinanceReview";
import GORPage from "../pages/GOR/GORPage";
import MyRequests from "../pages/MyRequests";
import SupervisorReview from "../pages/SupervisorReview";
import ProcurementReview from "../pages/ProcurementReview";
import RequestDetails from "../pages/RequestDetails";
import AdminManagement from "../pages/AdminManagement";
import UserManagement from "../pages/admin/UserManagement";
import RequestManagement from "../pages/admin/RequestManagement";
import Reports from "../pages/admin/Reports";
import AuditLogs from "../pages/admin/AuditLogs";
import ChangePassword from "../pages/ChangePassword";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Redirect */}
 

<Route
  path="/change-password"
  element={<ChangePassword />}
/>
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>


        <Route
          path="/"
          element={<Navigate to="/login" />}
        />


        {/* Application Routes */}

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/gor"
          element={
            <Layout>
              <GORPage />
            </Layout>
          }
        />

        <Route
          path="/my-requests"
          element={
            <Layout>
              <MyRequests />
            </Layout>
          }
        />

        <Route
          path="/finance"
          element={
            <Layout>
              <FinanceReview />
            </Layout>
          }
        />

        <Route
          path="/supervisor"
          element={
            <Layout>
              <SupervisorReview />
            </Layout>
          }
        />

        <Route
          path="/procurement"
          element={
            <Layout>
              <ProcurementReview />
            </Layout>
          }
        />

        <Route
          path="/request-details"
          element={
            <Layout>
              <RequestDetails />
            </Layout>
          }
        />

        <Route
          path="/admin"
          element={
            <Layout>
              <AdminManagement />
            </Layout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <Layout>
              <UserManagement />
            </Layout>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <Layout>
              <RequestManagement />
            </Layout>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <Layout>
              <Reports />
            </Layout>
          }
        />

        <Route
          path="/admin/audit"
          element={
            <Layout>
              <AuditLogs />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}