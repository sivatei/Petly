import { useEffect, useState } from "react"; import { useParams, useNavigate } from "react-router-dom"; import { api } from "../lib/api"; import { useAuth } from "../lib/auth"; import { supabase } from "../lib/supabase";
export default function Product() {
  const { id } = useParams(); const { user } = useAuth(); const nav = useNavigate(); const [p, setP] = useState(null); const [msg, setMsg] = useState("");
  useEffect(() => { api("/products/" + id).then(setP).catch(e => setMsg(e.message)); }, [id]);
  const need = fn => () => user ? fn() : nav("/login");
  const wish = need(async () => {
    const { error } = await supabase.from("wishlists").insert({ user_id: user.id, product_id: id });
    setMsg(error ? "Already saved in your wishlist!" : "✓ Saved to your wishlist!");
  });
  const report = need(async () => {
    const reason = prompt("Why are you reporting this listing?");
    if (!reason) return;
    await api("/reports", { method: "POST", body: { target_type: "product", target_id: id, reason } });
    setMsg("Report submitted. Thank you.");
  });

  if (!p) return <p className="text-gray-500 py-8">{msg || "Loading product details…"}</p>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="grid gap-2">
        {(p.product_images || []).map(i => (
          <img key={i.id} src={i.image_url} alt={p.title} className="rounded-2xl border border-gray-100 shadow-sm object-cover max-h-[460px] w-full" />
        ))}
      </div>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{p.title}</h1>
          <p className="mt-2 text-2xl font-bold text-leaf-700">{p.currency} {Number(p.price).toFixed(2)}</p>
          <p className="mt-1 text-xs text-gray-500">
            {p.condition === "new" ? "New Condition" : "Secondhand"} · Status: {p.status} · Seller: {p.profiles?.full_name || "Petly Official"}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-gray-700">{p.description}</p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button className="btn" onClick={need(() => nav("/messages"))}>
            Contact seller
          </button>
          <button
            className="rounded-full border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:border-leaf-600 hover:bg-leaf-50 transition"
            onClick={wish}
          >
            ♥ Wishlist
          </button>
          <button className="text-xs text-gray-500 underline hover:text-red-600 transition" onClick={report}>
            Report listing
          </button>
        </div>

        {msg && (
          <div className="rounded-xl bg-leaf-50 p-3 text-sm font-medium text-leaf-800">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
