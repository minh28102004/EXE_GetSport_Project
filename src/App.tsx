import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import endPoint from "@routes/router";
import ErrorBoundary from "@components/Error_Boundary";
// Layout chung
import MainLayout from "@pages/HomePage/mainLayout";
import ManagementLayout from "@layout/ManagementLayout";
// User
import HomePage from "@pages/HomePage/Home/mainSection";
import AboutPage from "@pages/HomePage/About/mainSection";
import BlogPost from "@pages/HomePage/BlogPost";
import AuthPage from "@pages/AuthPage";
import TermsOfServicePage from "@pages/TermsOfServicePage";
import FAQsPage from "@pages/HomePage/FAQs";
import ContactPage from "@pages/HomePage/Contact";

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

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={endPoint.HOMEPAGE} element={<HomePage />} />
          <Route path={endPoint.ABOUT} element={<AboutPage />} />
          <Route path={endPoint.BLOGPOST} element={<BlogPost />} />
          <Route path={endPoint.FAQS} element={<FAQsPage />} />
          <Route path={endPoint.CONTACT} element={<ContactPage />} />

          <Route
            path={endPoint.TERMSOFSERVICE}
            element={<TermsOfServicePage />}
          />
        </Route>

        {/* <Route path="/layout" element={<BadmintonDashboard />} /> */}

        {/* Login + Register + forgotPassword */}
        <Route path={endPoint.AUTH} element={<AuthPage />} />

        {/* Staff layout + nested routes */}
        <Route path="/layoutOwner" element={<ManagementLayout role="owner" />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="CourtManagement" element={<CourtManagement />} />
          <Route path="BookingManagement" element={<BookingManagement />} />
          <Route path="Settings" element={<StaffProfile />} />
        </Route>

        {/* Admin layout + nested routes */}
        <Route path="/layoutAdmin" element={<ManagementLayout role="admin" />}>
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
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
