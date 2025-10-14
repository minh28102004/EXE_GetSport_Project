import { baseApi } from "@redux/api/baseApi";
import type {
  CourtSlot,
  CourtSlotDto,
  CourtSlotEnvelope,
  CourtSlotListEnvelope,
  CourtSlotCreateDto,
  BulkCourtSlotCreateDto,
  CourtSlotUpdateDto,
  CourtSlotFilterParams,
  Paged,
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/api/auth/type";

const COURT_SLOT_PATH = "CourtSlot";

type CourtSlotListRaw =
  | CourtSlotDto[]
  | Paged<CourtSlotDto>
  | ApiEnvelope<CourtSlotDto[] | Paged<CourtSlotDto>>;

type CourtSlotRaw = CourtSlotDto | ApiEnvelope<CourtSlotDto>;

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
  const obj = v as { items?: unknown; total?: unknown; page?: unknown; pageSize?: unknown };
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

export const courtSlotApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getCourtSlots: b.query<CourtSlotListEnvelope, CourtSlotFilterParams | undefined>({
      query: (params) => ({ url: `${COURT_SLOT_PATH}${toQuery(params)}` }),
      transformResponse: (resp: CourtSlotListRaw): CourtSlotListEnvelope => {
        const payload = takeData<CourtSlotDto[] | Paged<CourtSlotDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<CourtSlotDto>(payload)) {
          const mapped: Paged<CourtSlot> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<CourtSlot[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<CourtSlot> | undefined)?.items;

        return list
          ? [
              ...list.map((s) => ({ type: "CourtSlot" as const, id: s.id })),
              { type: "CourtSlot" as const, id: "LIST" },
            ]
          : [{ type: "CourtSlot" as const, id: "LIST" }];
      },
    }),

    getCourtSlot: b.query<CourtSlotEnvelope, number>({
      query: (id) => ({ url: `${COURT_SLOT_PATH}/${id}` }),
      transformResponse: (resp: CourtSlotRaw): CourtSlotEnvelope => {
        const dto = takeData<CourtSlotDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      providesTags: (res) =>
        res?.data?.id ? [{ type: "CourtSlot", id: res.data.id }] : [],
    }),

    getSlotsByCourtAndDate: b.query<CourtSlotListEnvelope, { courtId: number; date: string }>({
      query: ({ courtId, date }) => ({ url: `${COURT_SLOT_PATH}/court/${courtId}/date/${date}` }),
      transformResponse: (resp: CourtSlotListRaw): CourtSlotListEnvelope => {
        const payload = takeData<CourtSlotDto[] | Paged<CourtSlotDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<CourtSlotDto>(payload)) {
          const mapped: Paged<CourtSlot> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<CourtSlot[]>([]);
      },
      providesTags: [{ type: "CourtSlot", id: "LIST" }],
    }),

    getSlotsByCourt: b.query<CourtSlotListEnvelope, number>({
      query: (courtId) => ({ url: `${COURT_SLOT_PATH}/court/${courtId}` }),
      transformResponse: (resp: CourtSlotListRaw): CourtSlotListEnvelope => {
        const payload = takeData<CourtSlotDto[] | Paged<CourtSlotDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<CourtSlotDto>(payload)) {
          const mapped: Paged<CourtSlot> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<CourtSlot[]>([]);
      },
      providesTags: [{ type: "CourtSlot", id: "LIST" }],
    }),

    createCourtSlot: b.mutation<CourtSlotEnvelope, CourtSlotCreateDto>({
      query: (body) => ({
        url: COURT_SLOT_PATH,
        method: "POST",
        body,
      }),
      transformResponse: (resp: CourtSlotRaw): CourtSlotEnvelope => {
        const dto = takeData<CourtSlotDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "CourtSlot", id: "LIST" }],
    }),

    createBulkCourtSlot: b.mutation<CourtSlotListEnvelope, BulkCourtSlotCreateDto>({
      query: (body) => ({
        url: `${COURT_SLOT_PATH}/bulk`,
        method: "POST",
        body,
      }),
      transformResponse: (resp: CourtSlotListRaw): CourtSlotListEnvelope => {
        const payload = takeData<CourtSlotDto[] | Paged<CourtSlotDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<CourtSlotDto>(payload)) {
          const mapped: Paged<CourtSlot> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<CourtSlot[]>([]);
      },
      invalidatesTags: [{ type: "CourtSlot", id: "LIST" }],
    }),

    updateCourtSlot: b.mutation<
      CourtSlotEnvelope,
      { id: number; body: CourtSlotUpdateDto }
    >({
      query: ({ id, body }) => ({
        url: `${COURT_SLOT_PATH}/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (resp: CourtSlotRaw): CourtSlotEnvelope => {
        const dto = takeData<CourtSlotDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [
              { type: "CourtSlot", id: res.data.id },
              { type: "CourtSlot", id: "LIST" },
            ]
          : [{ type: "CourtSlot", id: "LIST" }],
    }),

    deleteCourtSlot: b.mutation<ApiEnvelope<null>, number>({
      query: (id) => ({ url: `${COURT_SLOT_PATH}/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "CourtSlot", id },
        { type: "CourtSlot", id: "LIST" },
      ],
    }),

    updateCourtSlotAvailability: b.mutation<CourtSlotEnvelope, { id: number; isAvailable: boolean }>({
      query: ({ id, isAvailable }) => ({
        url: `${COURT_SLOT_PATH}/availability/${id}?available=${isAvailable}`,
        method: "PUT"
      }),
      transformResponse: (resp: CourtSlotRaw): CourtSlotEnvelope => {
        const dto = takeData<CourtSlotDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [
              { type: "CourtSlot", id: res.data.id },
              { type: "CourtSlot", id: "LIST" },
            ]
          : [{ type: "CourtSlot", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCourtSlotsQuery,
  useGetCourtSlotQuery,
  useGetSlotsByCourtAndDateQuery,
  useGetSlotsByCourtQuery,
  useCreateCourtSlotMutation,
  useCreateBulkCourtSlotMutation,
  useUpdateCourtSlotMutation,
  useDeleteCourtSlotMutation,
  useUpdateCourtSlotAvailabilityMutation,
} = courtSlotApi;