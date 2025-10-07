import type { LucideIcon } from "lucide-react";


export type TabId = "profile" | "history" | "posts" | "reviews";


export interface NavItem {
id: TabId;
label: string;
icon: LucideIcon;
}


export interface Achievement {
id: number;
name: string;
icon: LucideIcon;
unlocked: boolean;
}