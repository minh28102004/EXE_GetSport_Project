export interface Court {
  id: number;
  name: string;
  address: string;
  distance: string;
  status: "available" | "busy"; // chỉ cho phép 2 trạng thái
  price: string;
  rating: number;
  reviews: number;
  amenities: ("parking" | "shower" | "ac" | "drinks" | "shop")[]; // giới hạn trong số này
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  availableSlots: string[];
  image: string;
}

// Mock data for courts
export const courts: Court[] = [
  {
    id: 1,
    name: "VIP Badminton Center",
      address: "123 Nguyễn Văn Cừ, Quận 1, TP.HCM",
      distance: "0.8km",
      status: "available",
      price: "80,000",
      rating: 4.8,
      reviews: 128,
      amenities: ["parking", "shower", "ac", "drinks"],
      phone: "0901234567",
      coordinates: { lat: 10.7722, lng: 106.7003 },
      availableSlots: ["14:00", "16:00", "18:00", "20:00"],
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Arena Sports Complex",
      address: "456 Lê Lai, Quận 1, TP.HCM",
      distance: "1.2km",
      status: "busy",
      price: "120,000",
      rating: 4.9,
      reviews: 256,
      amenities: ["parking", "shower", "ac", "drinks", "shop"],
      phone: "0902345678",
      coordinates: { lat: 10.7700, lng: 106.7020 },
      availableSlots: ["22:00"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Golden Court Premium",
      address: "789 Pasteur, Quận 3, TP.HCM",
      distance: "1.5km",
      status: "available",
      price: "100,000",
      rating: 4.7,
      reviews: 89,
      amenities: ["parking", "ac", "drinks"],
      phone: "0903456789",
      coordinates: { lat: 10.7750, lng: 106.6980 },
      availableSlots: ["15:00", "17:00", "19:00"],
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Sky Badminton Club",
      address: "321 Điện Biên Phủ, Quận 3, TP.HCM",
      distance: "2.1km",
      status: "available",
      price: "90,000",
      rating: 4.6,
      reviews: 45,
      amenities: ["shower", "ac", "drinks"],
      phone: "0904567890",
      coordinates: { lat: 10.7780, lng: 106.6950 },
      availableSlots: ["16:00", "18:00", "20:00", "21:00"],
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop"
    }
  ];