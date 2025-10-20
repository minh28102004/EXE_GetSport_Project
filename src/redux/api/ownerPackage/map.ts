import type { OwnerPackageDto, OwnerPackage, OwnerPackageCreateDto, OwnerPackageUpdateDto } from "./type";

export const mapDtoToUi = (d: OwnerPackageDto): OwnerPackage => ({
  id: d.ownerpackageId,
  ownerId: d.ownerId,
  ownerName: d.ownerName ?? "",
  name: d.packagename,
  duration: d.duration,
  startDate: d.startdate,
  endDate: d.enddate,
  price: d.price,
  status: d.status,
  createdAt: d.createat,
  priority: d.priority,
});

export const mapUiToCreateDto = (p: Partial<OwnerPackage>): OwnerPackageCreateDto => ({
  ownerId: p.ownerId ?? 0,
  packagename: p.name ?? "",
  duration: p.duration ?? 0,
  startdate: p.startDate ?? "",
  enddate: p.endDate ?? "",
  price: p.price ?? 0,
  priority: p.priority ?? 0,
});

export const mapUiToUpdateDto = (p: Partial<OwnerPackage>): OwnerPackageUpdateDto => ({
  packagename: p.name,
  duration: p.duration,
  startdate: p.startDate,
  enddate: p.endDate,
  price: p.price,
  status: p.status,
  priority: p.priority,
});