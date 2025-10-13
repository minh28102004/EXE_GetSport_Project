// @redux/api/court/map.ts
import type { CourtDto, Court, CreateCourtDto } from "./type";

/** BE → UI */
export const mapDtoToUi = (d: CourtDto): Court => ({
  id: d.courtId,
  ownerId: d.ownerId,
  ownerName: d.ownerName,
  location: d.location ?? null,
  imageUrls: d.imageurls ?? [],
  pricePerHour: d.priceperhour,
  status: d.status ?? null,
  isActive: d.isactive,
  priority: d.priority,
  startDate: d.startdate ?? null,
  endDate: d.enddate ?? null,
});

/** UI → BE (cho create/update) */
export const mapUiToDto = (c: Partial<Court> & { images?: File[] }): CreateCourtDto => ({
  location: c.location ?? "",
  pricePerHour: c.pricePerHour ?? 0,
  priority: c.priority,
  startDate: c.startDate ?? undefined,
  endDate: c.endDate ?? undefined,
  images: c.images,
});