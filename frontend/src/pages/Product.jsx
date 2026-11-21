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
        {p.product_images && p.product_images.length > 0 ? (
          p.product_images.map(i => (
            <img key={i.id || i.image_url} src={i.image_url} alt={p.title} className="rounded-2xl border border-gray-100 shadow-sm object-cover max-h-[460px] w-full" />
          ))
        ) : (
          <div className="flex aspect-square max-h-[460px] w-full items-center justify-center rounded-2xl bg-leaf-50 text-leaf-600 font-semibold text-sm border border-gray-100">
            No image available
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{p.title}</h1>
          <p className="mt-2 text-2xl font-bold text-leaf-700">{p.currency || "$"}{Number(p.price).toFixed(2)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className={`rounded-full px-2.5 py-0.5 font-bold ${p.condition === "used" ? "bg-amber-100 text-amber-800" : "bg-leaf-100 text-leaf-800"}`}>
              {p.condition === "used" ? "Pre-Loved / Secondhand" : "Brand New"}
            </span>
            <span>·</span>
            <span>Seller: {p.profiles?.full_name || "Community Seller"}</span>
            {p.location && (
              <>
                <span>·</span>
                <span>{p.location}</span>
              </>
            )}
          </div>
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
