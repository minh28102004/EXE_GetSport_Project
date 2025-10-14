import type { PlaymatePostDto, PlaymatePost, PlaymatePostCreateDto, PlaymatePostUpdateDto } from "./type";

export const mapDtoToUi = (d: PlaymatePostDto): PlaymatePost => ({
  id: d.postId,
  userId: d.userId,
  userName: d.userName ?? "",
  courtbookingId: d.courtbookingId,
  courtId: d.courtId,
  courtName: d.courtName ?? "",
  courtLocation: d.courtLocation ?? "",
  courtImageUrls: d.courtImageUrls ?? [],
  bookingdate: d.bookingdate,
  slotStarttime: d.slotStarttime,
  slotEndtime: d.slotEndtime,
  title: d.title,
  content: d.content,
  neededplayers: d.neededplayers,
  currentPlayers: d.currentPlayers ?? 0,
  skilllevel: d.skilllevel,
  status: d.status,
  createdat: d.createdat,
});

export const mapUiToCreateDto = (s: Partial<PlaymatePost>): PlaymatePostCreateDto => ({
  courtbookingId: s.courtbookingId ?? 0,
  title: s.title ?? "",
  content: s.content ?? "",
  neededplayers: s.neededplayers ?? 0,
  skilllevel: s.skilllevel ?? "",
  status: s.status ?? "Open",
});

export const mapUiToUpdateDto = (s: Partial<PlaymatePost>): PlaymatePostUpdateDto => ({
  title: s.title,
  content: s.content,
  neededplayers: s.neededplayers,
  skilllevel: s.skilllevel,
  status: s.status,
});