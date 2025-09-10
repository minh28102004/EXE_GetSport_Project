import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@pages/HomePage/mainLayout";
import endPoint from "@routes/router";
// User
import HomePage from "@pages/HomePage/Home/mainSection";
import AboutPage from "./pages/HomePage/About/mainSection";
import BlogPost from "@pages/HomePage/BlogPost";
import AuthPage from "@pages/AuthPage";
import TermsOfServicePage from "@pages/TermsOfServicePage";
import FAQsPage from "@pages/HomePage/FAQs";
import ContactPage from "@pages/HomePage/Contact";

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

        {/* Login + Register + forgotPassword */}
        <Route path={endPoint.AUTH} element={<AuthPage />} />

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
          <Route
            path="BookingManagement"
            element={<BookingManagementAdmin />}
          />
          <Route path="BookingReport" element={<BookingReport />} />
          <Route path="UserManagement" element={<UserManagement />} />
        </Route>

        {/* Terms */}
      </Routes>
    </Router>
  );
}

export default App;
