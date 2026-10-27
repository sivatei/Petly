import { Link, useNavigate } from "react-router-dom"; import { useEffect, useState } from "react"; import { api } from "../lib/api"; import ProductCard from "../components/ProductCard";
const pets = [
  { name: "Dog", key: "dog" },
  { name: "Cat", key: "cat" },
  { name: "Bird", key: "bird" },
  { name: "Fish", key: "fish" },
  { name: "Small Pets", key: "small_pets" }
];

export default function Home() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api("/products?sort=newest").then(d => setItems(d.items.slice(0, 8))).catch(() => {});
    api("/categories").then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-leaf-100 p-8 md:p-14">
        <h1 className="max-w-xl text-4xl font-extrabold md:text-5xl">Everything Your Pet Needs, All in One Place.</h1>
        <form onSubmit={e => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q)}`); }} className="mt-6 flex max-w-xl gap-2">
          <input className="input" aria-label="Search" placeholder="Search products, brands, supplies…" value={q} onChange={e => setQ(e.target.value)} />
          <button className="btn">Search</button>
        </form>
      </section>

      {/* Shop by Pet */}
      <section>
        <h2 className="mb-3 text-xl font-bold">Shop by pet</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {pets.map(p => (
            <Link key={p.key} to={`/shop?pet_type=${p.key}`} className="card py-4 text-center font-semibold transition hover:bg-leaf-50 hover:shadow">
              {p.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by Category / Stuff */}
      {categories.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Shop by category</h2>
            <Link to="/shop" className="text-xs font-semibold text-leaf-700 hover:text-leaf-800 underline">View all &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-4">
            {categories.map(c => (
              <Link key={c.id} to={`/shop?category_id=${c.id}`} className="card p-4 transition hover:bg-leaf-50 hover:shadow">
                <span className="block font-semibold text-gray-900">{c.name}</span>
                <span className="mt-1 block text-xs text-leaf-700">Browse items &rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xl font-bold">Recently listed</h2>
        {items.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <p className="text-gray-500">No listings yet.</p>
        )}
      </section>
    <section className="card grid gap-4 p-6 md:grid-cols-2"><div><h2 className="text-xl font-bold">Buy & Sell Marketplace</h2><p className="mt-1 text-gray-600">Find or sell new and secondhand pet supplies. Products only — no live animals.</p><Link to="/marketplace" className="btn mt-3 inline-block">Browse marketplace</Link></div>
      <div><h2 className="text-xl font-bold">Vet Centre</h2><p className="mt-1 text-gray-600">Find clinics by name or city. Chat is for enquiries, not emergencies or diagnosis.</p><Link to="/vet" className="btn mt-3 inline-block">Find a clinic</Link></div></section>
    <section className="rounded-2xl bg-white p-6 text-sm text-gray-600"><b>Trust & safety:</b> verification badges appear only after admin review. Never pay outside agreed methods; report suspicious listings, users or clinics.</section></div>);
}
