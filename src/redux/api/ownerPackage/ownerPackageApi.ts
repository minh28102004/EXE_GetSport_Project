// src/redux/api/ownerPackage/ownerPackageApi.ts
import { baseApi } from "@redux/api/baseApi";
import type {
  OwnerPackage,
  OwnerPackageDto,
  OwnerPackageEnvelope,
  OwnerPackageListEnvelope,
  OwnerPackageCreateDto,
  OwnerPackageUpdateDto,
  OwnerPackageFilterParams,
  OwnerPackagePaymentStatus,
  Paged,
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/api/auth/type";

const OWNER_PACKAGE_PATH = "OwnerPackage";

type OwnerPackageListRaw =
  | OwnerPackageDto[]
  | Paged<OwnerPackageDto>
  | ApiEnvelope<OwnerPackageDto[] | Paged<OwnerPackageDto>>;

type OwnerPackageRaw = OwnerPackageDto | ApiEnvelope<OwnerPackageDto>;

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

export const ownerPackageApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // Get all owner packages (Admin/Staff only)
    getOwnerPackages: b.query<OwnerPackageListEnvelope, OwnerPackageFilterParams | undefined>({
      query: (params) => ({ url: `${OWNER_PACKAGE_PATH}${toQuery(params)}` }),
      transformResponse: (resp: OwnerPackageListRaw): OwnerPackageListEnvelope => {
        const payload = takeData<OwnerPackageDto[] | Paged<OwnerPackageDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<OwnerPackageDto>(payload)) {
          const mapped: Paged<OwnerPackage> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<OwnerPackage[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<OwnerPackage> | undefined)?.items;

        return list
          ? [
              ...list.map((op) => ({ type: "OwnerPackage" as const, id: op.id })),
              { type: "OwnerPackage" as const, id: "LIST" },
            ]
          : [{ type: "OwnerPackage" as const, id: "LIST" }];
      },
    }),

    // Get specific owner package by ID
    getOwnerPackage: b.query<OwnerPackageEnvelope, number>({
      query: (id) => ({ url: `${OWNER_PACKAGE_PATH}/${id}` }),
      transformResponse: (resp: OwnerPackageRaw): OwnerPackageEnvelope => {
        const dto = takeData<OwnerPackageDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      providesTags: (res) =>
        res?.data?.id ? [{ type: "OwnerPackage", id: res.data.id }] : [],
    }),

    // Get user's own owner packages
    getMyOwnerPackages: b.query<OwnerPackageListEnvelope, OwnerPackageFilterParams | undefined>({
      query: (params) => ({ url: `${OWNER_PACKAGE_PATH}/my${toQuery(params)}` }),
      transformResponse: (resp: OwnerPackageListRaw): OwnerPackageListEnvelope => {
        const payload = takeData<OwnerPackageDto[] | Paged<OwnerPackageDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<OwnerPackageDto>(payload)) {
          const mapped: Paged<OwnerPackage> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<OwnerPackage[]>([]);
      },
      providesTags: [{ type: "OwnerPackage", id: "MY_LIST" }],
    }),

    // Create owner package (Admin/Staff only or booking)
    createOwnerPackage: b.mutation<OwnerPackageEnvelope, OwnerPackageCreateDto>({
      query: (body) => ({
        url: `${OWNER_PACKAGE_PATH}`,
        method: "POST",
        body,
      }),
      transformResponse: (resp: OwnerPackageRaw): OwnerPackageEnvelope => {
        const dto = takeData<OwnerPackageDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "OwnerPackage", id: "LIST" }, { type: "OwnerPackage", id: "MY_LIST" }],
    }),

    // Create owner package booking (Staff only)
    createOwnerPackageBooking: b.mutation<OwnerPackageEnvelope, OwnerPackageCreateDto>({
      query: (body) => ({
        url: `${OWNER_PACKAGE_PATH}/booking`,
        method: "POST",
        body,
      }),
      transformResponse: (resp: OwnerPackageRaw): OwnerPackageEnvelope => {
        const dto = takeData<OwnerPackageDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "OwnerPackage", id: "LIST" }, { type: "OwnerPackage", id: "MY_LIST" }],
    }),

    // Update owner package (Admin/Staff only)
    updateOwnerPackage: b.mutation<
      OwnerPackageEnvelope,
      { id: number; body: OwnerPackageUpdateDto }
    >({
      query: ({ id, body }) => ({
        url: `${OWNER_PACKAGE_PATH}/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (resp: OwnerPackageRaw): OwnerPackageEnvelope => {
        const dto = takeData<OwnerPackageDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [
              { type: "OwnerPackage", id: res.data.id },
              { type: "OwnerPackage", id: "LIST" },
              { type: "OwnerPackage", id: "MY_LIST" },
            ]
          : [{ type: "OwnerPackage", id: "LIST" }],
    }),

    // Delete owner package (Admin only)
    deleteOwnerPackage: b.mutation<ApiEnvelope<null>, number>({
      query: (id) => ({ url: `${OWNER_PACKAGE_PATH}/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "OwnerPackage", id },
        { type: "OwnerPackage", id: "LIST" },
        { type: "OwnerPackage", id: "MY_LIST" },
      ],
    }),

  getOwnerPackagePaymentStatus: b.query<
  OwnerPackagePaymentStatus,
  { id: number; status?: string }
>({
  query: ({ id, status = "check" }) => ({
    url: `${OWNER_PACKAGE_PATH}/${id}/payment-status11111?status=${status}`,
    params: { status },
  }),
  transformResponse: (resp: any, _meta, { id }) => ({
    ownerPackageId: resp.data?.ownerpackageId || id,
    status: resp.data?.status || "Pending",
    paymentStatus: resp.data?.paymentStatus || "PENDING",
    amountPaid: resp.data?.amountPaid,
    amountRemaining: resp.data?.amountRemaining,
  }),
}),



  }),
  overrideExisting: false,
});

export const {
  useGetOwnerPackagesQuery,
  useGetOwnerPackageQuery,
  useGetMyOwnerPackagesQuery,
  useCreateOwnerPackageMutation,
  useCreateOwnerPackageBookingMutation,
  useUpdateOwnerPackageMutation,
  useDeleteOwnerPackageMutation,
  useGetOwnerPackagePaymentStatusQuery,
} = ownerPackageApi;