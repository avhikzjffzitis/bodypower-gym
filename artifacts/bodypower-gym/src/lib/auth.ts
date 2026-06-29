import { setAuthTokenGetter } from "@workspace/api-client-react/custom-fetch";

const ADMIN_EMAIL = "adminA2@bodygym.com";
const ADMIN_PASSWORD = "avhik@123";

export function checkAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function getAuthToken(): string | null {
  return localStorage.getItem("bodypower_token");
}

export function setAuthToken(token: string) {
  localStorage.setItem("bodypower_token", token);
}

export function clearAuthToken() {
  localStorage.removeItem("bodypower_token");
}

export function getUser(): any | null {
  const user = localStorage.getItem("bodypower_user");
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  return null;
}

export function setUser(user: any) {
  localStorage.setItem("bodypower_user", JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem("bodypower_user");
}

export function setAdminSession() {
  localStorage.setItem("bodypower_admin_session", "true");
}

export function getAdminSession(): boolean {
  return localStorage.getItem("bodypower_admin_session") === "true";
}

export function clearAdminSession() {
  localStorage.removeItem("bodypower_admin_session");
}

export function getContactMessages(): any[] {
  try {
    return JSON.parse(localStorage.getItem("bodypower_contact_messages") || "[]");
  } catch {
    return [];
  }
}

export function saveContactMessage(msg: { name: string; email: string; subject: string; message: string }) {
  const messages = getContactMessages();
  messages.unshift({ ...msg, id: Date.now(), createdAt: new Date().toISOString(), read: false });
  localStorage.setItem("bodypower_contact_messages", JSON.stringify(messages));
}

export function getWebsiteSettings(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem("bodypower_settings") || "{}");
  } catch {
    return {};
  }
}

export function saveWebsiteSettings(settings: Record<string, string>) {
  localStorage.setItem("bodypower_settings", JSON.stringify(settings));
}

setAuthTokenGetter(getAuthToken);
