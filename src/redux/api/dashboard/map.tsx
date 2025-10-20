import type {
  AdminDashboard,
  OwnerDashboard,
  AdminDashboardDto,
  OwnerDashboardDto,
  TopCourt,
  TopCourtDto,
  RecentBooking,
  RecentBookingDto,
  RecentFeedback,
  RecentFeedbackDto,
} from "./dashboardTypes";

// Mapping functions
export const mapAdminDtoToUi = (dto: AdminDashboardDto): AdminDashboard => ({
  totalUsers: dto.totalUsers,
  totalActiveUsers: dto.totalActiveUsers,
  usersByRole: dto.usersByRole,
  totalCourts: dto.totalCourts,
  courtsByStatus: dto.courtsByStatus,
  totalBookings: dto.totalBookings,
  bookingsByStatus: dto.bookingsByStatus,
  totalFeedbacks: dto.totalFeedbacks,
  averageRating: dto.averageRating,
  totalBlogPosts: dto.totalBlogPosts,
  totalPlaymatePosts: dto.totalPlaymatePosts,
  totalOwnerPackages: dto.totalOwnerPackages,
  totalUserPackages: dto.totalUserPackages,
  totalVouchers: dto.totalVouchers,
  totalWalletTransactions: dto.totalWalletTransactions,
  dailyRevenue: dto.dailyRevenue,
  monthlyRevenue: dto.monthlyRevenue,
  totalRevenue: dto.totalRevenue,
});

export const mapOwnerDtoToUi = (dto: OwnerDashboardDto): OwnerDashboard => ({
  totalCourts: dto.totalCourts,
  courtsByStatus: dto.courtsByStatus,
  totalBookings: dto.totalBookings,
  bookingsByStatus: dto.bookingsByStatus,
  totalFeedbacks: dto.totalFeedbacks,
  averageRating: dto.averageRating,
  totalOwnerPackages: dto.totalOwnerPackages,
  activeOwnerPackages: dto.activeOwnerPackages,
  totalPlaymatePosts: dto.totalPlaymatePosts,
  dailyRevenue: dto.dailyRevenue,
  monthlyRevenue: dto.monthlyRevenue,
  totalRevenue: dto.totalRevenue,
});

export const mapTopCourtDtoToUi = (dto: TopCourtDto): TopCourt => ({
  courtId: dto.courtId,
  name: dto.name ?? "Unknown Court",
  bookingCount: dto.bookingCount,
});

export const mapRecentBookingDtoToUi = (dto: RecentBookingDto): RecentBooking => ({
  bookingId: dto.bookingId,
  userName: dto.userName ?? "Unknown User",
  courtName: dto.courtName ?? "Unknown Court",
  bookingDate: dto.bookingDate,
  status: dto.status ?? "Unknown",
});

export const mapRecentFeedbackDtoToUi = (dto: RecentFeedbackDto): RecentFeedback => ({
  feedbackId: dto.feedbackId,
  userName: dto.userName ?? "Unknown User",
  courtName: dto.courtName ?? "Unknown Court",
  rating: dto.rating ?? 0,
  comment: dto.comment ?? "",
  createAt: dto.createAt,
});