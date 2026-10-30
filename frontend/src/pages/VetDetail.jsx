import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import {
  Stethoscope,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Star,
  ArrowLeft,
  CheckCircle2,
  Navigation,
  Flag
} from "lucide-react";

export default function VetDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Review state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewErr, setReviewErr] = useState("");

  // Report state
  const [reportMsg, setReportMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");
    api(`/clinics/${id}`)
      .then(data => {
        setClinic(data);
        setLoading(false);
      })
      .catch(e => {
        setErr(e.message || "Failed to load clinic details");
        setLoading(false);
      });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      nav("/login");
      return;
    }
    setSubmittingReview(true);
    setReviewMsg("");
    setReviewErr("");

    try {
      const newReview = await api(`/clinics/${id}/reviews`, {
        method: "POST",
        body: { rating, comment }
      });
      setClinic(prev => ({
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])]
      }));
      setComment("");
      setReviewMsg("Thank you! Your review has been published.");
    } catch (e) {
      setReviewErr(e.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReport = async () => {
    if (!user) {
      nav("/login");
      return;
    }
    const reason = prompt("Why are you reporting this clinic listing? (e.g. Inaccurate information, closed clinic, safety concerns)");
    if (!reason || !reason.trim()) return;

    try {
      await api("/reports", {
        method: "POST",
        body: {
          target_type: "clinic",
          target_id: id,
          reason: reason.trim()
        }
      });
      setReportMsg("Report submitted to Petly administrators for review. Thank you for keeping our directory trustworthy.");
      setTimeout(() => setReportMsg(""), 6000);
    } catch (e) {
      alert(e.message || "Failed to submit report");
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-leaf-200 border-t-leaf-600" />
        <p className="mt-4 text-sm text-gray-500">Loading clinic details…</p>
      </div>
    );
  }

  if (err || !clinic) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <AlertCircle className="mx-auto mb-3 text-red-500" size={36} />
        <h1 className="text-xl font-bold text-gray-900">Clinic Not Found</h1>
        <p className="mt-2 text-sm text-gray-600">{err || "The veterinary clinic you are looking for does not exist."}</p>
        <Link to="/vet" className="btn mt-6 inline-block">
          &larr; Back to Vet Centre
        </Link>
      </div>
    );
  }

  const is24Hours = clinic.name?.toLowerCase().includes("24/7") ||
    clinic.description?.toLowerCase().includes("24/7") ||
    JSON.stringify(clinic.opening_hours || {}).toLowerCase().includes("24 hours");

  const hasEmergency = is24Hours || clinic.services?.some(s => s.toLowerCase().includes("emergency"));

  const reviews = clinic.reviews || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  // Directions URL (Google Maps search)
  const directionsUrl = clinic.latitude && clinic.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name + " " + (clinic.address || ""))}`;

  // Format opening hours helper
  const renderHours = (hours) => {
    if (!hours || typeof hours !== "object" || Object.keys(hours).length === 0) {
      return <p className="text-sm text-gray-500">Contact clinic for daily working hours.</p>;
    }
    const labels = {
      mon_sun: "Mon – Sun",
      mon_fri: "Mon – Fri",
      sat: "Saturday",
      sun: "Sunday",
      sat_sun: "Sat – Sun"
    };

    return (
      <div className="space-y-2">
        {Object.entries(hours).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between border-b border-gray-100 py-1.5 text-sm">
            <span className="font-medium text-gray-700">{labels[key] || key.replace("_", " ").toUpperCase()}</span>
            <span className={`font-semibold ${String(value).toLowerCase().includes("closed") ? "text-red-500" : "text-gray-900"}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/vet"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-700 transition hover:text-leaf-800"
        >
          <ArrowLeft size={16} /> Back to Vet Centre Directory
        </Link>
      </div>

      {/* Main Clinic Card */}
      <div className="card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-700">
                <Stethoscope size={14} /> Veterinary Hospital
              </span>
              {clinic.verification_status === "verified" && (
                <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <ShieldCheck size={14} /> Verified Practice
                </span>
              )}
              {hasEmergency && (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                  <AlertCircle size={14} /> 24/7 Emergency Care
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              {clinic.name}
            </h1>

            {/* Rating overview */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= (Number(avgRating) || 5) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-900">{avgRating ? `${avgRating} / 5` : "5.0 / 5"}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">
                {reviews.length > 0 ? `${reviews.length} patient review${reviews.length > 1 ? "s" : ""}` : "Verified practice ratings"}
              </span>
            </div>

            <p className="text-base leading-relaxed text-gray-700 pt-1">
              {clinic.description || "Comprehensive veterinary healthcare clinic offering routine and specialized animal treatment."}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[240px]">
            {clinic.phone && (
              <a
                href={`tel:${clinic.phone}`}
                className="btn flex items-center justify-center gap-2 text-center text-sm font-bold shadow-sm"
              >
                <Phone size={16} /> Call Clinic
              </a>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-leaf-600 bg-white px-5 py-2 text-sm font-bold text-leaf-700 transition hover:bg-leaf-50"
            >
              <Navigation size={16} /> Get Directions <ExternalLink size={14} className="opacity-60" />
            </a>
            <Link
              to="/messages"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <MessageCircle size={16} /> Contact Desk
            </Link>
            <button
              onClick={handleReport}
              className="mt-1 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-600 transition"
            >
              <Flag size={12} /> Report clinic listing
            </button>
          </div>
        </div>

        {reportMsg && (
          <div className="mt-4 rounded-xl bg-leaf-50 p-3 text-xs font-semibold text-leaf-800">
            {reportMsg}
          </div>
        )}
      </div>

      {/* Grid: Details, Hours & Services */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Contact & Location Info */}
        <div className="card p-6 space-y-4 md:col-span-1">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={18} className="text-leaf-600" /> Location & Contact
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Street Address</span>
              <p className="mt-0.5 font-medium text-gray-800">{clinic.address || "Address unavailable"}</p>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Direct Phone</span>
              {clinic.phone ? (
                <a href={`tel:${clinic.phone}`} className="mt-0.5 font-bold text-leaf-700 hover:underline">
                  {clinic.phone}
                </a>
              ) : (
                <p className="mt-0.5 text-gray-500">Not provided</p>
              )}
            </div>

            {clinic.latitude && clinic.longitude && (
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Coordinates</span>
                <p className="mt-0.5 text-xs text-gray-500 font-mono">
                  {clinic.latitude.toFixed(4)}, {clinic.longitude.toFixed(4)}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-leaf-50 py-2.5 text-center text-xs font-bold text-leaf-700 transition hover:bg-leaf-100"
            >
              Open in Google Maps &rarr;
            </a>
          </div>
        </div>

        {/* Opening Hours Schedule */}
        <div className="card p-6 space-y-4 md:col-span-1">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-leaf-600" /> Opening Hours
          </h2>
          {renderHours(clinic.opening_hours)}
          <p className="text-[11px] text-gray-400">
            For urgent holiday or overnight hours, please phone ahead to confirm staff availability.
          </p>
        </div>

        {/* Specialized Services */}
        <div className="card p-6 space-y-4 md:col-span-1">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-leaf-600" /> Medical Services
          </h2>

          {clinic.services && clinic.services.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {clinic.services.map((service, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-leaf-100 bg-leaf-50/70 px-2.5 py-1 text-xs font-semibold text-leaf-800"
                >
                  ✓ {service}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Comprehensive pet healthcare services.</p>
          )}

          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 leading-relaxed">
            <b>Emergency Notice:</b> Petly directory chat does not provide instant veterinary diagnosis. In life-threatening pet emergencies, immediately transport your pet to the nearest emergency room.
          </div>
        </div>
      </div>

      {/* Reviews & Patient Ratings Section */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Patient Reviews & Feedback</h2>
            <p className="text-xs text-gray-500">Read what pet owners say about {clinic.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900">{avgRating || "5.0"}</span>
            <div className="text-xs text-gray-500">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={13} className="fill-amber-400" />
                ))}
              </div>
              <span>{reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
            </div>
          </div>
        </div>

        {/* Leave a Review Form */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
          <h3 className="text-sm font-bold text-gray-900">Share your experience</h3>
          <p className="text-xs text-gray-500 mb-3">Help fellow pet parents by reviewing this clinic's doctors and care.</p>

          {reviewMsg && (
            <div className="mb-3 rounded-xl bg-leaf-100 p-3 text-xs font-semibold text-leaf-800">
              {reviewMsg}
            </div>
          )}
          {reviewErr && (
            <div className="mb-3 rounded-xl bg-red-100 p-3 text-xs font-semibold text-red-700">
              {reviewErr}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition hover:scale-110"
                    aria-label={`${star} star rating`}
                  >
                    <Star
                      size={24}
                      className={
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-gray-700">
                  {rating === 5 ? "5 - Excellent" :
                   rating === 4 ? "4 - Very Good" :
                   rating === 3 ? "3 - Average" :
                   rating === 2 ? "2 - Below Average" : "1 - Poor"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Feedback & Comment</label>
              <textarea
                rows={3}
                className="input text-sm"
                placeholder="Describe your visit, doctor friendliness, waiting times, and clinic care…"
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="btn text-sm font-semibold disabled:opacity-50"
            >
              {submittingReview ? "Submitting Review…" : (user ? "Submit Review" : "Sign In to Review")}
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <Star className="mx-auto mb-2 text-gray-300" size={32} />
              <p className="text-sm font-medium">Be the first to review {clinic.name}!</p>
            </div>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-xs font-bold text-leaf-800">
                      {(r.profiles?.full_name || "Pet Owner").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{r.profiles?.full_name || "Verified Pet Owner"}</h4>
                      <span className="text-[11px] text-gray-400">
                        {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= r.rating ? "fill-amber-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                </div>

                {r.comment && (
                  <p className="mt-2 text-sm text-gray-700 pl-10 leading-relaxed">
                    "{r.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
