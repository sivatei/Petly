import { Link } from "react-router-dom";
export default function ProductCard({ p }) {
  const img = [...(p.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;
  return (<Link to={`/product/${p.id}`} className="card block overflow-hidden transition hover:shadow-md">
    <div className="aspect-square bg-leaf-50">{img ? <img src={img} alt={p.title} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-leaf-500">No image</div>}</div>
    <div className="p-3"><h3 className="truncate font-semibold">{p.title}</h3>
      <p className="font-extrabold text-leaf-700">{p.currency} {Number(p.price).toFixed(2)}</p>
      <p className="text-xs text-gray-500">{p.pet_type || "All pets"} · {p.condition === "new" ? "New" : "Secondhand"} · {p.profiles?.full_name || "Seller"}</p></div></Link>);
}
