import { Router } from "express"; import { admin } from "../supabase.js"; import { requireAuth, requireRole } from "../middleware/auth.js";
const r = Router(); r.use(requireAuth, requireRole("admin"));
const log = (req, action, target_type, target_id, details = {}) => admin.from("audit_log").insert({ admin_id: req.user.id, action, target_type, target_id, details });
r.get("/stats", async (_, res) => {
  const c = async t => (await admin.from(t).select("*", { count: "exact", head: true })).count;
  res.json({ users: await c("profiles"), products: await c("products"), clinics: await c("clinics"), reports: await c("reports") });
});
r.get("/reports", async (req, res) => {
  let q = admin.from("reports").select("*").order("created_at", { ascending: false });
  if (req.query.status) q = q.eq("status", req.query.status); res.json((await q).data);
});
r.patch("/reports/:id", async (req, res) => {
  const { status, admin_notes } = req.body;
  if (!["under_review", "resolved", "rejected"].includes(status)) return res.status(422).json({ error: "bad status" });
  const { data } = await admin.from("reports").update({ status, admin_notes, updated_at: new Date() }).eq("id", req.params.id).select().single();
  await log(req, "report_" + status, "report", req.params.id, { admin_notes }); res.json(data);
});
r.post("/listings/:id/remove", async (req, res) => { await admin.from("products").update({ status: "removed" }).eq("id", req.params.id); await log(req, "remove_listing", "product", req.params.id, req.body); res.status(204).end(); });
r.post("/users/:id/suspend", async (req, res) => { await admin.from("profiles").update({ suspended: !!req.body.suspended }).eq("id", req.params.id); await log(req, req.body.suspended ? "suspend" : "reinstate", "user", req.params.id, req.body); res.status(204).end(); });
r.post("/clinics/:id/verify", async (req, res) => { const s = req.body.status; if (!["verified", "rejected"].includes(s)) return res.status(422).json({ error: "bad status" }); await admin.from("clinics").update({ verification_status: s }).eq("id", req.params.id); await log(req, "clinic_" + s, "clinic", req.params.id); res.status(204).end(); });
export default r;
