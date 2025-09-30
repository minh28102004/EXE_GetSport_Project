// src/App.tsx (AppRoutes)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import endPoint from "@routes/router";
import ErrorBoundary from "@components/Error_Boundary";
import MainLayout from "@pages/HomePage/mainLayout";
import ManagementLayout from "@layout/ManagementLayout";
// Public
import HomePage from "@pages/HomePage/Home/mainSection";
import AboutPage from "@pages/HomePage/About/mainSection";
import BlogPost from "@pages/HomePage/BlogPost";
import AuthPage from "@pages/AuthPage/authLayout";
import FAQsPage from "@pages/HomePage/FAQs";
import ContactPage from "@pages/HomePage/Contact";
import CourtBooking from "@pages/HomePage/CourtBooking";
import TermsOfServicePage from "@pages/TermsOfServicePage";
import PrivacyPolicyPage from "@pages/PrivacyPolicyPage";
// Owner
import Dashboard from "@pages/OwnerPage/Dashboard";
import CourtManagement from "@pages/OwnerPage/CourtManagement";
import BookingManagement from "@pages/OwnerPage/BookingManagement";
import StaffProfile from "@pages/OwnerPage/StaffProfile";
// Admin
import AdminDashboard from "@pages/AdminPage/Dashboard";
import CourtManagementAdmin from "@pages/AdminPage/CourtManagement";
import BookingManagementAdmin from "@pages/AdminPage/BookingManagement";
import BookingReport from "@pages/AdminPage/BookingReport";
import UserManagement from "@pages/AdminPage/UserManagement";
import AdminProfile from "@pages/AdminPage/AdminProfile";
// Services / Guards
import AuthTokenWatcher from "@utils/authTokenWatcher";
import RequireAuth from "@routes/RequireAuth";
import RequireRole from "@routes/RequireRole";
// Access Denied
import AccessDeniedPage from "@pages/UnauthorizedPage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={endPoint.HOMEPAGE} element={<HomePage />} />
          <Route path={endPoint.ABOUT} element={<AboutPage />} />
          <Route path={endPoint.BLOGPOST} element={<BlogPost />} />
          <Route path={endPoint.FAQS} element={<FAQsPage />} />
          <Route path={endPoint.CONTACT} element={<ContactPage />} />
          <Route path={endPoint.COURTBOOKING} element={<CourtBooking />} />
          <Route
            path={endPoint.TERMSOFSERVICE}
            element={<TermsOfServicePage />}
          />
          <Route
            path={endPoint.PRIVACYPOLICY}
            element={<PrivacyPolicyPage />}
          />
        </Route>

        {/* Auth */}
        <Route path={endPoint.AUTH} element={<AuthPage />} />

        {/* Access denied */}
        <Route path={endPoint.ACCESSDENIED} element={<AccessDeniedPage />} />

        {/* OWNER protected */}
        <Route
          path="/layoutOwner"
          element={
            <RequireAuth redirectTo={endPoint.HOMEPAGE}>
              <RequireRole
                allowed={["owner"]}
                redirectTo={endPoint.ACCESSDENIED}
              >
                <ManagementLayout role="owner" />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="CourtManagement" element={<CourtManagement />} />
          <Route path="BookingManagement" element={<BookingManagement />} />
          <Route path="Settings" element={<StaffProfile />} />
        </Route>

        {/* ADMIN protected */}
        <Route
          path="/layoutAdmin"
          element={
            <RequireAuth redirectTo={endPoint.HOMEPAGE}>
              <RequireRole
                allowed={["admin"]}
                redirectTo={endPoint.ACCESSDENIED}
              >
                <ManagementLayout role="admin" />
              </RequireRole>
            </RequireAuth>
          }
        >
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
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthTokenWatcher />
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
