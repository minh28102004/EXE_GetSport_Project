import { baseApi } from "@redux/api/baseApi";
import type {
  PlaymateJoin,
  PlaymateJoinDto,
  PlaymateJoinEnvelope,
  PlaymateJoinListEnvelope,
  PlaymateJoinCreateDto,
  PlaymateJoinFilterParams,
  Paged,
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/api/auth/type";

const PLAYMATE_JOIN_PATH = "PlaymateJoin";

type PlaymateJoinListRaw =
  | PlaymateJoinDto[]
  | Paged<PlaymateJoinDto>
  | ApiEnvelope<PlaymateJoinDto[] | Paged<PlaymateJoinDto>>;

type PlaymateJoinRaw = PlaymateJoinDto | ApiEnvelope<PlaymateJoinDto>;

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

export const playmateJoinApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getPlaymateJoins: b.query<PlaymateJoinListEnvelope, PlaymateJoinFilterParams | undefined>({
      query: (params) => ({ url: `${PLAYMATE_JOIN_PATH}${toQuery(params)}` }),
      transformResponse: (resp: PlaymateJoinListRaw): PlaymateJoinListEnvelope => {
        const payload = takeData<PlaymateJoinDto[] | Paged<PlaymateJoinDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<PlaymateJoinDto>(payload)) {
          const mapped: Paged<PlaymateJoin> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<PlaymateJoin[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<PlaymateJoin> | undefined)?.items;

        return list
          ? [
              ...list.map((s) => ({ type: "PlaymateJoin" as const, id: s.id })),
              { type: "PlaymateJoin" as const, id: "LIST" },
            ]
          : [{ type: "PlaymateJoin" as const, id: "LIST" }];
      },
    }),

    getPlaymateJoin: b.query<PlaymateJoinEnvelope, number>({
      query: (id) => ({ url: `${PLAYMATE_JOIN_PATH}/${id}` }),
      transformResponse: (resp: PlaymateJoinRaw): PlaymateJoinEnvelope => {
        const dto = takeData<PlaymateJoinDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      providesTags: (res) =>
        res?.data?.id ? [{ type: "PlaymateJoin", id: res.data.id }] : [],
    }),

    getMyPlaymateJoins: b.query<PlaymateJoinListEnvelope, PlaymateJoinFilterParams | undefined>({
      query: (params) => ({ url: `${PLAYMATE_JOIN_PATH}/my${toQuery(params)}` }),
      transformResponse: (resp: PlaymateJoinListRaw): PlaymateJoinListEnvelope => {
        const payload = takeData<PlaymateJoinDto[] | Paged<PlaymateJoinDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<PlaymateJoinDto>(payload)) {
          const mapped: Paged<PlaymateJoin> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<PlaymateJoin[]>([]);
      },
      providesTags: [{ type: "PlaymateJoin", id: "LIST" }],
    }),

    getPlaymateJoinsByCourt: b.query<PlaymateJoinListEnvelope, { courtId: number; params?: PlaymateJoinFilterParams }>({
      query: ({ courtId, params }) => ({ url: `${PLAYMATE_JOIN_PATH}/court/${courtId}${toQuery(params)}` }),
      transformResponse: (resp: PlaymateJoinListRaw): PlaymateJoinListEnvelope => {
        const payload = takeData<PlaymateJoinDto[] | Paged<PlaymateJoinDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<PlaymateJoinDto>(payload)) {
          const mapped: Paged<PlaymateJoin> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<PlaymateJoin[]>([]);
      },
      providesTags: [{ type: "PlaymateJoin", id: "LIST" }],
    }),

    createPlaymateJoin: b.mutation<PlaymateJoinEnvelope, PlaymateJoinCreateDto>({
      query: (body) => ({
        url: PLAYMATE_JOIN_PATH,
        method: "POST",
        body,
      }),
      transformResponse: (resp: PlaymateJoinRaw): PlaymateJoinEnvelope => {
        const dto = takeData<PlaymateJoinDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "PlaymateJoin", id: "LIST" }, { type: "PlaymatePost", id: "LIST" }],
    }),

    deletePlaymateJoin: b.mutation<ApiEnvelope<null>, number>({
      query: (id) => ({ url: `${PLAYMATE_JOIN_PATH}/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "PlaymateJoin", id },
        { type: "PlaymateJoin", id: "LIST" },
        { type: "PlaymatePost", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPlaymateJoinsQuery,
  useGetPlaymateJoinQuery,
  useGetMyPlaymateJoinsQuery,
  useGetPlaymateJoinsByCourtQuery,
  useCreatePlaymateJoinMutation,
  useDeletePlaymateJoinMutation,
} = playmateJoinApi;