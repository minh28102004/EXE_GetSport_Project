import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@pages/HomePage/mainLayout";
import endPoint from "@routes/router";
// User
import HomePage from "@pages/HomePage/Home/mainSection";
import AboutPage from "./pages/HomePage/About/mainSection";
import BlogPost from "@pages/HomePage/BlogPost";
import AuthPage from "@pages/AuthPage";
import TermsOfServicePage from "@pages/TermsOfServicePage";

// Staff pages
import Dashboard from "@pages/OwnerPage/Dashboard";
import CourtManagement from "@pages/OwnerPage/CourtManagement";
import BookingManagement from "@pages/OwnerPage/BookingManagement";
import StaffProfile from "@pages/OwnerPage/StaffProfile";
// Admin pages
import AdminDashboard from "@pages/AdminPage/Dashboard";
import CourtManagementAdmin from "@pages/AdminPage/CourtManagement";
import BookingManagementAdmin from "@pages/AdminPage/BookingManagement";
import BookingReport from "@pages/AdminPage/BookingReport";
import UserManagement from "@pages/AdminPage/UserManagement";
import AdminProfile from "@pages/AdminPage/AdminProfile";

// Layout chung
import ManagementLayout from "@layout/ManagementLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={endPoint.HOMEPAGE} element={<HomePage />} />
          <Route path={endPoint.ABOUT} element={<AboutPage />} />
          <Route path={endPoint.BLOGPOST} element={<BlogPost />} />
          <Route
            path={endPoint.TERMSOFSERVICE}
            element={<TermsOfServicePage />}
          />
        </Route>
        <Route path={endPoint.AUTH} element={<AuthPage />} />

        {/* Staff layout + nested routes */}
        <Route path="/Staff" element={<ManagementLayout role="staff" />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="CourtManagement" element={<CourtManagement />} />
          <Route path="BookingManagement" element={<BookingManagement />} />
          <Route path="Settings" element={<StaffProfile />} />
        </Route>

        {/* Admin layout + nested routes */}
        <Route path="/Admin" element={<ManagementLayout role="admin" />}>
          <Route path="Dashboard" element={<AdminDashboard />} />
          <Route path="CourtManagement" element={<CourtManagementAdmin />} />
          <Route
            path="BookingManagement"
            element={<BookingManagementAdmin />}
          />
          <Route path="BookingReport" element={<BookingReport />} />
          <Route path="UserManagement" element={<UserManagement />} />
          <Route path="Settings" element={<AdminProfile />} />
        </Route>

        {/* Terms */}
        <Route
          path={endPoint.TERMSOFSERVICE}
          element={<TermsOfServicePage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
