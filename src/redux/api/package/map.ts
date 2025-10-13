import type { PackageDto, Package, PackageCreateDto } from "./type";

export const mapDtoToUi = (d: PackageDto): Package => ({
  id: d.packageId,
  name: d.name,
  description: d.description ?? null,
  price: d.price,
  durationDays: d.durationdays,
  isActive: d.isactive,
  createdAt: d.createat,
  updatedAt: d.updateat ?? null,
});

export const mapUiToDto = (p: Partial<Package> & { images?: File[] }): PackageCreateDto => ({
  name: p.name ?? "",
  description: p.description ?? undefined,
  price: p.price ?? 0,
  durationDays: p.durationDays ?? 0,
});