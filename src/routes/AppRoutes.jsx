import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import FinanceReview from "../pages/FinanceReview";
import GORPage from "../pages/GOR/GORPage";
import MyRequests from "../pages/MyRequests";
import SupervisorReview from "../pages/SupervisorReview";
import ProcurementReview from "../pages/ProcurementReview";
import RequestDetails from "../pages/RequestDetails";
// Simple dashboard component

function Dashboard() {
  return <h2>Dashboard Page</h2>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gor" element={<GORPage />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/finance" element={<FinanceReview />} />
          <Route path="/supervisor" element={<SupervisorReview />} />
          <Route path="/procurement" element={<ProcurementReview />} />
          <Route path="/request-details" element={<RequestDetails />}/>

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}