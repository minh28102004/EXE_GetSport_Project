import type { ApiEnvelope } from '@redux/api/auth/type';

/** BE DTO */
export type BlogDto = {
  blogId: number;
  accountId: number;
  authorName: string;
  title: string;
  shortdesc?: string | null;
  content: string;
  imageurl?: string | null;
  status?: string | null;
  createdat: string;
  updatedat?: string | null;
};

/** UI type (camelCase, id) */
export type Blog = {
  id: number;
  accountId: number;
  authorName: string;
  title: string;
  shortdesc?: string | null;
  content: string;
  imageUrl?: string | null;
  status?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

/** Create DTO */
export type CreateBlogDto = {
  Title: string;
  Shortdesc: string;
  Content: string;
  Status?: string;
  Image?: File;
};

/** Update DTO */
export type UpdateBlogDto = Partial<CreateBlogDto>;

/** List params */
export type ListParams = {
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
};

/** Paged */
export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
};

/** Envelopes */
export type BlogEnvelope = ApiEnvelope<Blog>;
export type BlogListEnvelope = ApiEnvelope<Blog[] | Paged<Blog>>;