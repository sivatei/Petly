import { supabase } from "./supabase";

const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function api(path, opts = {}) {
  const { data } = await supabase.auth.getSession();
  const t = data.session?.access_token;
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(t && { Authorization: `Bearer ${t}` }),
      ...opts.headers
    },
    body: opts.body && JSON.stringify(opts.body)
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed");
  return res.status === 204 ? null : res.json();
}

