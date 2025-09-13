interface Court {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
  amenities: string[];
  availableSlots: string[];
  isNewlyOpened: boolean;
}

export const courts: Court[] = [
    {
      id: 1,
      name: "Sân Cầu Lông Thống Nhất",
      address: "30 Đường Trần Phú, Quận Ba Đình, Hà Nội",
      rating: 4.8,
      reviewCount: 124,
      price: 150000,
      image:
        "https://images.unsplash.com/photo-1544918801-4d96c2a2e0c7?w=600&h=400&fit=crop&auto=format",
      amenities: ["wifi", "parking", "shower", "equipment"],
      availableSlots: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
      ],
      isNewlyOpened: true,
    },
    {
      id: 2,
      name: "Sân Cầu Lông Olympia",
      address: "15 Đường Nguyễn Chí Thanh, Quận Đống Đa, Hà Nội",
      rating: 4.7,
      reviewCount: 98,
      price: 180000,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format",
      amenities: ["wifi", "parking", "shower", "equipment"],
      availableSlots: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
      ],
      isNewlyOpened: true,
    },
    {
      id: 3,
      name: "Sân Cầu Lông Hà Đông",
      address: "45 Đường Quang Trung, Quận Hà Đông, Hà Nội",
      rating: 4.5,
      reviewCount: 76,
      price: 120000,
      image:
        "https://images.unsplash.com/photo-1586996292898-71f4036c4e07?w=600&h=400&fit=crop&auto=format",
      amenities: ["wifi", "parking", "shower", "equipment"],
      availableSlots: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
      ],
      isNewlyOpened: false,
    },
    {
      id: 4,
      name: "Sân Cầu Lông Mỹ Đình",
      address: "10 Đường Lê Đức Thọ, Quận Nam Từ Liêm, Hà Nội",
      rating: 4.9,
      reviewCount: 152,
      price: 200000,
      image:
        "https://images.unsplash.com/photo-1571019612678-9c79c0d41b64?w=600&h=400&fit=crop&auto=format",
      amenities: ["wifi", "parking", "shower", "equipment"],
      availableSlots: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
      ],
      isNewlyOpened: false,
    },
    {
      id: 5,
      name: "Sân Cầu Lông Thanh Xuân",
      address: "25 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
      rating: 4.6,
      reviewCount: 89,
      price: 160000,
      image:
        "https://images.unsplash.com/photo-1544918801-4d96c2a2e0c7?w=600&h=400&fit=crop&auto=format",
      amenities: ["wifi", "parking", "shower", "equipment"],
      availableSlots: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
      ],
      isNewlyOpened: true,
    },
    {
      id: 6,
      name: "Sân Cầu Lông Long Biên",
      address: "50 Đường Nguyễn Văn Cừ, Quận Long Biên, Hà Nội",
      rating: 4.7,
      reviewCount: 112,
      price: 170000,
      image:
        "https://images.unsplash.com/photo-1586996292898-71f4036c4e07?w=600&h=400&fit=crop&auto=format",
      amenities: ["wifi", "parking", "shower", "equipment"],
      availableSlots: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
      ],
      isNewlyOpened: false,
    },
  ];