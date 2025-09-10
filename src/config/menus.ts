export type Role = "admin" | "owner" | "staff";

export interface MenuItem {
  label: string;
  to: string;
}

export const menus: Record<Role, MenuItem[]> = {
  admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Booking Management", to: "/admin/booking" },
    { label: "Court Management", to: "/admin/courts" },
    { label: "Reports", to: "/admin/reports" },
    { label: "User Management", to: "/admin/users" },
  ],
  owner: [
    { label: "Dashboard", to: "/owner/dashboard" },
    { label: "Booking Management", to: "/owner/booking" },
    { label: "Court Management", to: "/owner/courts" },
  ],
  staff: [
    { label: "Dashboard", to: "/staff/dashboard" },
  ],
};
