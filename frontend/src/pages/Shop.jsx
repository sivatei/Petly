import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";

const PET_TYPES = [
  { label: "Dogs", value: "dog" },
  { label: "Cats", value: "cat" },
  { label: "Birds", value: "bird" },
  { label: "Fish", value: "fish" },
  { label: "Small Pets", value: "small_pets" }
];

export default function Shop({ title, condition }) {
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");

  const qs = new URLSearchParams(sp);
  if (condition && !qs.get("condition")) qs.set("condition", condition);

  useEffect(() => {
    api("/categories").then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setData(null);
    api("/products?" + qs).then(setData).catch(e => setErr(e.message));
  }, [sp.toString(), condition]);

  const set = (k, v) => {
    const n = new URLSearchParams(sp);
    v ? n.set(k, v) : n.delete(k);
    if (k !== "page") n.delete("page");
    setSp(n);
  };

  const page = +(sp.get("page") || 1);
  const selectedCategory = sp.get("category_id") || "";
  const selectedPet = sp.get("pet_type") || "";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {(selectedPet || selectedCategory || sp.get("q") || sp.get("min") || sp.get("max")) && (
          <button
            className="text-xs font-semibold text-leaf-700 hover:text-leaf-800 underline"
            onClick={() => setSp({})}
          >
            Reset all filters
          </button>
        )}
      </div>

      <div className="card mb-6 p-4">
        {/* Main Filter Grid */}
        <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-6">
          <input
            className="input md:col-span-2"
            placeholder="Search products, brands…"
            defaultValue={sp.get("q") || ""}
            onKeyDown={e => e.key === "Enter" && set("q", e.target.value)}
            aria-label="Search"
          />

          {/* Animal Type Filter */}
          <select
            className="input"
            value={selectedPet}
            onChange={e => set("pet_type", e.target.value)}
            aria-label="Pet type"
          >
            <option value="">All Pets</option>
            {PET_TYPES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            className="input"
            value={selectedCategory}
            onChange={e => set("category_id", e.target.value)}
            aria-label="Category"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Min / Max Price */}
          <div className="flex gap-1.5">
            <input
              className="input w-1/2"
              type="number"
              min="0"
              placeholder="Min $"
              value={sp.get("min") || ""}
              onChange={e => set("min", e.target.value)}
            />
            <input
              className="input w-1/2"
              type="number"
              min="0"
              placeholder="Max $"
              value={sp.get("max") || ""}
              onChange={e => set("max", e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            className="input"
            value={sp.get("sort") || "newest"}
            onChange={e => set("sort", e.target.value)}
            aria-label="Sort"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Quick Category Badges */}
        {categories.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
            <span className="mr-1 text-xs font-semibold text-gray-500">Categories:</span>
            <button
              onClick={() => set("category_id", "")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                !selectedCategory
                  ? "bg-leaf-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map(c => {
              const active = selectedCategory === String(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => set("category_id", active ? "" : String(c.id))}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-leaf-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {err && <p role="alert" className="text-red-600">{err}</p>}
      {!data && !err && <p>Loading…</p>}

      {data && (
        data.items.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.items.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
            <p className="text-base font-medium">No products match your filters.</p>
            <button
              className="mt-3 text-xs font-semibold text-leaf-700 underline"
              onClick={() => setSp({})}
            >
              Clear filters and view all
            </button>
          </div>
        )
      )}

      {data && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            disabled={page <= 1}
            className="btn disabled:opacity-40"
            onClick={() => set("page", page - 1)}
          >
            Prev
          </button>
          <button
            disabled={page * 12 >= data.total}
            className="btn disabled:opacity-40"
            onClick={() => set("page", page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
