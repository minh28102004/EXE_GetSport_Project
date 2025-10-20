import { baseApi } from "@redux/api/baseApi";
import type {
  Feedback,
  FeedbackDto,
  FeedbackEnvelope,
  FeedbackListEnvelope,
  FeedbackCreateDto,
  FeedbackUpdateDto,
  FeedbackFilterParams,
  Paged,
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/api/auth/type";

const FEEDBACK_PATH = "Feedback";

type FeedbackListRaw =
  | FeedbackDto[]
  | Paged<FeedbackDto>
  | ApiEnvelope<FeedbackDto[] | Paged<FeedbackDto>>;

type FeedbackRaw = FeedbackDto | ApiEnvelope<FeedbackDto>;

interface AverageRatingResponse {
  AverageRating: number;
  TotalFeedbacks: number;
  Feedbacks: Feedback[];
  Pagination: {
    TotalCount: number;
    PageSize: number;
    CurrentPage: number;
    TotalPages: number;
  };
}

interface AverageRatingEnvelope {
  statusCode: number;
  status: string;
  message: string;
  errors: null | Record<string, string[]>;
  data: AverageRatingResponse;
}

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

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getFeedbacks: b.query<FeedbackListEnvelope, FeedbackFilterParams | undefined>({
      query: (params) => ({ url: `${FEEDBACK_PATH}${toQuery(params)}` }),
      transformResponse: (resp: FeedbackListRaw): FeedbackListEnvelope => {
        console.log("getFeedbacks Response:", resp); // Log response for debugging
        const payload = takeData<FeedbackDto[] | Paged<FeedbackDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<FeedbackDto>(payload)) {
          const mapped: Paged<Feedback> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<Feedback[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<Feedback> | undefined)?.items;

        return list
          ? [
              ...list.map((s) => ({ type: "Feedback" as const, id: s.id })),
              { type: "Feedback" as const, id: "LIST" },
            ]
          : [{ type: "Feedback" as const, id: "LIST" }];
      },
    }),

    getFeedback: b.query<FeedbackEnvelope, number>({
      query: (id) => ({ url: `${FEEDBACK_PATH}/${id}` }),
      transformResponse: (resp: FeedbackRaw): FeedbackEnvelope => {
        console.log("getFeedback Response:", resp); // Log response for debugging
        const dto = takeData<FeedbackDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      providesTags: (res) =>
        res?.data?.id ? [{ type: "Feedback", id: res.data.id }] : [],
    }),

    getMyFeedbacks: b.query<FeedbackListEnvelope, FeedbackFilterParams | undefined>({
      query: (params) => ({ url: `${FEEDBACK_PATH}/my${toQuery(params)}` }),
      transformResponse: (resp: FeedbackListRaw): FeedbackListEnvelope => {
        console.log("getMyFeedbacks Response:", resp); // Log response for debugging
        const payload = takeData<FeedbackDto[] | Paged<FeedbackDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<FeedbackDto>(payload)) {
          const mapped: Paged<Feedback> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<Feedback[]>([]);
      },
      providesTags: [{ type: "Feedback", id: "LIST" }],
    }),

    getFeedbacksByCourt: b.query<FeedbackListEnvelope, { courtId: number; params?: FeedbackFilterParams }>({
      query: ({ courtId, params }) => {
        if (!courtId || courtId <= 0) {
          throw new Error("Invalid courtId provided for getFeedbacksByCourt");
        }
        return { url: `${FEEDBACK_PATH}/court/${courtId}${toQuery(params)}` };
      },
      transformResponse: (resp: FeedbackListRaw): FeedbackListEnvelope => {
        console.log("getFeedbacksByCourt Response:", resp); // Log response for debugging
        const payload = takeData<FeedbackDto[] | Paged<FeedbackDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<FeedbackDto>(payload)) {
          const mapped: Paged<Feedback> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<Feedback[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<Feedback> | undefined)?.items;

        return list
          ? [
              ...list.map((s) => ({ type: "Feedback" as const, id: s.id })),
              { type: "Feedback" as const, id: "LIST" },
            ]
          : [{ type: "Feedback" as const, id: "LIST" }];
      },
    }),

    getAverageRatingByCourt: b.query<AverageRatingEnvelope, { courtId: number; params?: FeedbackFilterParams }>({
      query: ({ courtId, params }) => {
        if (!courtId || courtId <= 0) {
          throw new Error("Invalid courtId provided for getAverageRatingByCourt");
        }
        return {
          url: `${FEEDBACK_PATH}/court/${courtId}/average-rating${toQuery(params)}`,
        };
      },
      transformResponse: (resp: any): AverageRatingEnvelope => {
        console.log("getAverageRatingByCourt Response:", resp); // Log response for debugging
        const payload = takeData<AverageRatingResponse>(resp);
        const mapped: AverageRatingResponse = {
          ...payload,
          AverageRating: payload.AverageRating ?? 0,
          TotalFeedbacks: payload.TotalFeedbacks ?? 0,
          Feedbacks: Array.isArray(payload.Feedbacks) ? payload.Feedbacks.map(mapDtoToUi) : [], // Handle undefined/null
          Pagination: payload.Pagination ?? {
            TotalCount: 0,
            PageSize: 5,
            CurrentPage: 1,
            TotalPages: 1,
          },
        };
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: [{ type: "Feedback", id: "LIST" }],
    }),

    createFeedback: b.mutation<FeedbackEnvelope, FeedbackCreateDto>({
      query: (body) => ({
        url: FEEDBACK_PATH,
        method: "POST",
        body,
      }),
      transformResponse: (resp: FeedbackRaw): FeedbackEnvelope => {
        console.log("createFeedback Response:", resp); // Log response for debugging
        const dto = takeData<FeedbackDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "Feedback", id: "LIST" }],
    }),

    updateFeedback: b.mutation<
      FeedbackEnvelope,
      { id: number; body: FeedbackUpdateDto }
    >({
      query: ({ id, body }) => ({
        url: `${FEEDBACK_PATH}/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (resp: FeedbackRaw): FeedbackEnvelope => {
        const dto = takeData<FeedbackDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [
              { type: "Feedback", id: res.data.id },
              { type: "Feedback", id: "LIST" },
            ]
          : [{ type: "Feedback", id: "LIST" }],
    }),

    deleteFeedback: b.mutation<ApiEnvelope<null>, number>({
      query: (id) => ({ url: `${FEEDBACK_PATH}/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "Feedback", id },
        { type: "Feedback", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFeedbacksQuery,
  useGetFeedbackQuery,
  useGetMyFeedbacksQuery,
  useGetFeedbacksByCourtQuery,
  useGetAverageRatingByCourtQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} = feedbackApi;