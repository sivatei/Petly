import { Router } from "express"; import { admin } from "../supabase.js"; import { requireAuth, requireRole } from "../middleware/auth.js";
const r = Router();
const SORTS = { newest: ["created_at", false], price_asc: ["price", true], price_desc: ["price", false] };
r.get("/", async (req, res) => {
  const { q, pet_type, category_id, min, max, condition, brand, location, sort = "newest", page = 1 } = req.query;
  const size = 12, from = (Math.max(+page, 1) - 1) * size;
  let qb = admin.from("products").select("*, product_images(image_url,sort_order), profiles:seller_id(full_name)", { count: "exact" }).eq("status", "active");
  if (q) qb = qb.ilike("title", `%${String(q).replace(/[%,]/g, "")}%`);
  if (pet_type) qb = qb.ilike("pet_type", pet_type);
  if (category_id) qb = qb.eq("category_id", category_id);
  if (condition) qb = qb.eq("condition", condition);
  if (brand) qb = qb.ilike("brand", brand);
  if (location) qb = qb.ilike("location", `%${location}%`);
  if (min) qb = qb.gte("price", min); if (max) qb = qb.lte("price", max);
  const [col, asc] = SORTS[sort] || SORTS.newest;
  const { data, count, error } = await qb.order(col, { ascending: asc }).range(from, from + size - 1);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ items: data, total: count, page: +page });
});
r.get("/categories", async (_req, res) => {
  const { data, error } = await admin.from("categories").select("id, name, pet_type").order("id");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
r.get("/:id", async (req, res) => {
  const { data, error } = await admin.from("products").select("*, product_images(*), profiles:seller_id(id,full_name,avatar_url)").eq("id", req.params.id).neq("status", "removed").single();
  if (error) return res.status(404).json({ error: "Not found" }); res.json(data);
});
const FIELDS = ["title", "description", "category_id", "pet_type", "brand", "price", "currency", "condition", "location", "status"];
const pick = b => Object.fromEntries(FIELDS.filter(k => k in b).map(k => [k, b[k]]));
function validate(b) { const e = [];
  if (!b.title || b.title.trim().length < 3) e.push("title");
  if (!(Number(b.price) >= 0)) e.push("price");
  if (!["new", "used"].includes(b.condition)) e.push("condition"); return e; }
r.post("/", requireAuth, requireRole("seller", "admin"), async (req, res) => {
  const bad = validate(req.body); if (bad.length) return res.status(422).json({ error: "Invalid fields", fields: bad });
  const { data, error } = await admin.from("products").insert({ ...pick(req.body), status: "active", seller_id: req.user.id }).select().single();
  if (error) return res.status(400).json({ error: error.message }); res.status(201).json(data);
});
async function owned(req, res, next) {
  const { data } = await admin.from("products").select("seller_id").eq("id", req.params.id).single();
  if (!data) return res.status(404).json({ error: "Not found" });
  if (data.seller_id !== req.user.id && !req.user.roles.includes("admin")) return res.status(403).json({ error: "Not your listing" });
  next();
}
r.patch("/:id", requireAuth, owned, async (req, res) => {
  if (req.body.status && !["active", "sold", "unavailable"].includes(req.body.status)) return res.status(422).json({ error: "bad status" });
  const { data, error } = await admin.from("products").update({ ...pick(req.body), updated_at: new Date() }).eq("id", req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message }); res.json(data);
});
r.delete("/:id", requireAuth, owned, async (req, res) => { await admin.from("products").delete().eq("id", req.params.id); res.status(204).end(); });
export default r;
