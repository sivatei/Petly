import { Router } from "express"; import { admin } from "../supabase.js"; import { requireAuth, requireRole } from "../middleware/auth.js";
const r = Router();
r.get("/", async (req, res) => {
  const { q, service, lat, lng } = req.query;
  let qb = admin.from("clinics").select("id,name,description,address,latitude,longitude,phone,opening_hours,services,verification_status");
  if (q) { const s = String(q).replace(/[%,()]/g, ""); qb = qb.or(`name.ilike.%${s}%,address.ilike.%${s}%`); }
  if (service) qb = qb.contains("services", [service]);
  const { data, error } = await qb.limit(100); if (error) return res.status(400).json({ error: error.message });
  let items = data;
  if (lat && lng) {
    const d = c => c.latitude == null ? 1e9 : 6371 * 2 * Math.asin(Math.sqrt(Math.sin((c.latitude - lat) * Math.PI / 360) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(c.latitude * Math.PI / 180) * Math.sin((c.longitude - lng) * Math.PI / 360) ** 2));
    items = data.map(c => ({ ...c, distance_km: c.latitude == null ? null : +d(c).toFixed(1) })).sort((a, b) => d(a) - d(b));
  }
  res.json(items);
});
r.get("/:id", async (req, res) => {
  const { data } = await admin.from("clinics").select("*").eq("id", req.params.id).single();
  if (!data) return res.status(404).json({ error: "Not found" }); res.json(data);
});
r.patch("/:id", requireAuth, requireRole("vet", "admin"), async (req, res) => {
  const { data: c } = await admin.from("clinics").select("owner_id").eq("id", req.params.id).single();
  if (!c || (c.owner_id !== req.user.id && !req.user.roles.includes("admin"))) return res.status(403).json({ error: "Forbidden" });
  const { name, description, address, latitude, longitude, phone, opening_hours, services } = req.body; // verification_status excluded on purpose
  const { data, error } = await admin.from("clinics").update({ name, description, address, latitude, longitude, phone, opening_hours, services }).eq("id", req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message }); res.json(data);
});
export default r;
