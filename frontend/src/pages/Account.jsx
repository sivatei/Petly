import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { User, Mail, Phone, ShieldCheck, Heart, Bell, MessageCircle, LogOut, Check, ShoppingBag } from "lucide-react";

export default function Account() {
  const { user, profile, roles, updateProfile, signOut } = useAuth();
  const nav = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  if (!user) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
          <User size={32} />
        </div>
        <h1 className="text-2xl font-bold">Sign In Required</h1>
        <p className="mt-2 text-sm text-gray-600">Please sign in to view and manage your Petly account details.</p>
        <Link to="/login" className="btn mt-6 inline-block w-full">Sign In / Register</Link>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setErr("");

    const { error } = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim()
    });

    setSaving(false);
    if (error) {
      setErr(error.message || "Failed to update profile");
    } else {
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3500);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    nav("/");
  };

  const initials = (fullName || user.email || "U")
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Profile Card */}
      <div className="card relative overflow-hidden p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-leaf-100/50" />
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-leaf-600 text-2xl font-bold text-white shadow-md">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-extrabold text-gray-900">{fullName || "Petly Member"}</h1>
              {roles.map(r => (
                <span
                  key={r}
                  className="rounded-full bg-leaf-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-leaf-800"
                >
                  {r}
                </span>
              ))}
            </div>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 sm:justify-start">
              <Mail size={15} /> {user.email}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              Member since {new Date(user.created_at || Date.now()).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link to="/wishlist" className="card flex flex-col items-center p-4 text-center transition hover:bg-leaf-50 hover:shadow">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Heart size={20} />
          </div>
          <span className="mt-2 text-sm font-semibold">Wishlist</span>
          <span className="text-xs text-gray-500">Saved items</span>
        </Link>

        <Link to="/notifications" className="card flex flex-col items-center p-4 text-center transition hover:bg-leaf-50 hover:shadow">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Bell size={20} />
          </div>
          <span className="mt-2 text-sm font-semibold">Notifications</span>
          <span className="text-xs text-gray-500">Updates & alerts</span>
        </Link>

        <Link to="/messages" className="card flex flex-col items-center p-4 text-center transition hover:bg-leaf-50 hover:shadow">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-600">
            <MessageCircle size={20} />
          </div>
          <span className="mt-2 text-sm font-semibold">Messages</span>
          <span className="text-xs text-gray-500">Inquiries & chat</span>
        </Link>

        <Link to="/shop" className="card flex flex-col items-center p-4 text-center transition hover:bg-leaf-50 hover:shadow">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <ShoppingBag size={20} />
          </div>
          <span className="mt-2 text-sm font-semibold">Pet Shop</span>
          <span className="text-xs text-gray-500">Explore products</span>
        </Link>
      </div>

      {/* Edit Profile Form */}
      <div className="card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
        <p className="mt-0.5 text-xs text-gray-500">Update your account name and contact number for sellers and clinics.</p>

        {msg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-leaf-50 p-3 text-sm text-leaf-800">
            <Check size={18} className="text-leaf-600" /> {msg}
          </div>
        )}
        {err && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {err}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600">Full Name</label>
            <input
              type="text"
              className="input mt-1"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. John Doe or Petly Store"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600">Email Address</label>
            <div className="relative mt-1">
              <input
                type="email"
                disabled
                className="input bg-gray-50 text-gray-500 cursor-not-allowed pr-24"
                value={user.email}
              />
              <span className="absolute right-3 top-2.5 flex items-center gap-1 text-xs font-medium text-leaf-600">
                <ShieldCheck size={14} /> Verified
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">Email is linked to your login credentials.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600">Phone Number</label>
            <input
              type="tel"
              className="input mt-1"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn disabled:opacity-50"
            >
              {saving ? "Saving Changes…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
