// @redux/api/court/courtApi.ts
import { baseApi } from "@redux/api/baseApi";
import type {
  Court,
  CourtDto,
  CourtEnvelope,
  CourtListEnvelope,
  CreateCourtDto,
  UpdateCourtDto,
  ListParams,
  Paged,
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/api/auth/type";

/** Path theo BE */
const COURT_PATH = "Court";

/** ---- Helpers & type guards (no any) ---- */
type CourtListRaw =
  | CourtDto[]
  | Paged<CourtDto>
  | ApiEnvelope<CourtDto[] | Paged<CourtDto>>;

type CourtRaw = CourtDto | ApiEnvelope<CourtDto>;

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
  const obj = v as {
    items?: unknown;
    total?: unknown;
    page?: unknown;
    pageSize?: unknown;
  };
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
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

/** ---- Endpoints ---- */
export const courtApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /** LIST - với filters & pagination */
    getCourts: b.query<CourtListEnvelope, ListParams | undefined>({
      query: (params) => ({ url: `${COURT_PATH}${toQuery(params)}` }),
      transformResponse: (resp: CourtListRaw): CourtListEnvelope => {
        const payload = takeData<CourtDto[] | Paged<CourtDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<CourtDto>(payload)) {
          const mapped: Paged<Court> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<Court[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<Court> | undefined)?.items;

        return list
          ? [
              ...list.map((c) => ({ type: "Court" as const, id: c.id })),
              { type: "Court" as const, id: "LIST" },
            ]
          : [{ type: "Court" as const, id: "LIST" }];
      },
    }),

    /** DETAIL */
    getCourt: b.query<CourtEnvelope, number | string>({
      query: (id) => ({ url: `${COURT_PATH}/${id}` }),
      transformResponse: (resp: CourtRaw): CourtEnvelope => {
        const dto = takeData<CourtDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      providesTags: (res) =>
        res?.data?.id ? [{ type: "Court", id: res.data.id }] : [],
    }),

    /** MY COURTS (cho Owner/Customer) */
    getMyCourts: b.query<CourtListEnvelope, ListParams | undefined>({
      query: (params) => ({ url: `${COURT_PATH}/my${toQuery(params)}` }),
      transformResponse: (resp: CourtListRaw): CourtListEnvelope => {
        // Tương tự getCourts
        const payload = takeData<CourtDto[] | Paged<CourtDto>>(resp);
        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }
        if (isPaged<CourtDto>(payload)) {
          const mapped: Paged<Court> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }
        return okEnvelope<Court[]>([]);
      },
      providesTags: [{ type: "Court", id: "MY_LIST" }],
    }),

    /** CREATE - hỗ trợ FormData cho images */
    createCourt: b.mutation<CourtEnvelope, CreateCourtDto>({
      query: (body) => {
        const formData = new FormData();
        if (body.location) formData.append("Location", body.location);
        if (body.pricePerHour !== undefined) formData.append("Priceperhour", body.pricePerHour.toString());
        if (body.priority !== undefined) formData.append("Priority", body.priority.toString());
        if (body.startDate) formData.append("Startdate", body.startDate.toString());
        if (body.endDate) formData.append("Enddate", body.endDate.toString());
        if (body.images && body.images.length > 0) {
          body.images.forEach((image) => formData.append("Images", image));
        }
        return { url: `${COURT_PATH}`, method: "POST", body: formData };
      },
      transformResponse: (resp: CourtRaw): CourtEnvelope => {
        const dto = takeData<CourtDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "Court", id: "LIST" }],
    }),

    /** UPDATE - hỗ trợ FormData */
    updateCourt: b.mutation<
      CourtEnvelope,
      { id: number | string; body: UpdateCourtDto }
    >({
      query: ({ id, body }) => {
        const formData = new FormData();
        if (body.location !== undefined) formData.append("Location", body.location || "");
        if (body.pricePerHour !== undefined) formData.append("Priceperhour", body.pricePerHour.toString());
        if (body.priority !== undefined) formData.append("Priority", body.priority.toString());
        if (body.startDate !== undefined) formData.append("Startdate", body.startDate || "");
        if (body.endDate !== undefined) formData.append("Enddate", body.endDate || "");
        if (body.status !== undefined) formData.append("Status", body.status);
        if (body.images && body.images.length > 0) {
          body.images.forEach((image) => formData.append("Images", image));
        }
        return { url: `${COURT_PATH}/${id}`, method: "PUT", body: formData };
      },
      transformResponse: (resp: CourtRaw): CourtEnvelope => {
        const dto = takeData<CourtDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [
              { type: "Court", id: res.data.id },
              { type: "Court", id: "LIST" },
            ]
          : [{ type: "Court", id: "LIST" }],
    }),

    /** DELETE */
    deleteCourt: b.mutation<ApiEnvelope<null>, number | string>({
      query: (id) => ({ url: `${COURT_PATH}/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "Court", id },
        { type: "Court", id: "LIST" },
      ],
    }),

    /** FEEDBACKS */
    getCourtFeedbacks: b.query<any, number>({
      query: (id) => ({ url: `${COURT_PATH}/${id}/feedbacks` }),
      providesTags: (res, err, id) => [{ type: "Court", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCourtsQuery,
  useGetCourtQuery,
  useGetMyCourtsQuery,
  useCreateCourtMutation,
  useUpdateCourtMutation,
  useDeleteCourtMutation,
  useGetCourtFeedbacksQuery,
} = courtApi;