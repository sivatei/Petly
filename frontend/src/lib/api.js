import { supabase } from "./supabase";

function getBaseUrl() {
  const envUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
  if (!envUrl) return "/api";
  // If the user provided a full backend URL without /api, append /api
  return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
}

const API_BASE = getBaseUrl();

export async function api(path, opts = {}, retryCount = 0) {
  const { data } = await supabase.auth.getSession();
  const t = data.session?.access_token;
  
  // Normalize path so it doesn't duplicate /api if already in API_BASE
  let cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (API_BASE.endsWith("/api") && cleanPath.startsWith("/api/")) {
    cleanPath = cleanPath.slice(4);
  }
  
  const url = cleanPath.startsWith("http") ? cleanPath : `${API_BASE}${cleanPath}`;

  try {
    const res = await fetch(url, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(t && { Authorization: `Bearer ${t}` }),
        ...opts.headers
      },
      body: opts.body && JSON.stringify(opts.body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed (${res.status})`);
    }

    return res.status === 204 ? null : res.json();
  } catch (err) {
    // If it's a network error / cold start and a GET request, retry once after 2 seconds
    const method = (opts.method || "GET").toUpperCase();
    if (err.name === "TypeError" && method === "GET" && retryCount < 1) {
      await new Promise(r => setTimeout(r, 2000));
      return api(path, opts, retryCount + 1);
    }

    if (err.name === "TypeError" && err.message === "Failed to fetch") {
      throw new Error(
        "Cannot reach backend server. If you are on Render free tier, the backend is likely waking up (~45s). Please refresh in a moment."
      );
    }
    throw err;
  }
}

