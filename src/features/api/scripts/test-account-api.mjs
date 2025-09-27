// scripts/test-account-api.mjs
const BASE_URL = process.env.API_BASE_URL || "https://api.getsport.3docorp.vn/api"; // đổi cho đúng

const headers = {
  "Accept": "application/json",
  // "Authorization": "Bearer <YOUR_JWT>", // bật nếu cần
};

try {
  const res = await fetch(`${BASE_URL}/Account`, { headers });
  console.log("Status:", res.status, res.statusText);
  const json = await res.json().catch(() => ({}));
  console.log("Raw response:", json);

  // Nếu server trả { data: Account[] } thì lấy json.data, còn không thì dùng json luôn
  const rows = Array.isArray(json?.data) ? json.data : json;
  console.log("\nAs table:");
  console.table(Array.isArray(rows) ? rows : [rows]);
} catch (e) {
  console.error("Request failed:", e);
}
