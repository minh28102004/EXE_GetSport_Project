// src/App.tsx (AppRoutes)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import endPoint from "@routes/router";
import ErrorBoundary from "@components/Error_Boundary";
import { Navigate } from "react-router-dom";
// Layout
import MainLayout from "@pages/HomePage/mainLayout";
import ManagementLayout from "@layout/Admin&OwnerLayout/ManagementLayout";
import CustomerLayout from "@layout/CustomerLayout/customerLayout";
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
// Customer
import Profile from "@pages/CustomerPage/Profile";
import History from "@pages/CustomerPage/BookingHistory";
import Posts from "@pages/CustomerPage/Post";
import Reviews from "@pages/CustomerPage/Feedback";
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
import CurrentUserHydrator from "@redux/features/auth/CurrentUserHydrator";
// Access Denied
import AccessDeniedPage from "@pages/UnauthorizedPage";
import BlogManagement from "./pages/AdminPage/BlogManagement";
import PackageManagement from "./pages/AdminPage/PackageManagement";
import CourtBookingManagement from "./pages/AdminPage/CourtBookingManagement";
import CourtSlotManagement from "./pages/AdminPage/CourtSlotManagement";
import CourtSlotsByCourt from "./pages/AdminPage/CourtSlotManagement/CourtSlotsByCourt";
import FeedbacksByCourt from "./pages/AdminPage/FeedbackManagement/FeedbacksByCourt";
import FeedbackManagement from "./pages/AdminPage/FeedbackManagement";
import PlaymatePostManagement from "./pages/AdminPage/PlaymatePostManagement";
import PlaymatePostsByCourt from "./pages/AdminPage/PlaymatePostManagement/PlaymatePostsByCourt";
import PlaymateJoinManagement from "./pages/AdminPage/PlaymateJoinManagement";
import CourtDetail from "./pages/HomePage/CourtBooking/CourtDetail";
import CourtBookingPay from "./pages/HomePage/CourtBooking/CourtBookingPay";
import BookingCallback from "./pages/HomePage/CourtBooking/BookingCallback";
import BookingHistory from "@pages/CustomerPage/BookingHistory";
import BookingDetail from "./pages/CustomerPage/BookingHistory/BookingDetail";
import VerifyAccount from "./pages/AuthPage/VerifyAccount/VerifyAccount";
import BlogDetail from "./pages/HomePage/BlogPost/BlogDetail";
import PlaymatePostList from "./pages/HomePage/PlaymatePost/PlaymatePost";
import PlaymatePostDetail from "./pages/HomePage/PlaymatePost/PlaymatePostDetail";
import CreateBlog from "./pages/CustomerPage/Post/CreateBlog";
import EditBlog from "./pages/CustomerPage/Post/EditBlog";
import PaymentPage from "./pages/OwnerPage/OwnerPackages/PaymentPage";
import SuccessPage from "./pages/OwnerPage/OwnerPackages/SuccessPage";
import CancelPage from "./pages/OwnerPage/OwnerPackages/CancelPage";
import OwnerPackagesList from "./pages/OwnerPage/OwnerPackages/OwnerPackagesList";
import MySubscriptions from "./pages/OwnerPage/OwnerPackages/MySubscriptions";
import ResetPassword from "./pages/AuthPage/ForgotPassword/ResetPassword";

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
          path="/create-blog"
          element={
              <CreateBlog />
          }
        />
        <Route
          path="/edit-blog/:id"
          element={
              <EditBlog />
          }
        />
          <Route path="Auth/verify" element={<VerifyAccount />} />
          <Route path="Auth/reset-password" element={<ResetPassword />} />
          <Route path="/blogPost/:id" element={<BlogDetail />} />
          <Route path="/playPost" element={<PlaymatePostList />} />
          <Route path="/playPost/:id" element={<PlaymatePostDetail />} />
          <Route path="Court/detail/:courtId" element={<CourtDetail />} />
          <Route path="Court/booking/:courtId" element={<CourtBookingPay />} />
          <Route path="/booking/callback/success" element={<BookingCallback />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/booking-detail/:bookingId" element={<BookingDetail/>} />
          <Route path="/booking/callback/cancel" element={<BookingCallback />} />
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

        {/* USER Information protected */}
        <Route
          path={endPoint.CUSTOMER_BASE}
          element={
            <RequireAuth redirectTo={endPoint.HOMEPAGE}>
              <RequireRole
                allowed={["customer", "owner", "admin"]}
                redirectTo={endPoint.ACCESSDENIED}
              >
                <CustomerLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route
            index
            element={<Navigate to={endPoint.CUSTOMER_PROFILE} replace />}
          />
          
          <Route path={endPoint.CUSTOMER_PROFILE} element={<Profile />} />
          <Route path={endPoint.CUSTOMER_HISTORY} element={<History />} />
          <Route path={endPoint.CUSTOMER_POSTS} element={<Posts />} />
          <Route path={endPoint.CUSTOMER_REVIEWS} element={<Reviews />} />
        </Route>

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
          <Route path="Feedback" element={<FeedbackManagement />} />
          <Route path="BookingManagement" element={<BookingManagement />} />
          <Route path="ownerpackage/payment/:id"  element={ <PaymentPage /> } />
          <Route path="ownerpackages"  element={<OwnerPackagesList /> } />
          <Route path="ownerpackage/success" element={<SuccessPage />} />
          <Route path="ownerpackage/cancel" element={<CancelPage />} />
        <Route
          path="my-subscriptions"
          element={

              <MySubscriptions />

          }
        />
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
          <Route path="BlogManagement" element={<BlogManagement />} />
          <Route path="PackageManagement" element={<PackageManagement />} />
          <Route path="CourtBookingManagement" element={<CourtBookingManagement />} />
          <Route path="Settings" element={<AdminProfile />} />
          <Route path="CourtSlotManagement" element={<CourtSlotManagement />} />
          <Route path="Court/:courtId/Slots" element={<CourtSlotsByCourt />} />
          <Route path="FeedbackManagement" element={<FeedbackManagement />} />
          <Route path="Feedback/:courtId" element={<FeedbacksByCourt />} />
          <Route path="PlaymatePostManagement" element={<PlaymatePostManagement />} />
          <Route path="PlaymatePost/:courtId" element={<PlaymatePostsByCourt />} />
          <Route path="PlaymateJoinManagement" element={<PlaymateJoinManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthTokenWatcher />
      <CurrentUserHydrator />   {/* Luôn bật trong suốt vòng đời app */}
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
