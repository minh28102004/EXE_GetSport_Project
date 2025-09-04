import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "@pages/AuthPage";
import TermsOfServicePage from "@pages/TermsOfServicePage";
import endPoint from "@routes/router";

// Staff
import StaffLayout from "./pages/OwnerPage/Layout/StaffLayout";
import Dashboard from "./pages/OwnerPage/Dashboard";
import CourtManagement from "./pages/OwnerPage/CourtManagement";
import BookingManagement from "./pages/OwnerPage/BookingManagement";

// Admin
import AdminDashboard from "./pages/AdminPage/Dashboard";
import AdminLayout from "./pages/AdminPage/Layout/AdminLayout";
import CourtManagementAdmin from "./pages/AdminPage/CourtManagement";
import BookingManagementAdmin from "./pages/AdminPage/BookingManagement";
import BookingReport from "./pages/AdminPage/BookingReport";
import UserManagement from "./pages/AdminPage/UserManagement";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<AuthPage />} />

        {/* Staff layout + nested routes */}
        <Route path="/Staff" element={<StaffLayout />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="CourtManagement" element={<CourtManagement />} />
          <Route path="BookingManagement" element={<BookingManagement />} />
        </Route>

        {/* Admin layout + nested routes */}
        <Route path="/Admin" element={<AdminLayout />}>
          <Route path="Dashboard" element={<AdminDashboard />} />
          <Route path="CourtManagement" element={<CourtManagementAdmin />} />
          <Route path="BookingManagement" element={<BookingManagementAdmin />} />
          <Route path="BookingReport" element={<BookingReport />} />
          <Route path="UserManagement" element={<UserManagement />} />
         
        </Route>

        {/* Terms */}
        <Route path={endPoint.TERMSOFSERVICE} element={<TermsOfServicePage />} />
      </Routes>
    </Router>
  );
}

export default App;