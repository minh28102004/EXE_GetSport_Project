import type { CourtDto, Court, CreateCourtDto } from "./type";

/** BE → UI */
export const mapDtoToUi = (d: CourtDto): Court => ({
  id: d.courtId,
  ownerId: d.ownerId,
  ownerName: d.ownerName,
  name: d.name ?? null,
  location: d.location ?? null,
  utilities: d.utilities ?? [],
  imageUrls: d.imageurls ?? [],
  pricePerHour: d.priceperhour,
  status: d.status ?? null,
  isActive: d.isactive,
  priority: d.priority,
  startDate: d.startdate ?? null,
  endDate: d.enddate ?? null,
  totalFeedbacks: d.totalFeedbacks ?? 0,
  averageRating: d.averageRating ?? 0,
});

/** UI → BE (cho create/update) */
export const mapUiToDto = (c: Partial<Court> & { images?: File[] }): CreateCourtDto => ({
  name: c.name ?? "",
  location: c.location ?? "",
  utilities: c.utilities ?? [],
  pricePerHour: c.pricePerHour ?? 0,
  priority: c.priority,
  startDate: c.startDate ?? undefined,
  endDate: c.endDate ?? undefined,
  images: c.images,
  status: c.status ?? undefined,
});