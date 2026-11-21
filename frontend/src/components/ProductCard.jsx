import { Link } from "react-router-dom";

export default function ProductCard({ p }) {
  const img = [...(p.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;

  return (
    <Link to={`/product/${p.id}`} className="card group relative block overflow-hidden transition hover:shadow-md">
      <div className="relative aspect-square bg-leaf-50 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs font-medium text-leaf-500">No image</div>
        )}

        {/* Condition Badge */}
        <span
          className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-xs backdrop-blur-xs ${
            p.condition === "used"
              ? "bg-amber-500/95 text-white"
              : "bg-leaf-700/90 text-white"
          }`}
        >
          {p.condition === "used" ? "Pre-Loved" : "Brand New"}
        </span>
      </div>

      <div className="p-3">
        <h3 className="truncate font-semibold text-gray-900 group-hover:text-leaf-800">{p.title}</h3>
        <p className="font-extrabold text-leaf-700">{p.currency || "$"}{Number(p.price).toFixed(2)}</p>
        <p className="mt-1 truncate text-xs text-gray-500">
          {p.pet_type ? p.pet_type.charAt(0).toUpperCase() + p.pet_type.slice(1) : "All pets"} · {p.location || p.profiles?.full_name || "Seller"}
        </p>
      </div>
    </Link>
  );
}
