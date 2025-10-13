import { baseApi } from "@redux/api/baseApi";
import type {
  CourtBooking,
  CourtBookingDto,
  CourtBookingEnvelope,
  CourtBookingListEnvelope,
  CourtBookingCreateDto,
  CourtBookingUpdateDto,
  CourtBookingFilterParams,
  Paged,
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/api/auth/type";

const COURT_BOOKING_PATH = "CourtBooking";

type CourtBookingListRaw = CourtBookingDto[] | Paged<CourtBookingDto> | ApiEnvelope<CourtBookingDto[] | Paged<CourtBookingDto>>;
type CourtBookingRaw = CourtBookingDto | ApiEnvelope<CourtBookingDto>;

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

function isPaged<T>(v: unknown): v is Paged<T> {
  const obj = v as { items?: unknown; totalCount?: unknown; currentPage?: unknown; pageSize?: unknown };
  return typeof v === "object" && v !== null && Array.isArray(obj.items);
}

const okEnvelope = <T>(data: T): ApiEnvelope<T> => ({
  statusCode: 200,
  status: "OK",
  message: "",
  errors: null,
  data,
});

const toQuery = (params?: Record<string, unknown>) => {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      if (v instanceof Date) {
        q.append(k, v.toISOString());
      } else {
        q.append(k, String(v));
      }
    }
  });
  return q.toString() ? `?${q.toString()}` : "";
};

export const courtBookingApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getCourtBookings: b.query<CourtBookingListEnvelope, CourtBookingFilterParams | undefined>({
      query: (params) => ({ url: `${COURT_BOOKING_PATH}${toQuery(params)}` }),
      transformResponse: (resp: CourtBookingListRaw): CourtBookingListEnvelope => {
        const payload = takeData<CourtBookingDto[] | Paged<CourtBookingDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<CourtBookingDto>(payload)) {
          const mapped: Paged<CourtBooking> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<CourtBooking[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<CourtBooking> | undefined)?.items;
        return list
          ? [
              ...list.map((b) => ({ type: "CourtBooking" as const, id: b.id })),
              { type: "CourtBooking" as const, id: "LIST" },
            ]
          : [{ type: "CourtBooking" as const, id: "LIST" }];
      },
    }),

    getMyCourtBookings: b.query<CourtBookingListEnvelope, CourtBookingFilterParams | undefined>({
      query: (params) => ({ url: `${COURT_BOOKING_PATH}/my${toQuery(params)}` }),
      transformResponse: (resp: CourtBookingListRaw): CourtBookingListEnvelope => {
        const payload = takeData<CourtBookingDto[] | Paged<CourtBookingDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<CourtBookingDto>(payload)) {
          const mapped: Paged<CourtBooking> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<CourtBooking[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<CourtBooking> | undefined)?.items;
        return list
          ? [
              ...list.map((b) => ({ type: "CourtBooking" as const, id: b.id })),
              { type: "CourtBooking" as const, id: "MY_LIST" },
            ]
          : [{ type: "CourtBooking" as const, id: "MY_LIST" }];
      },
    }),

    getCourtBooking: b.query<CourtBookingEnvelope, number>({
      query: (id) => ({ url: `${COURT_BOOKING_PATH}/${id}` }),
      transformResponse: (resp: CourtBookingRaw): CourtBookingEnvelope => {
        const dto = takeData<CourtBookingDto>(resp);
        const mapped = mapDtoToUi(dto as any);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      providesTags: (res) =>
        res?.data?.id ? [{ type: "CourtBooking", id: res.data.id }] : [],
    }),

    createCourtBooking: b.mutation<CourtBookingEnvelope & { paymentLink?: string }, CourtBookingCreateDto>({
      query: (body) => ({
        url: COURT_BOOKING_PATH,
        method: "POST",
        body,
      }),
      transformResponse: (resp: CourtBookingRaw & { paymentLink?: string }): CourtBookingEnvelope & { paymentLink?: string } => {
        const dto = takeData<CourtBookingDto>(resp);
        const mapped = mapDtoToUi(dto as any);
        return isEnvelope(resp)
          ? { ...resp, data: mapped, paymentLink: resp.paymentLink }
          : { ...okEnvelope(mapped), paymentLink: resp.paymentLink };
      },
      invalidatesTags: [
        { type: "CourtBooking", id: "LIST" },
        { type: "CourtBooking", id: "MY_LIST" },
      ],
    }),

    updateCourtBooking: b.mutation<CourtBookingEnvelope, { id: number; body: CourtBookingUpdateDto }>({
      query: ({ id, body }) => ({
        url: `${COURT_BOOKING_PATH}/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (resp: CourtBookingRaw): CourtBookingEnvelope => {
        const dto = takeData<CourtBookingDto>(resp);
        const mapped = mapDtoToUi(dto as any);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [
              { type: "CourtBooking", id: res.data.id },
              { type: "CourtBooking", id: "LIST" },
              { type: "CourtBooking", id: "MY_LIST" },
            ]
          : [
              { type: "CourtBooking", id: "LIST" },
              { type: "CourtBooking", id: "MY_LIST" },
            ],
    }),

    deleteCourtBooking: b.mutation<ApiEnvelope<null>, number>({
      query: (id) => ({ url: `${COURT_BOOKING_PATH}/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "CourtBooking", id },
        { type: "CourtBooking", id: "LIST" },
        { type: "CourtBooking", id: "MY_LIST" },
      ],
    }),

    checkPaymentStatus: b.query<ApiEnvelope<{ status: string }>, number>({
      query: (id) => ({ url: `${COURT_BOOKING_PATH}/${id}/payment-status` }),
      providesTags: (res, _err, id) => [{ type: "CourtBooking", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCourtBookingsQuery,
  useGetMyCourtBookingsQuery,
  useGetCourtBookingQuery,
  useCreateCourtBookingMutation,
  useUpdateCourtBookingMutation,
  useDeleteCourtBookingMutation,
  useCheckPaymentStatusQuery,
} = courtBookingApi;