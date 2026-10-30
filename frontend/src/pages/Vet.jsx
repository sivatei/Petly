import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  Stethoscope,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react";

const COMMON_SERVICES = [
  "All Services",
  "Emergency Care",
  "Surgery",
  "Dental Care",
  "Vaccinations",
  "Wellness Exams",
  "Exotic Pet Care"
];

export default function Vet() {
  const [q, setQ] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [list, setList] = useState(null);
  const [geo, setGeo] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (selectedService && selectedService !== "All Services") p.set("service", selectedService);
    if (geo) {
      p.set("lat", geo.lat);
      p.set("lng", geo.lng);
    }
    api("/clinics?" + p.toString())
      .then(setList)
      .catch(() => setList([]));
  }, [q, selectedService, geo]);

  const locate = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        alert("Location access denied or unavailable. You can search by clinic name or city instead.");
        setLocating(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-leaf-100/70 p-6 sm:p-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-leaf-200/80 px-3 py-1 text-xs font-bold text-leaf-800 mb-3">
            <Stethoscope size={14} /> Official Veterinary Directory
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Find Trusted Veterinary Care
          </h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Connect with verified veterinary hospitals, emergency clinics, dental specialists, and certified exotic care providers near you.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <input
              className="input flex-1 bg-white shadow-xs"
              placeholder="Search by clinic name, address, or city (e.g. New York, Brooklyn)…"
              value={q}
              onChange={e => setQ(e.target.value)}
              aria-label="Search clinics"
            />
            <button
              className="btn flex items-center justify-center gap-2 whitespace-nowrap shadow-xs"
              onClick={locate}
              disabled={locating}
            >
              <Navigation size={16} />
              {locating ? "Locating…" : (geo ? "📍 Nearby Active" : "Near Me")}
            </button>
          </div>
        </div>
      </div>

      {/* Service Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="mr-1 text-xs font-semibold text-gray-500">Filter by service:</span>
        {COMMON_SERVICES.map(s => {
          const active = (s === "All Services" && !selectedService) || selectedService === s;
          return (
            <button
              key={s}
              onClick={() => setSelectedService(s === "All Services" ? "" : s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? "bg-leaf-600 text-white shadow-xs font-semibold"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-leaf-50"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Emergency Notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <b>Emergency Medical Disclaimer:</b> Petly is a directory platform. In critical or urgent medical emergencies, immediately phone the hospital directly or transport your pet to the nearest 24/7 ER facility.
        </div>
      </div>

      {/* Clinics Grid */}
      {!list ? (
        <div className="py-12 text-center text-gray-500">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-leaf-300 border-t-leaf-600" />
          <p className="mt-3 text-sm">Searching veterinary directory…</p>
        </div>
      ) : list.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Stethoscope className="mx-auto mb-3 text-gray-300" size={40} />
          <p className="text-base font-semibold text-gray-800">No clinics found matching your search</p>
          <p className="text-xs text-gray-500 mt-1">Try clearing your filters or searching by a broader city name.</p>
          <button
            onClick={() => { setQ(""); setSelectedService(""); setGeo(null); }}
            className="btn mt-4 text-xs inline-block"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {list.map(c => {
            const is24Hours = c.name?.toLowerCase().includes("24/7") ||
              c.description?.toLowerCase().includes("24/7") ||
              JSON.stringify(c.opening_hours || {}).toLowerCase().includes("24 hours");

            return (
              <article
                key={c.id}
                className="card group flex flex-col justify-between p-5 transition hover:shadow-md hover:border-leaf-300"
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {c.verification_status === "verified" && (
                        <span className="flex items-center gap-1 rounded-full bg-leaf-100 px-2.5 py-0.5 text-[11px] font-bold text-leaf-800">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      )}
                      {is24Hours && (
                        <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                          <Clock size={12} /> 24/7 ER
                        </span>
                      )}
                    </div>

                    {c.distance_km != null && (
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                        📍 {c.distance_km} km away
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-leaf-700 transition">
                    <Link to={`/vet/${c.id}`} className="hover:underline">
                      {c.name}
                    </Link>
                  </h2>

                  {/* Location & Phone */}
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p className="flex items-start gap-1.5">
                      <MapPin size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{c.address || "Address unavailable"}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone size={15} className="text-gray-400 flex-shrink-0" />
                      <span>{c.phone || "Phone unavailable"}</span>
                    </p>
                  </div>

                  {/* Description preview */}
                  {c.description && (
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  )}

                  {/* Service tags */}
                  {c.services && c.services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {c.services.slice(0, 4).map((s, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                        >
                          {s}
                        </span>
                      ))}
                      {c.services.length > 4 && (
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
                          +{c.services.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action footer */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
                  {c.phone ? (
                    <a
                      href={`tel:${c.phone}`}
                      className="text-xs font-semibold text-leaf-700 hover:underline"
                    >
                      Call: {c.phone}
                    </a>
                  ) : <span />}

                  <Link
                    to={`/vet/${c.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-leaf-700 hover:text-leaf-800 transition"
                  >
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
