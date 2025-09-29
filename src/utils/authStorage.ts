// src/utils/authStorage.ts
export type PersistedProfile = {
  fullname: string;
  email: string;
  role: string;
} | null;

const PROFILE_KEY = "auth_profile";
const TOKEN_KEY = "auth_access_token";

const ALLOW_PERSIST =
  (import.meta.env.VITE_ALLOW_PERSIST_ACCESS_TOKEN ?? "true") === "true";
const MAX_TTL_MIN = Number(import.meta.env.VITE_PERSIST_TOKEN_MAX_MIN ?? 1440); // 24h

export function decodeExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload?.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/* ---------- PROFILE ---------- */
export function readProfile(): { user: PersistedProfile; remember: boolean } {
  try {
    const raw =
      sessionStorage.getItem(PROFILE_KEY) ?? localStorage.getItem(PROFILE_KEY);
    if (!raw) return { user: null, remember: false };
    const parsed = JSON.parse(raw) as {
      user: PersistedProfile;
      remember?: boolean;
    };
    return { user: parsed.user ?? null, remember: !!parsed.remember };
  } catch {
    return { user: null, remember: false };
  }
}

export function writeProfile(user: PersistedProfile, remember: boolean) {
  const raw = JSON.stringify({ user, remember });
  try {
    if (remember) {
      localStorage.setItem(PROFILE_KEY, raw);
      sessionStorage.removeItem(PROFILE_KEY);
    } else {
      sessionStorage.setItem(PROFILE_KEY, raw);
      localStorage.removeItem(PROFILE_KEY);
    }
  } catch {}
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
  } catch {}
}

/* ---------- TOKEN ---------- */
export function persistToken(token: string, remember: boolean) {
  if (!ALLOW_PERSIST) return;
  try {
    const store = remember ? localStorage : sessionStorage;
    store.setItem(TOKEN_KEY, token);
    // xoá ở kho còn lại
    (remember ? sessionStorage : localStorage).removeItem(TOKEN_KEY);
  } catch {}
}

export function readToken(): string | null {
  if (!ALLOW_PERSIST) return null;
  try {
    const raw =
      sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;

    // Kiểm tra exp/TTL
    const exp = decodeExp(raw);
    if (exp) {
      const msLeft = exp * 1000 - Date.now();
      const minsLeft = msLeft / 60000;
      if (minsLeft <= 0 || minsLeft > MAX_TTL_MIN) {
        clearToken();
        return null;
      }
    }
    return raw;
  } catch {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}
