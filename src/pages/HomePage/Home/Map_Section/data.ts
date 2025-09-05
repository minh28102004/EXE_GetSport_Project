// Types
type CourtStatus = "Trống" | "Đầy";

export interface Court {
  id: number;
  name: string;
  distance: string;
  status: CourtStatus;
}

// Mock data
export const popularCourts: Court[] = [
  { id: 1, name: "Sân Cầu Lông VIP", distance: "0.8km", status: "Trống" },
  { id: 2, name: "Arena Sports Center", distance: "1.2km", status: "Đầy" },
  { id: 3, name: "Golden Court", distance: "1.5km", status: "Trống" },
];