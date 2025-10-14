import { baseApi } from '@redux/api/baseApi';
import type {
  Blog,
  BlogDto,
  BlogEnvelope,
  BlogListEnvelope,
  CreateBlogDto,
  UpdateBlogDto,
  ListParams,
  Paged,
} from './type';
import { mapDtoToUi } from './map';
import type { ApiEnvelope } from '@redux/api/auth/type';

const BLOG_PATH = 'Blog';

type BlogListRaw = BlogDto[] | Paged<BlogDto> | ApiEnvelope<BlogDto[] | Paged<BlogDto>>;
type BlogRaw = BlogDto | ApiEnvelope<BlogDto>;

function isEnvelope<T>(v: unknown): v is ApiEnvelope<T> {
  return (
    typeof v === 'object' &&
    v !== null &&
    'data' in (v as Record<string, unknown>) &&
    'statusCode' in (v as Record<string, unknown>)
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
  return typeof v === 'object' && v !== null && Array.isArray(obj.items);
}

const okEnvelope = <T>(data: T): ApiEnvelope<T> => ({
  statusCode: 200,
  status: 'OK',
  message: '',
  errors: null,
  data,
});

const toQuery = (params?: Record<string, unknown>) => {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
};

export const blogApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getBlogs: b.query<BlogListEnvelope, ListParams | undefined>({
      query: (params) => ({ url: `${BLOG_PATH}${toQuery(params)}` }),
      transformResponse: (resp: BlogListRaw): BlogListEnvelope => {
        const payload = takeData<BlogDto[] | Paged<BlogDto>>(resp);

        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
        }

        if (isPaged<BlogDto>(payload)) {
          const mapped: Paged<Blog> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
        }

        return okEnvelope<Blog[]>([]);
      },
      providesTags: (result) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : (result?.data as Paged<Blog> | undefined)?.items;

        return list
          ? [
              ...list.map((b) => ({ type: 'Blog' as const, id: b.id })),
              { type: 'Blog' as const, id: 'LIST' },
            ]
          : [{ type: 'Blog' as const, id: 'LIST' }];
      },
    }),

    getBlog: b.query<BlogEnvelope, number | string>({
      query: (id) => ({ url: `${BLOG_PATH}/${id}` }),
      transformResponse: (resp: BlogRaw): BlogEnvelope => {
        const dto = takeData<BlogDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      providesTags: (res) => (res?.data?.id ? [{ type: 'Blog', id: res.data.id }] : []),
    }),

    getMyBlogs: b.query<BlogListEnvelope, ListParams | undefined>({
      query: (params) => ({ url: `${BLOG_PATH}/my${toQuery(params)}` }),
      transformResponse: (resp: BlogListRaw): BlogListEnvelope => {
        const payload = takeData<BlogDto[] | Paged<BlogDto>>(resp);
        if (Array.isArray(payload)) {
          const mapped = payload.map(mapDtoToUi);
          return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
        }
        if (isPaged<BlogDto>(payload)) {
          const mapped: Paged<Blog> = {
            ...payload,
            items: payload.items.map(mapDtoToUi),
          };
          return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
        }
        return okEnvelope<Blog[]>([]);
      },
      providesTags: [{ type: 'Blog', id: 'MY_LIST' }],
    }),

    createBlog: b.mutation<BlogEnvelope, CreateBlogDto>({
      query: (body) => {
        const formData = new FormData();
        if (body.Title) formData.append('Title', body.Title);
        if (body.Shortdesc) formData.append('Shortdesc', body.Shortdesc);
        if (body.Content) formData.append('Content', body.Content);
        if (body.Status) formData.append('Status', body.Status);
        if (body.Image) formData.append('Image', body.Image);
        return { url: `${BLOG_PATH}/create-with-status`, method: 'POST', body: formData };
      },
      transformResponse: (resp: BlogRaw): BlogEnvelope => {
        const dto = takeData<BlogDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    updateBlog: b.mutation<BlogEnvelope, { id: number | string; body: UpdateBlogDto }>({
      query: ({ id, body }) => {
        const formData = new FormData();
        if (body.Title !== undefined) formData.append('Title', body.Title || '');
        if (body.Shortdesc !== undefined) formData.append('Shortdesc', body.Shortdesc || '');
        if (body.Content !== undefined) formData.append('Content', body.Content || '');
        if (body.Status !== undefined) formData.append('Status', body.Status);
        if (body.Image) formData.append('Image', body.Image);
        return { url: `${BLOG_PATH}/${id}`, method: 'PUT', body: formData };
      },
      transformResponse: (resp: BlogRaw): BlogEnvelope => {
        const dto = takeData<BlogDto>(resp);
        const mapped = mapDtoToUi(dto);
        return isEnvelope(resp) ? { ...resp, data: mapped } : okEnvelope(mapped);
      },
      invalidatesTags: (res) =>
        res?.data?.id
          ? [{ type: 'Blog', id: res.data.id }, { type: 'Blog', id: 'LIST' }]
          : [{ type: 'Blog', id: 'LIST' }],
    }),

    deleteBlog: b.mutation<ApiEnvelope<null>, number | string>({
      query: (id) => ({ url: `${BLOG_PATH}/${id}`, method: 'DELETE' }),
      invalidatesTags: (res, _err, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useGetMyBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;