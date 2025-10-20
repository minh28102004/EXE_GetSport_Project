import { baseApi } from "@redux/api/baseApi";
import type {
  Package,
  PackageDto,
  PackageEnvelope,
  PackageListEnvelope,
  PackageCreateDto,
  PackageUpdateDto,
  PackageFilterParams,
  Paged,
} from "./type";
import { mapDtoToUi } from "./map";
import type { ApiEnvelope } from "@redux/api/auth/type";

const PACKAGE_PATH = "Package";

type PackageListRaw =
  | PackageDto[]
  | Paged<PackageDto>
  | ApiEnvelope<PackageDto[] | Paged<PackageDto>>;

type PackageRaw = PackageDto | ApiEnvelope<PackageDto>;

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

export const packageApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getPackages: b.query<PackageListEnvelope, PackageFilterParams | undefined>({
      query: (params) => ({ url: `${PACKAGE_PATH}${toQuery(params)}` }),
      transformResponse: (resp: PackageListRaw): PackageListEnvelope => {
        const payload = takeData<PackageDto[] | Paged<PackageDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        if (isPaged<PackageDto>(payload)) {
          const mapped: Paged<Package> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp)
            ? { ...resp, data: mapped }
            : okEnvelope(mapped);
        }

        return okEnvelope<Package[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<Package> | undefined)?.items;

        return list
          ? [
              ...list.map((p) => ({ type: "Package" as const, id: p.id })),
              { type: "Package" as const, id: "LIST" },
            ]
          : [{ type: "Package" as const, id: "LIST" }];
      },
    }),
getOwnerPackagePaymentStatus: b.query<any, { id: number; status?: string }>({
  query: ({ id, status = "check" }) => ({
    url: `/OwnerPackage/${id}/payment-status`,
    params: { status },
  }),
}),


    getPackage: b.query<PackageEnvelope, number>({
      query: (id) => ({ url: `${PACKAGE_PATH}/${id}` }),
      transformResponse: (resp: PackageRaw): PackageEnvelope => {
        const dto = takeData<PackageDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      providesTags: (res) =>
        res?.data?.id ? [{ type: "Package", id: res.data.id }] : [],
    }),

    createPackage: b.mutation<PackageEnvelope, PackageCreateDto>({
      query: (body) => ({
        url: `${PACKAGE_PATH}`,
        method: "POST",
        body,
      }),
      transformResponse: (resp: PackageRaw): PackageEnvelope => {
        const dto = takeData<PackageDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: "Package", id: "LIST" }],
    }),

    updatePackage: b.mutation<
      PackageEnvelope,
      { id: number; body: PackageUpdateDto }
    >({
      query: ({ id, body }) => ({
        url: `${PACKAGE_PATH}/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (resp: PackageRaw): PackageEnvelope => {
        const dto = takeData<PackageDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp)
          ? { ...resp, data: mapped }
          : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [
              { type: "Package", id: res.data.id },
              { type: "Package", id: "LIST" },
            ]
          : [{ type: "Package", id: "LIST" }],
    }),

    deletePackage: b.mutation<ApiEnvelope<null>, number>({
      query: (id) => ({ url: `${PACKAGE_PATH}/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _err, id) => [
        { type: "Package", id },
        { type: "Package", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPackagesQuery,
  useGetPackageQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useGetOwnerPackagePaymentStatusQuery
} = packageApi;