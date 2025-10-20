import { baseApi } from "@redux/api/baseApi";
import type { ApiEnvelope } from "@redux/api/auth/type";
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
} from "./type";
import {
  mapAdminDtoToUi,
  mapOwnerDtoToUi,
  mapTopCourtDtoToUi,
  mapRecentBookingDtoToUi,
  mapRecentFeedbackDtoToUi,
} from "./map";

function isEnvelope<T>(v: unknown): v is ApiEnvelope<T> {
  return (
    typeof v === "object" &&
    v !== null &&
    "data" in (v as Record<string, unknown>) &&
    "statusCode" in (v as Record<string, unknown>)
  );
}

function takeData<T>(v: ApiEnvelope<T> | T): T {
  return isEnvelope<T>(v) ? v.data : v;
}

function okEnvelope<T>(data: T): ApiEnvelope<T> {
  return {
    statusCode: 200,
    status: "OK",
    message: "",
    errors: null,
    data,
  };
}

const toQuery = (params?: Record<string, unknown>) => {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

// Dashboard API
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<
      ApiEnvelope<AdminDashboard>,
      { startDate?: string; endDate?: string } | undefined
    >({
      query: (params) => ({
        url: `Dashboard/admin${toQuery(params)}`,
      }),
      transformResponse: (resp: ApiEnvelope<AdminDashboardDto> | AdminDashboardDto): ApiEnvelope<AdminDashboard> => {
        const dto = takeData<AdminDashboardDto>(resp);
        const mapped = mapAdminDtoToUi(dto);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Dashboard", id: "ADMIN" }],
    }),

    getOwnerDashboard: builder.query<
      ApiEnvelope<OwnerDashboard>,
      { startDate?: string; endDate?: string } | undefined
    >({
      query: (params) => ({
        url: `Dashboard/owner${toQuery(params)}`,
      }),
      transformResponse: (resp: ApiEnvelope<OwnerDashboardDto> | OwnerDashboardDto): ApiEnvelope<OwnerDashboard> => {
        const dto = takeData<OwnerDashboardDto>(resp);
        const mapped = mapOwnerDtoToUi(dto);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Dashboard", id: "OWNER" }],
    }),

    getAdminTopCourts: builder.query<
      ApiEnvelope<TopCourt[]>,
      { startDate?: string; endDate?: string; topN?: number } | undefined
    >({
      query: (params) => ({
        url: `Dashboard/admin/top-courts${toQuery(params)}`,
      }),
      transformResponse: (resp: ApiEnvelope<TopCourtDto[]> | TopCourtDto[]): ApiEnvelope<TopCourt[]> => {
        const dto = takeData<TopCourtDto[]>(resp);
        const mapped = dto.map(mapTopCourtDtoToUi);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Dashboard", id: "TOP_COURTS_ADMIN" }],
    }),

    getOwnerTopCourts: builder.query<
      ApiEnvelope<TopCourt[]>,
      { startDate?: string; endDate?: string; topN?: number } | undefined
    >({
      query: (params) => ({
        url: `Dashboard/owner/top-courts${toQuery(params)}`,
      }),
      transformResponse: (resp: ApiEnvelope<TopCourtDto[]> | TopCourtDto[]): ApiEnvelope<TopCourt[]> => {
        const dto = takeData<TopCourtDto[]>(resp);
        const mapped = dto.map(mapTopCourtDtoToUi);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Dashboard", id: "TOP_COURTS_OWNER" }],
    }),

    getAdminRecentBookings: builder.query<ApiEnvelope<RecentBooking[]>, { limit?: number } | undefined>({
      query: (params) => ({
        url: `Dashboard/admin/recent-bookings${toQuery(params)}`,
      }),
      transformResponse: (resp: ApiEnvelope<RecentBookingDto[]> | RecentBookingDto[]): ApiEnvelope<RecentBooking[]> => {
        const dto = takeData<RecentBookingDto[]>(resp);
        const mapped = dto.map(mapRecentBookingDtoToUi);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Dashboard", id: "RECENT_BOOKINGS_ADMIN" }],
    }),

    getOwnerRecentBookings: builder.query<ApiEnvelope<RecentBooking[]>, { limit?: number } | undefined>({
      query: (params) => ({
        url: `Dashboard/owner/recent-bookings${toQuery(params)}`,
      }),
      transformResponse: (resp: ApiEnvelope<RecentBookingDto[]> | RecentBookingDto[]): ApiEnvelope<RecentBooking[]> => {
        const dto = takeData<RecentBookingDto[]>(resp);
        const mapped = dto.map(mapRecentBookingDtoToUi);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Dashboard", id: "RECENT_BOOKINGS_OWNER" }],
    }),

    getAdminRecentFeedbacks: builder.query<ApiEnvelope<RecentFeedback[]>, { limit?: number } | undefined>({
      query: (params) => ({
        url: `Dashboard/admin/recent-feedbacks${toQuery(params)}`,
      }),
      transformResponse: (resp: ApiEnvelope<RecentFeedbackDto[]> | RecentFeedbackDto[]): ApiEnvelope<RecentFeedback[]> => {
        const dto = takeData<RecentFeedbackDto[]>(resp);
        const mapped = dto.map(mapRecentFeedbackDtoToUi);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Dashboard", id: "RECENT_FEEDBACKS_ADMIN" }],
    }),

    getOwnerRecentFeedbacks: builder.query<ApiEnvelope<RecentFeedback[]>, { limit?: number } | undefined>({
      query: (params) => ({
        url: `Dashboard/owner/recent-feedbacks${toQuery(params)}`,
      }),
      transformResponse: (resp: ApiEnvelope<RecentFeedbackDto[]> | RecentFeedbackDto[]): ApiEnvelope<RecentFeedback[]> => {
        const dto = takeData<RecentFeedbackDto[]>(resp);
        const mapped = dto.map(mapRecentFeedbackDtoToUi);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Dashboard", id: "RECENT_FEEDBACKS_OWNER" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminDashboardQuery,
  useGetOwnerDashboardQuery,
  useGetAdminTopCourtsQuery,
  useGetOwnerTopCourtsQuery,
  useGetAdminRecentBookingsQuery,
  useGetOwnerRecentBookingsQuery,
  useGetAdminRecentFeedbacksQuery,
  useGetOwnerRecentFeedbacksQuery,
} = dashboardApi;