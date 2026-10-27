import { admin } from "../supabase.js";
export async function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Login required" });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: "Invalid session" });
  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", data.user.id);
  const { data: prof } = await admin.from("profiles").select("suspended").eq("id", data.user.id).single();
  if (prof?.suspended) return res.status(403).json({ error: "Account suspended" });
  req.user = { id: data.user.id, roles: (roles || []).map(r => r.role) };
  next();
}
export const requireRole = (...allowed) => (req, res, next) =>
  req.user.roles.some(r => allowed.includes(r)) ? next() : res.status(403).json({ error: "Forbidden" });
