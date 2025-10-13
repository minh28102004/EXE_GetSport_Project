import type { PlaymateJoinDto, PlaymateJoin, PlaymateJoinCreateDto } from "./type";

export const mapDtoToUi = (d: PlaymateJoinDto): PlaymateJoin => ({
  id: d.joinId,
  postId: d.postId,
  courtbookingId: d.courtbookingId,
  courtId: d.courtId,
  courtName: d.courtName ?? "",
  courtLocation: d.courtLocation ?? "",
  courtImageUrls: d.courtImageUrls ?? [],
  bookingdate: d.bookingdate,
  slotStarttime: d.slotStarttime,
  slotEndtime: d.slotEndtime,
  postTitle: d.postTitle ?? "",
  postSkilllevel: d.postSkilllevel ?? "",
  postStatus: d.postStatus ?? "",
  neededplayers: d.neededplayers,
  currentPlayers: d.currentPlayers,
  userId: d.userId,
  userName: d.userName ?? "",
  joinedat: d.joinedat,
});

export const mapUiToCreateDto = (s: Partial<PlaymateJoin>): PlaymateJoinCreateDto => ({
  postId: s.postId ?? 0,
});