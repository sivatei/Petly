import { useEffect, useState } from "react"; import { api } from "../lib/api";
export default function Vet() {
  const [q, setQ] = useState(""); const [list, setList] = useState(null); const [geo, setGeo] = useState(null);
  useEffect(() => { const p = new URLSearchParams({ q }); if (geo) { p.set("lat", geo.lat); p.set("lng", geo.lng); } api("/clinics?" + p).then(setList).catch(() => setList([])); }, [q, geo]);
  const locate = () => navigator.geolocation.getCurrentPosition(p => setGeo({ lat: p.coords.latitude, lng: p.coords.longitude }), () => alert("Location denied. Search by city instead."));
  return (<div><h1 className="mb-4 text-2xl font-extrabold">Vet Centre</h1>
    <div className="mb-5 flex gap-2"><input className="input" placeholder="Clinic name or city" value={q} onChange={e => setQ(e.target.value)} aria-label="Search clinics" /><button className="btn whitespace-nowrap" onClick={locate}>Near me</button></div>
    <p className="mb-4 text-xs text-gray-500">Directory only. For emergencies call the clinic directly; chat gives no medical advice.</p>
    {!list ? <p>Loading…</p> : !list.length ? <p className="text-gray-500">No clinics found.</p> :
      <div className="grid gap-4 md:grid-cols-2">{list.map(c => <article key={c.id} className="card p-4"><h2 className="font-bold">{c.name} {c.verification_status === "verified" && <span className="rounded-full bg-leaf-100 px-2 text-xs text-leaf-700">Verified</span>}</h2>
        <p className="text-sm text-gray-600">{c.address || "Address unavailable"}{c.distance_km != null && ` · ${c.distance_km} km`}</p><p className="text-sm">{c.phone || "Phone unavailable"}</p>
        <p className="mt-1 text-xs text-gray-500">{c.services?.join(", ") || "Services not listed"}</p></article>)}</div>}</div>);
}
