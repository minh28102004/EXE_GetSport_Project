// import React, { useState, useEffect, useRef } from "react";
// import { 
//   Search, 
//   MapPin, 
//   Filter, 
//   Clock, 
//   Star, 
//   Phone, 
//   Navigation,
//   Calendar,
//   Users,
//   Zap,
//   ChevronDown,
//   X,
//   Heart,
//   Share2,
//   Bookmark
// } from "lucide-react";
// import {courts} from"./data"
// import type { Court } from "./data";

// const MapSection = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCourt, setSelectedCourt] = useState(null);
//   const [viewMode, setViewMode] = useState("map");
//   const [userLocation, setUserLocation] = useState(null);
//   const mapRef = useRef(null);
// // types.ts


//   const filters = [
//     { id: "all", label: "Tất cả", count: courts.length },
//     { id: "available", label: "Còn trống", count: courts.filter(c => c.status === "available").length },
//     { id: "premium", label: "Cao cấp", count: courts.filter(c => c.rating >= 4.8).length },
//     { id: "nearby", label: "Gần nhất", count: courts.filter(c => parseFloat(c.distance) <= 1.5).length }
//   ];

//   const amenityIcons = {
//     parking: "🅿️",
//     shower: "🚿",
//     ac: "❄️",
//     drinks: "🥤",
//     shop: "🏪"
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "available":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "busy":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "available":
//         return "Còn trống";
//       case "busy":
//         return "Đã đầy";
//       default:
//         return "Không rõ";
//     }
//   };

//   const filteredCourts = courts.filter(court => {
//     const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          court.address.toLowerCase().includes(searchQuery.toLowerCase());
    
//     let matchesFilter = true;
//     switch (selectedFilter) {
//       case "available":
//         matchesFilter = court.status === "available";
//         break;
//       case "premium":
//         matchesFilter = court.rating >= 4.8;
//         break;
//       case "nearby":
//         matchesFilter = parseFloat(court.distance) <= 1.5;
//         break;
//     }
    
//     return matchesSearch && matchesFilter;
//   });

//   const handleCourtSelect = (court) => {
//     setSelectedCourt(court);
//   };

//   const handleBooking = (court) => {
//     // Implement booking logic
//     alert(`Đặt sân ${court.name} - ${court.price}đ/giờ`);
//   };

//   const getUserLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         }
//       );
//     }
//   };

//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   return (
//     <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
//             Bản Đồ Sân Cầu Lông
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             Tìm kiếm và đặt sân cầu lông dễ dàng với công nghệ bản đồ thông minh. 
//             Khám phá hàng trăm sân chất lượng cao trong thành phố.
//           </p>
//         </div>

//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
//           {/* Advanced Search & Filter Bar */}
//           <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
//             <div className="flex flex-col lg:flex-row gap-4">
//               {/* Search Input */}
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Tìm theo tên sân, địa chỉ, quận..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-700 bg-white shadow-sm"
//                   />
//                 </div>
//               </div>

//               {/* Filter Chips */}
//               <div className="flex flex-wrap gap-2">
//                 {filters.map((filter) => (
//                   <button
//                     key={filter.id}
//                     onClick={() => setSelectedFilter(filter.id)}
//                     className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
//                       selectedFilter === filter.id
//                         ? "bg-teal-600 text-white border-teal-600 shadow-md"
//                         : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-600"
//                     }`}
//                   >
//                     {filter.label} ({filter.count})
//                   </button>
//                 ))}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={getUserLocation}
//                   className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
//                 >
//                   <MapPin className="w-4 h-4" />
//                   Vị trí
//                 </button>
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
//                 >
//                   <Filter className="w-4 h-4" />
//                   <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
//                 </button>
//               </div>
//             </div>

//             {/* Advanced Filters */}
//             {showFilters && (
//               <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VNĐ/giờ)</label>
//                     <select className="w-full p-2 border border-gray-200 rounded-lg">
//                       <option>Tất cả</option>
//                       <option>Dưới 80,000</option>
//                       <option>80,000 - 120,000</option>
//                       <option>Trên 120,000</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
//                     <select className="w-full p-2 border border-gray-200 rounded-lg">
//                       <option>Tất cả</option>
//                       <option>4.5+ sao</option>
//                       <option>4.0+ sao</option>
//                       <option>3.5+ sao</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Tiện ích</label>
//                     <select className="w-full p-2 border border-gray-200 rounded-lg">
//                       <option>Tất cả</option>
//                       <option>Có điều hòa</option>
//                       <option>Có bãi đỗ xe</option>
//                       <option>Có phòng tắm</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng cách</label>
//                     <select className="w-full p-2 border border-gray-200 rounded-lg">
//                       <option>Tất cả</option>
//                       <option>Dưới 1km</option>
//                       <option>1-3km</option>
//                       <option>3-5km</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* View Toggle */}
//           <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <span className="text-sm font-medium text-gray-700">
//                   Tìm thấy {filteredCourts.length} sân
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <span className="text-xs text-gray-600">Còn trống</span>
//                   <div className="w-3 h-3 bg-red-500 rounded-full ml-3"></div>
//                   <span className="text-xs text-gray-600">Đã đầy</span>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setViewMode("map")}
//                   className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                     viewMode === "map" ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   Bản đồ
//                 </button>
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                     viewMode === "list" ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   Danh sách
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="relative">
//             {viewMode === "map" ? (
//               <div className="flex">
//                 {/* Map */}
//                 <div className="flex-1 h-[600px] relative">
//                   <iframe
//                     ref={mapRef}
//                     title="Bản đồ sân cầu lông"
//                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502219778061!2d106.700423!3d10.772215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzIwLjAiTiAxMDbCsDQyJzAxLjUiRQ!5e0!3m2!1svi!2s!4v1700000000000"
//                     width="100%"
//                     height="100%"
//                     style={{ border: 0 }}
//                     allowFullScreen
//                     loading="lazy"
//                     referrerPolicy="no-referrer-when-downgrade"
//                   />
//                 </div>

//                 {/* Court List Sidebar */}
//                 <div className="w-96 h-[600px] overflow-y-auto bg-white border-l border-gray-200">
//                   <div className="p-4 space-y-4">
//                     {filteredCourts.map((court) => (
//                       <div
//                         key={court.id}
//                         className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
//                           selectedCourt?.id === court.id
//                             ? "border-teal-500 shadow-lg bg-teal-50"
//                             : "border-gray-200 hover:border-gray-300"
//                         }`}
//                         onClick={() => handleCourtSelect(court)}
//                       >
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex-1">
//                             <h3 className="font-semibold text-gray-900 mb-1">{court.name}</h3>
//                             <p className="text-sm text-gray-600 mb-2">{court.address}</p>
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className="flex items-center gap-1">
//                                 <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                                 <span className="text-sm font-medium">{court.rating}</span>
//                                 <span className="text-xs text-gray-500">({court.reviews})</span>
//                               </div>
//                               <span className="text-xs text-gray-400">•</span>
//                               <span className="text-sm text-gray-600">{court.distance}</span>
//                             </div>
//                           </div>
//                           <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(court.status)}`}>
//                             {getStatusText(court.status)}
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between mb-3">
//                           <div className="text-lg font-bold text-teal-600">
//                             {court.price.toLocaleString()}đ/giờ
//                           </div>
//                           <div className="flex gap-1">
//                             {court.amenities.map((amenity) => (
//                               <span key={amenity} title={amenity} className="text-lg">
//                                 {amenityIcons[amenity]}
//                               </span>
//                             ))}
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between">
//                           <div className="flex gap-2">
//                             {court.availableSlots.slice(0, 3).map((slot) => (
//                               <span key={slot} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
//                                 {slot}
//                               </span>
//                             ))}
//                             {court.availableSlots.length > 3 && (
//                               <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
//                                 +{court.availableSlots.length - 3}
//                               </span>
//                             )}
//                           </div>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleBooking(court);
//                             }}
//                             className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
//                           >
//                             Đặt ngay
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               /* List View */
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredCourts.map((court) => (
//                     <div key={court.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
//                       <div className="relative">
//                         <img
//                           src={court.image}
//                           alt={court.name}
//                           className="w-full h-48 object-cover"
//                         />
//                         <div className="absolute top-3 left-3">
//                           <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(court.status)}`}>
//                             {getStatusText(court.status)}
//                           </div>
//                         </div>
//                         <div className="absolute top-3 right-3 flex gap-2">
//                           <button className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors">
//                             <Heart className="w-4 h-4 text-gray-600" />
//                           </button>
//                           <button className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors">
//                             <Share2 className="w-4 h-4 text-gray-600" />
//                           </button>
//                         </div>
//                       </div>

//                       <div className="p-5">
//                         <h3 className="font-bold text-lg text-gray-900 mb-2">{court.name}</h3>
//                         <p className="text-gray-600 text-sm mb-3 line-clamp-2">{court.address}</p>
                        
//                         <div className="flex items-center gap-3 mb-3">
//                           <div className="flex items-center gap-1">
//                             <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                             <span className="font-medium">{court.rating}</span>
//                             <span className="text-gray-500 text-sm">({court.reviews})</span>
//                           </div>
//                           <span className="text-gray-300">•</span>
//                           <span className="text-gray-600 text-sm">{court.distance}</span>
//                         </div>

//                         <div className="flex items-center gap-2 mb-4">
//                           {court.amenities.map((amenity) => (
//                             <span key={amenity} title={amenity} className="text-lg">
//                               {amenityIcons[amenity]}
//                             </span>
//                           ))}
//                         </div>

//                         <div className="flex items-center justify-between mb-4">
//                           <div className="text-xl font-bold text-teal-600">
//                             {court.price.toLocaleString()}đ<span className="text-sm text-gray-500">/giờ</span>
//                           </div>
//                           <div className="flex gap-1">
//                             {court.availableSlots.slice(0, 2).map((slot) => (
//                               <span key={slot} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
//                                 {slot}
//                               </span>
//                             ))}
//                             {court.availableSlots.length > 2 && (
//                               <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
//                                 +{court.availableSlots.length - 2}
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         <div className="flex gap-2">
//                           <button className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium">
//                             Đặt sân
//                           </button>
//                           <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:border-gray-300 transition-colors">
//                             <Phone className="w-4 h-4" />
//                           </button>
//                           <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:border-gray-300 transition-colors">
//                             <Navigation className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Selected Court Detail Modal */}
//         {selectedCourt && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="relative">
//                 <img
//                   src={selectedCourt.image}
//                   alt={selectedCourt.name}
//                   className="w-full h-64 object-cover rounded-t-3xl"
//                 />
//                 <button
//                   onClick={() => setSelectedCourt(null)}
//                   className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourt.name}</h2>
//                     <p className="text-gray-600 mb-3">{selectedCourt.address}</p>
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center gap-1">
//                         <Star className="w-5 h-5 text-yellow-400 fill-current" />
//                         <span className="font-semibold">{selectedCourt.rating}</span>
//                         <span className="text-gray-500">({selectedCourt.reviews} đánh giá)</span>
//                       </div>
//                       <span className="text-gray-300">•</span>
//                       <span className="text-gray-600">{selectedCourt.distance}</span>
//                     </div>
//                   </div>
//                   <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedCourt.status)}`}>
//                     {getStatusText(selectedCourt.status)}
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="text-3xl font-bold text-teal-600">
//                     {selectedCourt.price.toLocaleString()}đ<span className="text-lg text-gray-500">/giờ</span>
//                   </div>
//                   <div className="flex gap-2">
//                     {selectedCourt.amenities.map((amenity) => (
//                       <span key={amenity} title={amenity} className="text-2xl">
//                         {amenityIcons[amenity]}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <h3 className="font-semibold text-gray-900 mb-3">Khung giờ còn trống hôm nay</h3>
//                   <div className="grid grid-cols-4 gap-2">
//                     {selectedCourt.availableSlots.map((slot) => (
//                       <button
//                         key={slot}
//                         className="p-3 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors text-center"
//                       >
//                         <div className="font-medium">{slot}</div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => handleBooking(selectedCourt)}
//                     className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors font-semibold"
//                   >
//                     Đặt sân ngay
//                   </button>
//                   <button className="px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:border-gray-300 transition-colors">
//                     <Phone className="w-5 h-5" />
//                   </button>
//                   <button className="px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:border-gray-300 transition-colors">
//                     <Navigation className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default MapSection;