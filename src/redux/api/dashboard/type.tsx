import type { ApiEnvelope } from "@redux/api/auth/type";

// BE DTOs
export type AdminDashboardDto = {
  totalUsers: number;
  totalActiveUsers: number;
  usersByRole: Record<string, number>;
  totalCourts: number;
  courtsByStatus: Record<string, number>;
  totalBookings: number;
  bookingsByStatus: Record<string, number>;
  totalFeedbacks: number;
  averageRating: number;
  totalBlogPosts: number;
  totalPlaymatePosts: number;
  totalOwnerPackages: number;
  totalUserPackages: number;
  totalVouchers: number;
  totalWalletTransactions: number;
  dailyRevenue: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  totalRevenue: number;
};

export type OwnerDashboardDto = {
  totalCourts: number;
  courtsByStatus: Record<string, number>;
  totalBookings: number;
  bookingsByStatus: Record<string, number>;
  totalFeedbacks: number;
  averageRating: number;
  totalOwnerPackages: number;
  activeOwnerPackages: number;
  totalPlaymatePosts: number;
  dailyRevenue: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  totalRevenue: number;
};

export type TopCourtDto = {
  courtId: number;
  name: string | null;
  bookingCount: number;
};

export type RecentBookingDto = {
  bookingId: number;
  userName: string | null;
  courtName: string | null;
  bookingDate: string;
  status: string | null;
};

export type RecentFeedbackDto = {
  feedbackId: number;
  userName: string | null;
  courtName: string | null;
  rating: number | null;
  comment: string | null;
  createAt: string;
};

// UI Types (camelCase and simplified)
export type AdminDashboard = {
  totalUsers: number;
  totalActiveUsers: number;
  usersByRole: Record<string, number>;
  totalCourts: number;
  courtsByStatus: Record<string, number>;
  totalBookings: number;
  bookingsByStatus: Record<string, number>;
  totalFeedbacks: number;
  averageRating: number;
  totalBlogPosts: number;
  totalPlaymatePosts: number;
  totalOwnerPackages: number;
  totalUserPackages: number;
  totalVouchers: number;
  totalWalletTransactions: number;
  dailyRevenue: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  totalRevenue: number;
};

export type OwnerDashboard = {
  totalCourts: number;
  courtsByStatus: Record<string, number>;
  totalBookings: number;
  bookingsByStatus: Record<string, number>;
  totalFeedbacks: number;
  averageRating: number;
  totalOwnerPackages: number;
  activeOwnerPackages: number;
  totalPlaymatePosts: number;
  dailyRevenue: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  totalRevenue: number;
};

export type TopCourt = {
  courtId: number;
  name: string;
  bookingCount: number;
};

export type RecentBooking = {
  bookingId: number;
  userName: string;
  courtName: string;
  bookingDate: string;
  status: string;
};

export type RecentFeedback = {
  feedbackId: number;
  userName: string;
  courtName: string;
  rating: number;
  comment: string;
  createAt: string;
};

export type DashboardEnvelope = ApiEnvelope<
  AdminDashboard | OwnerDashboard | TopCourt[] | RecentBooking[] | RecentFeedback[]
>;