import type { ApiEnvelope } from "@redux/api/auth/type";

export type PlaymateJoinDto = {
  joinId: number;
  postId: number;
  courtbookingId: number;
  courtId: number;
  courtName: string;
  courtLocation: string;
  courtImageUrls: string[];
  bookingdate: string;
  slotStarttime: string;
  slotEndtime: string;
  postTitle: string;
  postSkilllevel: string;
  postStatus: string;
  neededplayers: number;
  currentPlayers: number;
  userId: number;
  userName: string;
  joinedat: string;
};

export type PlaymateJoin = {
  id: number;
  postId: number;
  courtbookingId: number;
  courtId: number;
  courtName: string;
  courtLocation: string;
  courtImageUrls: string[];
  bookingdate: string;
  slotStarttime: string;
  slotEndtime: string;
  postTitle: string;
  postSkilllevel: string;
  postStatus: string;
  neededplayers: number;
  currentPlayers: number;
  userId: number;
  userName: string;
  joinedat: string;
};

export type PlaymateJoinCreateDto = {
  postId: number;
};

export type PlaymateJoinFilterParams = {
  postId?: number;
  userId?: number;
  startJoinedDate?: string;
  endJoinedDate?: string;
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

export type PlaymateJoinEnvelope = ApiEnvelope<PlaymateJoin>;
export type PlaymateJoinListEnvelope = ApiEnvelope<PlaymateJoin[] | Paged<PlaymateJoin>>;