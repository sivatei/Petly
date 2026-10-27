import { Router } from "express"; import { admin } from "../supabase.js"; import { requireAuth } from "../middleware/auth.js";
const r = Router(); const TYPES = ["product", "user", "clinic", "message", "review"];
r.post("/", requireAuth, async (req, res) => {
  const { target_type, target_id, reason, description, evidence_path } = req.body;
  if (!TYPES.includes(target_type) || !target_id || !reason) return res.status(422).json({ error: "target_type, target_id and reason are required" });
  const { data, error } = await admin.from("reports").insert({ reporter_id: req.user.id, target_type, target_id, reason, description, evidence_path }).select("id,status").single();
  if (error) return res.status(400).json({ error: error.message }); res.status(201).json(data);
});
export default r;
