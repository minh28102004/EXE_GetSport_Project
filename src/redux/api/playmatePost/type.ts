import type { ApiEnvelope } from "@redux/api/auth/type";

export type PlaymatePostDto = {
  postId: number;
  userId: number;
  userName: string;
  courtbookingId: number;
  courtId: number;
  courtName: string;
  courtLocation: string;
  courtImageUrls: string[];
  bookingdate: string;
  slotStarttime: string;
  slotEndtime: string;
  title: string;
  content: string;
  neededplayers: number;
  currentPlayers: number;
  skilllevel: string;
  status: string;
  createdat: string;
};

export type PlaymatePost = {
  id: number;
  userId: number;
  userName: string;
  courtbookingId: number;
  courtId: number;
  courtName: string;
  courtLocation: string;
  courtImageUrls: string[];
  bookingdate: string;
  slotStarttime: string;
  slotEndtime: string;
  title: string;
  content: string;
  neededplayers: number;
  currentPlayers: number;
  skilllevel: string;
  status: string;
  createdat: string;
};

export type PlaymatePostCreateDto = {
  courtbookingId: number;
  title: string;
  content: string;
  neededplayers: number;
  skilllevel: string;
  status: string;
};

export type PlaymatePostUpdateDto = {
  title?: string;
  content?: string;
  neededplayers?: number;
  skilllevel?: string;
  status?: string;
};

export type PlaymatePostFilterParams = {
  courtbookingId?: number;
  userId?: number;
  status?: string;
  skilllevel?: string;
  minNeededPlayers?: number;
  maxNeededPlayers?: number;
  startCreateDate?: string;
  endCreateDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
};

export type PlaymatePostEnvelope = ApiEnvelope<PlaymatePost>;
export type PlaymatePostListEnvelope = ApiEnvelope<PlaymatePost[] | Paged<PlaymatePost>>;