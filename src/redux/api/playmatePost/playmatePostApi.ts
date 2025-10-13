import { baseApi } from "@redux/api/baseApi";
import type {
  PlaymatePost,
  PlaymatePostDto,
  PlaymatePostEnvelope,
  PlaymatePostListEnvelope,
  PlaymatePostCreateDto,
  PlaymatePostUpdateDto,
  PlaymatePostFilterParams,
  Paged,
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/api/auth/type";

const PLAYMATE_POST_PATH = "PlaymatePost";

type PlaymatePostListRaw =
  | PlaymatePostDto[]
  | Paged<PlaymatePostDto>
  | ApiEnvelope<PlaymatePostDto[] | Paged<PlaymatePostDto>>;

type PlaymatePostRaw = PlaymatePostDto | ApiEnvelope<PlaymatePostDto>;

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

export const playmatePostApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getPlaymatePosts: b.query<PlaymatePostListEnvelope, PlaymatePostFilterParams | undefined>({
      query: (params) => ({ url: `${PLAYMATE_POST_PATH}${toQuery(params)}` }),
      transformResponse: (resp: PlaymatePostListRaw): PlaymatePostListEnvelope => {
        const payload = takeData<PlaymatePostDto[] | Paged<PlaymatePostDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<PlaymatePostDto>(payload)) {
          const mapped: Paged<PlaymatePost> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<PlaymatePost[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<PlaymatePost> | undefined)?.items;

        return list
          ? [
              ...list.map((s) => ({ type: "PlaymatePost" as const, id: s.id })),
              { type: "PlaymatePost" as const, id: "LIST" },
            ]
          : [{ type: "PlaymatePost" as const, id: "LIST" }];
      },
    }),

    getPlaymatePost: b.query<PlaymatePostEnvelope, number>({
      query: (id) => ({ url: `${PLAYMATE_POST_PATH}/${id}` }),
      transformResponse: (resp: PlaymatePostRaw): PlaymatePostEnvelope => {
        const dto = takeData<PlaymatePostDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      providesTags: (res) =>
        res?.data?.id ? [{ type: "PlaymatePost", id: res.data.id }] : [],
    }),

    getMyPlaymatePosts: b.query<PlaymatePostListEnvelope, PlaymatePostFilterParams | undefined>({
      query: (params) => ({ url: `${PLAYMATE_POST_PATH}/my${toQuery(params)}` }),
      transformResponse: (resp: PlaymatePostListRaw): PlaymatePostListEnvelope => {
        const payload = takeData<PlaymatePostDto[] | Paged<PlaymatePostDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<PlaymatePostDto>(payload)) {
          const mapped: Paged<PlaymatePost> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<PlaymatePost[]>([]);
      },
      providesTags: [{ type: "PlaymatePost", id: "LIST" }],
    }),

    getPlaymatePostsByCourt: b.query<PlaymatePostListEnvelope, { courtId: number; params?: PlaymatePostFilterParams }>({
      query: ({ courtId, params }) => ({ url: `${PLAYMATE_POST_PATH}/court/${courtId}${toQuery(params)}` }),
      transformResponse: (resp: PlaymatePostListRaw): PlaymatePostListEnvelope => {
        const payload = takeData<PlaymatePostDto[] | Paged<PlaymatePostDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<PlaymatePostDto>(payload)) {
          const mapped: Paged<PlaymatePost> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<PlaymatePost[]>([]);
      },
      providesTags: [{ type: "PlaymatePost", id: "LIST" }],
    }),

    createPlaymatePost: b.mutation<PlaymatePostEnvelope, PlaymatePostCreateDto>({
      query: (body) => ({
        url: PLAYMATE_POST_PATH,
        method: "POST",
        body,
      }),
      transformResponse: (resp: PlaymatePostRaw): PlaymatePostEnvelope => {
        const dto = takeData<PlaymatePostDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "PlaymatePost", id: "LIST" }],
    }),

    updatePlaymatePost: b.mutation<
      PlaymatePostEnvelope,
      { id: number; body: PlaymatePostUpdateDto }
    >({
      query: ({ id, body }) => ({
        url: `${PLAYMATE_POST_PATH}/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (resp: PlaymatePostRaw): PlaymatePostEnvelope => {
        const dto = takeData<PlaymatePostDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [
              { type: "PlaymatePost", id: res.data.id },
              { type: "PlaymatePost", id: "LIST" },
            ]
          : [{ type: "PlaymatePost", id: "LIST" }],
    }),

    deletePlaymatePost: b.mutation<ApiEnvelope<null>, number>({
      query: (id) => ({ url: `${PLAYMATE_POST_PATH}/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "PlaymatePost", id },
        { type: "PlaymatePost", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPlaymatePostsQuery,
  useGetPlaymatePostQuery,
  useGetMyPlaymatePostsQuery,
  useGetPlaymatePostsByCourtQuery,
  useCreatePlaymatePostMutation,
  useUpdatePlaymatePostMutation,
  useDeletePlaymatePostMutation,
} = playmatePostApi;