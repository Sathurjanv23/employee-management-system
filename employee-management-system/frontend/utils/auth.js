const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const DISPLAY_NAME_KEY = "displayName";
const PROFILE_PHOTO_KEY = "profilePhoto";

function isBrowser() {
  return typeof window !== "undefined";
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getToken() {
  if (!isBrowser()) return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getUserRole() {
  if (!isBrowser()) return "";

  const storedRole = localStorage.getItem(ROLE_KEY);
  if (storedRole) return storedRole;

  const payload = decodeJwtPayload(getToken());
  return payload?.role || "";
}

export function getUserEmail() {
  if (!isBrowser()) return "";

  const payload = decodeJwtPayload(getToken());
  return payload?.sub || "";
}

export function setSession({ token, role, name, profilePhoto } = {}) {
  if (!isBrowser()) return;

  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (role) localStorage.setItem(ROLE_KEY, role);
  if (name) localStorage.setItem(DISPLAY_NAME_KEY, name);
  if (profilePhoto) localStorage.setItem(PROFILE_PHOTO_KEY, profilePhoto);
}

export function clearSession() {
  if (!isBrowser()) return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(DISPLAY_NAME_KEY);
  localStorage.removeItem(PROFILE_PHOTO_KEY);
}
