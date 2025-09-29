import { baseApi } from "@redux/features/api/baseApi";
import type {
  Account, AccountDto, AccountEnvelope, AccountListEnvelope,
  CreateAccountDto, UpdateAccountDto, ListParams, Paged
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/features/auth/type";

/** ---- Helpers & type guards (no any) ---- */
type AccountListRaw =
  | AccountDto[]
  | Paged<AccountDto>
  | ApiEnvelope<AccountDto[] | Paged<AccountDto>>;

type AccountRaw = AccountDto | ApiEnvelope<AccountDto>;

function isEnvelope<T>(v: unknown): v is ApiEnvelope<T> {
  return typeof v === "object" && v !== null &&
         "data" in (v as Record<string, unknown>) &&
         "statusCode" in (v as Record<string, unknown>);
}
function takeData<T>(v: ApiEnvelope<T> | T): T {
  return isEnvelope<T>(v) ? v.data : v;
}
function isPaged<T>(v: unknown): v is Paged<T> {
  const obj = v as { items?: unknown; total?: unknown; page?: unknown; pageSize?: unknown };
  return typeof v === "object" && v !== null && Array.isArray(obj.items);
}
const okEnvelope = <T,>(data: T): ApiEnvelope<T> => ({
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
export const accountApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    /** LIST */
    getAccounts: b.query<AccountListEnvelope, ListParams | undefined>({
      query: (params) => ({ url: `/Account${toQuery(params)}` }),
      transformResponse: (resp: AccountListRaw): AccountListEnvelope => {
        const payload = takeData<AccountDto[] | Paged<AccountDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
        }

        if (isPaged<AccountDto>(payload)) {
          const mapped: Paged<Account> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
        }

        return okEnvelope<Account[]>([]); // fallback
      },
      providesTags: (result) => {
        const list =
          Array.isArray(result?.data)
            ? result.data
            : (result?.data as Paged<Account> | undefined)?.items;

        return list
          ? [
              ...list.map((a) => ({ type: "Account" as const, id: a.id })),
              { type: "Account" as const, id: "LIST" },
            ]
          : [{ type: "Account" as const, id: "LIST" }];
      },
    }),

    /** DETAIL */
    getAccount: b.query<AccountEnvelope, number | string>({
      query: (id) => ({ url: `/Account/${id}` }),
      transformResponse: (resp: AccountRaw): AccountEnvelope => {
        const dto = takeData<AccountDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: (res) => (res?.data?.id ? [{ type: "Account", id: res.data.id }] : []),
    }),

    /** CREATE */
    createAccount: b.mutation<AccountEnvelope, CreateAccountDto>({
      query: (body) => ({ url: `/Account`, method: "POST", body }),
      transformResponse: (resp: AccountRaw): AccountEnvelope => {
        const dto = takeData<AccountDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "Account", id: "LIST" }],
    }),

    /** UPDATE */
    updateAccount: b.mutation<AccountEnvelope, { id: number | string; body: UpdateAccountDto }>({
      query: ({ id, body }) => ({ url: `/Account/${id}`, method: "PUT", body }),
      transformResponse: (resp: AccountRaw): AccountEnvelope => {
        const dto = takeData<AccountDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [{ type: "Account", id: res.data.id }, { type: "Account", id: "LIST" }]
          : [{ type: "Account", id: "LIST" }],
    }),

    /** DELETE */
    deleteAccount: b.mutation<ApiEnvelope<null>, number | string>({
      query: (id) => ({ url: `/Account/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "Account", id },
        { type: "Account", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAccountsQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountApi;
